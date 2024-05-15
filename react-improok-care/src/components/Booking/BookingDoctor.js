import { useContext, useEffect, useRef, useState } from "react";
import "./BookingDoctor.css"
import { useParams, Link } from "react-router-dom";
import Apis, { SERVER, authApi, endpoints } from "../../configs/Apis";
import verified from "../../assets/images/verified.svg"
import Spinner from "../../layout/Spinner";
import googleplay from "../../assets/images/googleplay.svg"
import appstore from "../../assets/images/appstore.svg"
import { UserContext, WebSocketContext } from "../../App";
import GoogleMapAPI from "../../utils/GoogleMapAPI";
import { Button, Form, Image, ListGroup } from "react-bootstrap";
import Moment from "react-moment";
import { Rating, Typography } from "@mui/material";
import { Chat } from "@mui/icons-material";
import { toast } from "react-toastify";
// import Message from "./Message";
// import { MessageBox } from "react-chat-elements";
import 'react-chat-elements/dist/main.css'
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import MessageChat from "./MessageChat";
import Pagination from "../../utils/Pagination"
import { reConnectNotification } from "../../utils/WebSocket";
import cookie from "react-cookies";

var stompClient = null;
// var clientStomp = null;

const BookingDoctor = () => {
    const { profileDoctorId } = useParams();
    const [doctorDetail, setDoctorDetail] = useState('');
    const [loading, setLoading] = useState(false);
    const [current_user,] = useContext(UserContext)
    const [webSocket,] = useContext(WebSocketContext);
    const [comment, setComment] = useState([]);
    const [content, setContent] = useState(null);
    const [rating, setRating] = useState(1);
    const [userDoctorId, setUserDoctorId] = useState(null)

    const [updateRating, setUpdateRating] = useState(null)
    const [updateContent, setUpdateContent] = useState(null)

    const [selectedPage, setSelectedPage] = useState('1');
    const [totalCommentPages, setTotalCommentPages] = useState('1');

    const [editingIndex, setEditingIndex] = useState(-1);
    const [selectedCommentId, setSelectedCommentId] = useState('');

    const [showChatRoom, setShowChatRoom] = useState(false);

    const [disconnected, setDisconnected] = useState(false);

    const [listMessage, setListMessage] = useState([]);

    // const [commentUpdate, setCommentUpdate] = useState(null);

    // const [selectedSortDate, setSelectedDate] = useState('1');
    // const [selectedSortRating, selectedSorRating] = useState('1');

    const [dateSort, setDateSort] = useState(null);
    const [ratingSort, setRatingSort] = useState(null);

    // const [messageContent, setMessageContent] = useState(null);

    const avatar = useRef();
    // const updateAvatar = useRef();

    const connect = () => {
        let Sock = new SockJS(`${SERVER}${endpoints['web-socket']}`);
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        stompClient.subscribe('/user/' + current_user?.userId + '/private', onPrivateMessage);
        // stompClient.subscribe('/user/private', onPrivateMessage);
    }

    const onError = (err) => {
        console.log(err);
    }

    const onPrivateMessage = (payload) => {
        console.log("ĐÂY LÀ PAYLOAD");
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        console.log("PAYLOAD LÀM SẠCH");
        console.log(payloadData);
        // setListMessage(current => {
        //     return {...current, payloadData}
        // })
        setListMessage(prevList => [...prevList, payloadData], () => {
            console.log("List sau làm sạch");
            console.log(listMessage);
        });

    }

    const handleClick = (e) => {
        connect();
        setShowChatRoom(true);
        viewUserMessage(e);
    };

    const handleClose = () => {
        setShowChatRoom(false);
        if (disconnected === false)
            setDisconnected(true);
    }

    useEffect(() => {
        const loadProfileDoctorById = async () => {
            try {
                setLoading(true);
                let res = await Apis.get(endpoints['load-profile-doctor-by-Id'](profileDoctorId));
                setDoctorDetail(res.data);
                console.log(res.data.userId.userId);
                setUserDoctorId(res.data.userId.userId);
                console.log(res.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
        loadProfileDoctorById();
        // reConnectNotification(false, current_user.userId)
        // console.log("Booking doctor", webSocket);
        // console.log("Booking connect", webSocket.ws.connected)
        let client = cookie.load("socket")
        console.log("Client", client?.connected);
        if (current_user && client) {
            cookie.remove("socket")
            reConnectNotification(false, current_user?.userId);
        }
    }, [profileDoctorId])

    // const loadComment = async () => {
    //     let e = `${endpoints['search-comments']}?profileDoctorId=${profileDoctorId}`;
    //     let res = await Apis.get(e);

    //     setComment(res.data.content);
    //     console.log(res.data.content);
    // }

    const updateComment = async (e, c) => {
        e.preventDefault();

        const process = async () => {
            try {
                console.log(c.commentId, current_user?.userId, c.content, c.rating)
                let form = new FormData();
                form.append("commentId", c.commentId)
                form.append("userId", current_user?.userId);
                form.append("content", updateContent !== null ? updateContent : c.content);
                form.append("rating", updateRating !== null ? updateRating : c.rating);

                if (avatar.current.files[0] !== undefined)
                    form.append("avatar", avatar.current.files[0]);
                else
                    form.append("avatar", new Blob());

                // console.log(c.commentId, c.userId.userId, current_user.userId, content, rating)
                console.log("userId đang đăng nhập", current_user?.userId);
                console.log("user của comment", c.userId.userId);

                setLoading(true);

                let res = await authApi().post(endpoints['update-comment'], form, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (res.data === "Cập nhật bình luận thành công!") {
                    toast.success(res.data)
                    loadComment();
                    handleCancel();
                }
                setLoading(false);
            } catch (error) {
                // if (error.request.responseText === "Không tìm thấy bình luận để cập nhật!")
                //     toast.error(error.request.responseText);
                // else if (error.request.responseText === "Bình luận này bạn không được phép sửa!")
                //     toast.error(error.request.responseText);
                console.log(error);
            }
        }
        process();
    }

    const handleEdit = (index, commentId) => {
        setEditingIndex(index);
        setSelectedCommentId(commentId)
    };

    const handleCancel = () => {
        setEditingIndex(-1);
    };

    const loadComment = async () => {
        try {
            setLoading(true);
            let res = await Apis.get(endpoints['load-comments-page'](profileDoctorId))
            setComment(res.data.content);
            setTotalCommentPages(res.data.totalPages);
            console.log(res.data.content);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    const loadCommentPage = async (pageNumber) => {
        try {
            setLoading(true);
            let e = `${endpoints['load-comments-page'](profileDoctorId)}`;
            // let pageNumber = document.getElementsByClassName("active").id;
            console.log(pageNumber)
            if (pageNumber !== null && !isNaN(pageNumber) && pageNumber !== undefined) {
                e += `?pageNumber=${pageNumber - 1}&`
            }
            else {
                e += `?`
            }
            let sortDate = dateSort;
            let sortRating = ratingSort;
            if (sortDate !== null && sortDate !== "No Sort")
                e += `sortDate=${sortDate}&`
            if (sortRating !== null && sortRating !== "No Sort")
                e += `sortRating=${sortRating}`
            console.log(e);
            let res = await Apis.get(e);
            setComment(res.data.content);
            // setUrlUser(e);
            setTotalCommentPages(res.data.totalPages);
            console.log(res.data.totalPages);
            console.log(e);
            // navigate(url);
            setLoading(false);
            console.log(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadCommentPage();
        loadComment();
    }, [profileDoctorId]);

    const commentPages = Array.from({ length: totalCommentPages }, (_, index) => index + 1);
    const handleCommentPageChange = (pageNumber) => {
        // TODO: Xử lý sự kiện khi người dùng chuyển trang
        setSelectedPage(pageNumber);
        loadCommentPage(pageNumber);
        console.log(`Chuyển đến trang ${pageNumber}`);
    };

    const addComment = async (evt) => {
        evt.preventDefault();
        setLoading(true);

        let form = new FormData();
        form.append("profileDoctorId", profileDoctorId);
        form.append("userId", current_user.userId);
        form.append("content", content);
        form.append("rating", rating);
        // console.log(avatar.current.files[0]);
        if (avatar.current.files[0] !== undefined && avatar !== null) {
            form.append("avatar", avatar.current.files[0]);
        } else {
            form.append("avatar", new Blob());
        }
        console.log(doctorDetail.profileDoctorId, current_user?.userId, content, rating, avatar);
        try {
            let res = await authApi().post(endpoints['add-comment'], form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success(res.data);
            setContent("");
            loadComment();
            // addCommentNotification(content)
            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error.response.data === "Chưa khám không thể bình luận!")
                toast.error(error.response.data)
            else
                toast.error(error.response.data)
            console.log(error);
        }
    };

    const viewUserMessage = () => {
        const process = async () => {
            try {
                setLoading(true);
                const res = await authApi().get(endpoints['get-message-for-all-view'](doctorDetail.profileDoctorId, current_user.userId));
                setListMessage(res.data);
                console.log(res.data);
                console.log(listMessage);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
        process();
    }

    // const addMessage = async (evt) => {
    //     evt.preventDefault();
    //     setLoading(true);

    //     let form = new FormData();
    //     form.append("profileDoctorId", doctorDetail.profileDoctorId);
    //     form.append("userId", current_user.userId);
    //     form.append("senderId", current_user.userId);
    //     form.append("messageContent", messageContent);

    //     if (avatar.current.files[0] !== undefined && avatar !== null) {
    //         form.append("avatar", avatar.current.files[0]);
    //     } else {
    //         form.append("avatar", new Blob());
    //     }
    //     try {
    //         let res = await authApi().post(endpoints['add-message'], form, {
    //             headers: {
    //                 "Content-Type": "multipart/form-data",
    //             },
    //         });

    //         var myMess = {
    //             "profileDoctorId": doctorDetail.profileDoctorId,
    //             "userId": current_user.userId,
    //             "senderId": current_user.userId,
    //             "messageContent": messageContent
    //         }

    //         // listMessage.push(myMess);
    //         // setListMessage(listMessage);
    //         setListMessage([...listMessage, myMess]);
    //         // setListMessage(current => {
    //         //     return {...current, myMess}
    //         // })

    //         console.log("List sau khi gửi");
    //         console.log(listMessage);

    //         if (stompClient) {
    //             console.log("OK STOMP")
    //             stompClient.send("/app/private-message", {}, JSON.stringify(myMess));
    //         }
    //         else
    //             console.log("Chưa có kết nối")
    //         console.log(res.data);
    //         setMessageContent('');
    //         // viewUserMessage();
    //         setLoading(false);
    //     } catch (error) {
    //         setLoading(false);
    //         console.log(error);
    //     }
    // };

    // const handleSortDateChange = (e) => {
    //     const selectedSortDate = e.target.value;
    //     set(selectedRoleId);
    // }

    // const handleSortRating = (e) => {
    //     const selectedRoleId = e.target.value;
    //     setSelectedRole(selectedRoleId);
    // }

    // const addCommentNotification = async (notificationContent) => {
    //     try {
    //         let res = await authApi().post(endpoints['add-notification'], {
    //             "senderId": current_user?.userId,
    //             "receiverId": userDoctorId,
    //             "profileDoctorId": profileDoctorId,
    //             "notificationTypeId": "2",
    //             "notificationContent": "Bạn có một bình luận mới: " + notificationContent
    //         })

    //         var myNoti = {
    //             "senderId": current_user?.userId,
    //             "receiverId": userDoctorId,
    //             "profileDoctorId": profileDoctorId,
    //             "notificationTypeId": "1",
    //             "notificationContent": "Bạn có một bình luận mới: " + notificationContent
    //         }

    //         if (clientStomp) {
    //             console.log("OK STOMP")
    //             clientStomp.send("/app/private-notification", {}, JSON.stringify(myNoti));
    //         }
    //         else
    //             console.log("Chưa có kết nối")
    //         console.log(res.status)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    let url = `/booking/doctor/${doctorDetail.profileDoctorId}`

    return <>
        <div className="Booking_Doctor_Wrapper">
            <div className="Booking_Doctor_Content">
                <div className="Booking_Doctor_Header">
                    {loading === true ? <Spinner /> :
                        <>
                            {doctorDetail?.userId?.avatar && (
                                <div className="Profile_Doctor_Avatar">
                                    <img src={doctorDetail.userId.avatar} alt="Doctor Avatar" />
                                </div>
                            )}
                            {doctorDetail?.specialtyId?.specialtyName &&
                                (<div className="Profile_Doctor_Info">
                                    <h3>{doctorDetail.name}</h3>
                                    <span className="mb-2" style={{ display: 'flex', gap: '0.25rem' }}><img src={verified} alt="verified" /> <span style={{ color: '#1975e3', fontSize: '1.1rem', fontWeight: 'bold' }}>Bác sĩ</span> | <strong>10</strong> năm kinh nghiệm</span>
                                    {doctorDetail.totalRating === null || isNaN(doctorDetail.totalRating / doctorDetail.countRating) ?
                                        <>
                                            <div className="Profile_Doctor_Total_Rating">
                                                <Rating className="mb-4" name="half-rating-read" defaultValue={0} precision={0.1} readOnly />
                                                <span>Bác sĩ này hiện chưa có đánh giá</span>
                                            </div>
                                        </> :
                                        <>
                                            <div className="Profile_Doctor_Total_Rating">
                                                <Rating className="mb-4" name="half-rating-read" defaultValue={(doctorDetail.totalRating / doctorDetail.countRating).toFixed(1)} precision={0.1} readOnly />
                                                <span>{(doctorDetail.totalRating / doctorDetail.countRating).toFixed(1)} trên 5</span>
                                            </div>
                                        </>
                                    }
                                    <span>Chuyên khoa <span style={{ color: '#1975e3', fontSize: '1.1rem', fontWeight: 'bold' }}>{doctorDetail.specialtyId.specialtyName}</span></span>
                                    <span>Chức vụ {doctorDetail.position}</span>
                                    <span>Nơi công tác <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{doctorDetail.workAddress}</span></span>
                                </div>)
                            }
                        </>}
                </div>
                <div className="Booking_Doctor_Body">
                    <div className="Phonenumber">
                        <div>
                            <span>Hỗ trợ đặt khám</span>
                            <span>2051052125</span>
                        </div>
                        {current_user === null ? <Link to={`/login?next=/doctor/${profileDoctorId}`}>Đăng nhập để đặt khám</Link> : <Link to={url}>ĐẶT KHÁM NGAY</Link>}
                        {current_user === null ? <Link to={`/login?next=/doctor/${profileDoctorId}`}>Đăng nhập để nhắn tin cho bác sĩ</Link> : <button onClick={handleClick}><Chat style={{ color: "white" }} /></button>}
                    </div>
                    {showChatRoom && (
                        // <div>
                        //     <div className="User_Message_Detail_Inner">
                        //         <div className="User_Message_Detail_Header">
                        //             <h4 className="text-center mb-3 mt-3">{doctorDetail.name}</h4>
                        //             <button onClick={handleClose}><CloseOutlined /></button>
                        //         </div>
                        //         <div className="User_Message_Content">
                        //             {Object.values(listMessage).map((mes) => {
                        //                 if (!mes) return null;
                        //                 return <>
                        //                     {current_user.userId === mes.senderId ?
                        //                         <MessageBox
                        //                             key={mes.messageId}
                        //                             position={'right'}
                        //                             type={'text'}
                        //                             avatar={null}
                        //                             status={null}
                        //                             text={mes.messageContent}
                        //                             date={mes.createdDate}
                        //                         /> :
                        //                         <MessageBox
                        //                             key={mes.messageId}
                        //                             position={'left'}
                        //                             type={'text'}
                        //                             avatar={null}
                        //                             status={null}
                        //                             text={mes.messageContent}
                        //                             date={mes.createdDate}
                        //                         />
                        //                     }
                        //                 </>
                        //             })}
                        //         </div>
                        //         <div className="User_Send_Message">
                        //             <Form.Control className="mt-2" accept=".jpg, .jpeg, .png, .gif, .bmp" type="file" ref={avatar} />
                        //             <div>
                        //                 <input type="text" value={messageContent} onChange={(e) => setMessageContent(e.target.value)} placeholder="Nhập nội dung tin nhắn..." />
                        //                 <button type="button" onClick={(e) => addMessage(e)}>Gửi</button>
                        //             </div>
                        //         </div>
                        //     </div>
                        // </div>
                        // <MessageChat profileDoctorId={doctorDetail.profileDoctorId} />
                        <MessageChat {...doctorDetail} onClose={handleClose} onButtonClick={handleClick} />
                    )}
                    <div className="googleMapAPI">
                        <GoogleMapAPI address={doctorDetail.workAddress} />
                    </div>
                    <div className="Profile_Doctor_Comment">
                        {current_user === null ? <p>Vui lòng <Link to={`/login?next=/doctor/${profileDoctorId}`}>đăng nhập</Link> để bình luận! </p> : <>
                            <Form onSubmit={(e) => addComment(e)}>
                                <Form.Label style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Để lại ý kiến của bạn</Form.Label>
                                <Form.Control as="textarea" aria-label="With textarea" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Nhập nội dung bình luận" required />
                                <div className="Profile_Doctor_Rating">
                                    <Typography component="legend">Đánh giá của bạn</Typography>
                                    <Rating value={rating} onChange={(event, newValue) => { setRating(newValue) }} />
                                </div>
                                <Form.Control className="mt-2" accept=".jpg, .jpeg, .png, .gif, .bmp" type="file" ref={avatar} />
                                <Button className="mt-2" variant="info" type="submit">Bình luận</Button>
                            </Form>
                        </>}
                        <hr />
                        <div className="Comment_Sort_Group">
                            <div className="Comment_Sort_Select">
                                <div className="Comment_Sort_Date">
                                    <Form.Label style={{ width: '100%' }}>Sắp xếp theo ngày</Form.Label>
                                    <Form.Select style={{ width: '100%' }} value={dateSort} name="sortDate" onChange={(e) => setDateSort(e.target.value)}>
                                        <option value={null}>No Sort</option>
                                        <option value="asc">Cũ nhất</option>
                                        <option value="des">Mới nhất</option>
                                    </Form.Select>
                                </div>
                                <div className="Comment_Sort_Rating">
                                    <Form.Label style={{ width: '100%' }}>Sắp xếp theo đánh giá</Form.Label>
                                    <Form.Select style={{ width: '100%' }} value={ratingSort} name="sortRating" onChange={(e) => setRatingSort(e.target.value)}>
                                        <option value={null}>No Sort</option>
                                        <option value="asc">Tệ nhất</option>
                                        <option value="des">Tốt nhất</option>
                                    </Form.Select>
                                </div>
                            </div>
                            <button className="Comment_Sort_Butt" onClick={loadCommentPage}>Sắp xếp</button>
                        </div>
                        <div className="Comment_Area">
                            <div className="Comment_List">
                                <ListGroup>
                                    {Object.values(comment).map((c, index) => <ListGroup.Item key={c.commentId}>
                                        <div className="User_Comment_Info">
                                            <div className="User_Comment_Avatar">
                                                <Image src={c.userId.avatar} style={{ width: "50%" }} fluid roundedCircle />
                                            </div>
                                            <div className="User_Comment_Content">
                                                <Form onSubmit={(e) => updateComment(e, c)}>
                                                    <div className="User_Comment">
                                                        {editingIndex === index ? (
                                                            <>
                                                                <span>Đánh giá</span>
                                                                <Rating value={c.rating} onChange={(event, newValue) => { setUpdateRating(newValue) }} />
                                                            </>
                                                        ) :
                                                            (<>
                                                                <span>{c.userId.lastname} {c.userId.firstname} đã đánh giá</span>
                                                                <Rating name="read-only" value={c.rating} readOnly />
                                                            </>)}

                                                    </div>
                                                    <div className="Avatar_Comment">
                                                        {editingIndex === index ? (
                                                            <>
                                                                <Form.Control className="mt-2" accept=".jpg, .jpeg, .png, .gif, .bmp" type="file" ref={avatar} />
                                                            </>
                                                        ) : (<>
                                                            <Image src={c.avatar} style={{ width: "20%" }} />
                                                        </>)}
                                                    </div>
                                                    <div className="Comment_Content">
                                                        {editingIndex === index ? (
                                                            <>
                                                                <Form.Control as="textarea" aria-label="With textarea" defaultValue={c.content} onChange={(e) => setUpdateContent(e.target.value)} placeholder="Sửa nội dung bình luận" required />
                                                            </>
                                                        ) : (<>
                                                            {c.updatedDate === null ? (<>{c.content} - <Moment locale="vi" fromNow>{c.createdDate}</Moment></>) : (<>{c.content} - <Moment locale="vi" fromNow>{c.createdDate}</Moment> - đã chỉnh sửa</>)}
                                                        </>)}
                                                    </div>
                                                    {editingIndex === index ? (
                                                        <>
                                                            <Button className="Update_Comment_Butt" style={{ marginRight: '0.5rem' }} variant="success" type="submit">
                                                                Cập nhật
                                                            </Button>
                                                            <button className="Cancel_Comment_Butt" type="button" style={{ marginRight: '0.5rem' }} onClick={handleCancel}>
                                                                Hủy
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {current_user === null ? "" : current_user.userId !== c?.userId?.userId ? "" : <button className="Edit_Comment_Butt" type="button" onClick={() => handleEdit(index, c.commentId)}>Sửa bình luận</button>}
                                                        </>
                                                    )}
                                                </Form>
                                                {/* {current_user.userId !== c.userId.userId ? "" : <Button variant="info" onClick={() => handleEdit(index, c.commentId)}>Sửa bình luận</Button>} */}
                                            </div>
                                        </div>
                                    </ListGroup.Item>)}
                                </ListGroup>
                            </div>
                        </div>
                        {/* <div className="Page_Nav">
                            {commentPages.map((page) => (
                                <button id={`${page}`} key={page} onClick={() => handleCommentPageChange(page)}
                                    className={page === selectedPage ? 'active' : ''}>
                                    {page}
                                </button>
                            ))}
                        </div> */}
                        <Pagination pages={commentPages}
                            selectedPage={selectedPage}
                            handlePageChange={handleCommentPageChange} />
                    </div>
                </div>
            </div>
            <div className="Booking_Doctor_Footer">
                <div>
                    <span>Đặt lịch khám Bác sĩ dễ dàng</span>
                    <h3>Tải ngay I'MPROOK CARE</h3>
                    <div>
                        <Link to="/" style={{ marginRight: '1rem' }}><img src={googleplay} alt="GooglePlay" /></Link>
                        <Link to="/"><img src={appstore} alt="AppStore" /></Link>
                    </div>
                </div>
            </div>
        </div >
    </>
}

export default BookingDoctor;