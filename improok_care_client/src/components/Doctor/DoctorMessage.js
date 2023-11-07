import { useContext, useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { MyUserContext } from "../../App";
import "../../styles/DoctorMessage.css";
import { Form, Image } from "react-bootstrap";
import Apis, { authApi, endpoints } from "../../configs/Apis";
import doctorprofile from "../../assests/images/doctor-profile-icon.png"
import printer from "../../assests/images/printer.png"
import profileicon from "../../assests/images/profile-icon.png"
import profile404 from "../../assests/images/profile.png"
import message from "../../assests/images/message.png"
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MessageBox, ChatItem } from "react-chat-elements";
import 'react-chat-elements/dist/main.css';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
var stompClient = null;

const DoctorMessage = () => {
    const [current_user, dispatch] = useContext(MyUserContext);
    const nav = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profileDoctor, setProfileDoctor] = useState([]);

    const [addProfileInfo, setAddProfileInfo] = useState(false);
    const [profile, setProfile] = useState(null);
    const [checkProfileInfo, setCheckProfileInfo] = useState(true);
    const [selectedProfile, setSelectedProfile] = useState();
    const [userSendMessageToDoctor, setUserSendMessageToDoctor] = useState([]);
    const [listMessage, setListMessage] = useState([]);

    const [messageContent, setMessageContent] = useState(null);

    const avatar = useRef();

    const [tempMessage, setTempMessage] = useState({
        "profileDoctorId": null,
        "userId": null,
        "senderId": null,
        "messageContent": null
    })

    const connect = () => {
        let Sock = new SockJS('http://localhost:2024/IMPROOK_CARE/api/public/webSocket/');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        stompClient.subscribe('/user/' + selectedProfile + '/private', onPrivateMessage);
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
        // let fakeListMessage = {
        //     "profileDoctorId":payloadData.profileDoctorId,
        //     "userId":payloadData.userId,
        //     "senderId":payloadData.senderId,
        //     "messageContent": payloadData.messageContent
        // }

        setListMessage(prevList => [...prevList, payloadData], () => {
            console.log("List sau làm sạch");
            console.log(listMessage);
        });
        // setListMessage(current => {
        //     return {...current, fakeListMessage}
        // })
    }

    const logout = () => {
        dispatch({
            "type": "logout"
        })
        nav("/")
    }

    const loadProfileDoctor = async () => {
        try {
            let res = await Apis.get(endpoints['load-profile-doctor-by-userId'](current_user.userId))
            setProfileDoctor(res.data);
            console.log(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadProfileDoctor();
    }, [current_user.userId])

    const getUserSendMessageToDoctor = async (pd) => {
        // setSelectedProfile(pd.profileDoctorId);
        setSelectedProfile(pd.profileDoctorId, () => {
            console.log(selectedProfile);
        });
        // setListMessage(prevList => [...prevList, payloadData], () => {
        //     console.log("List sau làm sạch");
        //     console.log(listMessage);
        // });
        connect();
        try {
            let res = await authApi().get(endpoints['get-user-send-message-to-doctor'](pd.profileDoctorId))
            setUserSendMessageToDoctor(res.data.content);
            console.log(res.data.content);
        } catch (error) {
            console.log(error);
        }
    }

    // const viewDoctorMessage = async (userId) => {
    //     const process = async () => {
    //         try {
    //             setLoading(true);
    //             const results = [];
    //             for (let i = 0; i < userSendMessageToDoctor.length; i++) {
    //                 const userId = userSendMessageToDoctor[i];
    //                 const res = await authApi().get(endpoints['get-message-for-doctor-view'](selectedProfile, userId));
    //                 results.push(res.data.content);
    //                 console.log("Đây là tin nhắn")
    //                 console.log(res.data.content);
    //             }
    //             setListMessage(results);
    //             setLoading(false);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    //     process();
    // }

    const viewDoctorMessage = (userId) => {

        const process = async () => {
            try {
                setLoading(true);
                const res = await authApi().get(endpoints['get-message-for-all-view'](selectedProfile, userId));
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

    const addMessage = async (evt, userId) => {
        evt.preventDefault();
        setLoading(true);

        console.log(selectedProfile, userId, messageContent);

        let form = new FormData();
        form.append("profileDoctorId", selectedProfile);
        form.append("userId", userId);
        form.append("senderId", selectedProfile);
        form.append("messageContent", messageContent);

        if (avatar.current.files[0] !== undefined && avatar !== null) {
            form.append("avatar", avatar.current.files[0]);
        } else {
            form.append("avatar", new Blob());
        }
        try {
            let res = await authApi().post(endpoints['add-message'], form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(res.data);

            var myMess = {
                "profileDoctorId": selectedProfile,
                "userId": userId,
                "senderId": selectedProfile,
                "messageContent": messageContent
            }

            // listMessage.push(myMess);
            console.log("TRỜI ƠI")
            console.log(listMessage)
            setListMessage([...listMessage, myMess]);
            // setListMessage(current => {
            //     return {...current, myMess}
            // })

            console.log("List sau khi gửi");
            console.log(listMessage);

            // setTempMessage({
            //     "profileDoctorId": selectedProfile,
            //     "userId": userId,
            //     "senderId": selectedProfile,
            //     "messageContent": messageContent
            // });

            if (stompClient) {
                console.log("OK STOMP")
                stompClient.send("/app/private-message", {}, JSON.stringify(myMess));
            }
            else
                console.log("Chưa có kết nối")

            setMessageContent('');
            // viewDoctorMessage(userId);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    if (current_user === null)
        <Navigate to="/" />

    return <>
        <div class="Doctor_Message_Wrapper">
            <div class="Doctor_Message">
                <div class="Doctor_Message_Left">
                    <div class="Doctor_Message_Left_Content">
                        <ul>
                            <li><Link to="/doctor">Thông tin cá nhân</Link></li>
                            {/* <li><Link to="/changepassword">Đổi mật khẩu</Link></li> */}
                            <li><Link to="/schedule">Đăng ký lịch khám</Link></li>
                            <li><Link to="/bookingmanagement">Lịch hẹn</Link></li>
                            <li><Link to="/profiledoctor">Hồ sơ</Link></li>
                            <li><Link to="/doctormessage">Tin nhắn</Link></li>
                            <li onClick={logout}>Đăng xuất</li>
                        </ul>
                    </div>
                </div>
                <div class="Doctor_Message_Middle">
                    <div class="Doctor_Message_Middle_Header">
                        <h3>Hồ sơ</h3>
                    </div>
                    <div class="Doctor_Message_Middle_Content">
                        <div class="Doctor_Message_Middle_Container">
                            <div class="Doctor_Message_Middle_Info">
                                <input type="text" placeholder="Nhập tên hồ sơ cần tìm..."></input>
                                <div class="Profile_List">
                                    {profileDoctor.length === 0 ? <>
                                        <div class="Profile_List_404">
                                            <img src={printer} alt="404" width={'20%'} />
                                            <span>Không tìm thấy kết quả</span>
                                        </div>
                                    </> : <>
                                        <div class="Profile_List_Info">
                                            <ul>
                                                {Object.values(profileDoctor).map(pd => {
                                                    return <>
                                                        <div class="Profile_List_Detail" value={selectedProfile} onClick={() => getUserSendMessageToDoctor(pd)}>
                                                            <img src={profileicon} alt="profileicon" width={'20%'} />
                                                            <li key={pd.profileDoctorId} value={pd.profileDoctorId}>{pd.name}</li>
                                                        </div>
                                                    </>
                                                })}
                                            </ul>
                                        </div>
                                    </>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="Doctor_Message_Right">
                    <>
                        <section>
                            <div class="Doctor_Message_Right_Header"><h3 className="text-center text-success mb-4">Tin nhắn</h3></div>
                            <div class="Doctor_Message_Right_Content">
                                {profileDoctor === null ? <>
                                    <div class="Doctor_Message_Null">
                                        <h5 className="mb-4">Chọn hồ sơ cần xem</h5>
                                        <img src={profile404} alt="Not found" width={'20%'} />
                                    </div>
                                </> :
                                    <>
                                        <div>
                                            {userSendMessageToDoctor.length === 0 ? <>
                                                <div class="Doctor_Message_Null">
                                                    <span className="mb-4">Chưa có tin nhắn nào</span>
                                                    <img src={message} alt="Not found" width={'20%'} />
                                                </div>
                                            </> :
                                                <>
                                                    {userSendMessageToDoctor.map(usmtd => {
                                                        return <>
                                                            <Accordion>
                                                                <AccordionSummary
                                                                    expandIcon={<ExpandMoreIcon />}
                                                                    aria-controls="panel1a-content"
                                                                    id="panel1a-header"
                                                                    class="Prescription_Item"
                                                                    onClick={() => viewDoctorMessage(usmtd.userId)}
                                                                >
                                                                    <Typography>Bệnh nhân: {usmtd.firstname} {usmtd.lastname}</Typography>
                                                                </AccordionSummary>
                                                                <AccordionDetails class="Doctor_Message_Detail">
                                                                    <div class="Doctor_Message_Detail_Inner">
                                                                        <h4 className="text-center mb-3 mt-3">{usmtd.firstname} {usmtd.lastname}</h4>
                                                                        <div class="Message_Content">
                                                                            {Object.values(listMessage).map((mes) => {
                                                                                return <>
                                                                                    {selectedProfile === mes.senderId ?
                                                                                        <MessageBox
                                                                                            key={mes.messageId}
                                                                                            position={'right'}
                                                                                            type={'text'}
                                                                                            avatar={null}
                                                                                            status={null}
                                                                                            text={mes.messageContent}
                                                                                            date={mes.createdDate}
                                                                                        /> :
                                                                                        <MessageBox
                                                                                            key={mes.messageId}
                                                                                            position={'left'}
                                                                                            type={'text'}
                                                                                            avatar={null}
                                                                                            status={null}
                                                                                            text={mes.messageContent}
                                                                                            date={mes.createdDate}
                                                                                        />
                                                                                    }
                                                                                </>
                                                                            })}
                                                                        </div>
                                                                        <div class="Send_Message">
                                                                            <Form.Control className="mt-2" style={{ width: '100%' }} accept=".jpg, .jpeg, .png, .gif, .bmp" type="file" ref={avatar} />
                                                                            <div>
                                                                                <input type="text" value={messageContent} onChange={(e) => setMessageContent(e.target.value)} placeholder="Nhập nội dung tin nhắn..." />
                                                                                {messageContent === null ? <button type="button">Gửi</button> : <button type="button" onClick={(e) => addMessage(e, usmtd.userId)}>Gửi</button>}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </AccordionDetails>
                                                            </Accordion>
                                                        </>
                                                    })}
                                                    {/* <div className="Page_Nav">
                                                        {prescriptionPages.map((page) => (
                                                            <button id={`${page}`} key={page} onClick={() => handlePrescriptionPageChange(page)}
                                                                className={page === selectedPage ? 'active' : ''}>
                                                                {page}
                                                            </button>
                                                        ))}
                                                    </div> */}
                                                </>
                                            }
                                        </div>
                                    </>}
                            </div>
                        </section>
                    </>
                </div>
            </div>
        </div >
    </>
}

export default DoctorMessage;