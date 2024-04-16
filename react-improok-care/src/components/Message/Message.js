import { useContext, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../App";
import "./Message.css";
import { Form } from "react-bootstrap";
import { authApi, endpoints } from "../../configs/Apis";
// import doctorprofile from "../../assets/images/doctor-profile-icon.png"
import printer from "../../assets/images/printer.png"
import profile404 from "../../assets/images/profile.png"
import message from "../../assets/images/message.png"
import { MessageBox } from "react-chat-elements";
import 'react-chat-elements/dist/main.css';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import UserMenu from "../../layout/UserMenu/UserMenu";
import Spinner from "../../layout/Spinner"
import { MdRemoveCircle } from "react-icons/md";
var stompClient = null;

const Message = () => {
    const [current_user,] = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [profileDoctor, setProfileDoctor] = useState([]);
    const [doctorName, setDoctorName] = useState('');
    const [doctorId, setDoctorId] = useState();
    const [selectedProfile, setSelectedProfile] = useState();
    const [doctorSendMessageToUser, setDoctorSendMessageToUser] = useState([]);
    const [listMessage, setListMessage] = useState([]);
    const [chatImg, setChatImg] = useState('');

    const [messageContent, setMessageContent] = useState(null);

    const avatar = useRef();

    const connect = () => {
        let Sock = new SockJS('http://localhost:2024/IMPROOK_CARE/api/public/webSocket/');
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

    const getDoctorSendMessageToUser = async () => {
        connect();
        try {
            let res = await authApi().get(endpoints['get-doctor-send-message-to-user'](current_user?.userId))
            setDoctorSendMessageToUser(res.data.content);
            console.log(res.data.content);
        } catch (error) {
            console.log(error);
        }
    }

    const viewUserMessage = (profileDoctorId) => {
        const process = async () => {
            try {
                setLoading(true);
                const res = await authApi().get(endpoints['get-message-for-all-view'](profileDoctorId, current_user?.userId));
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

    useEffect(() => {
        getDoctorSendMessageToUser()
    }, [])

    const addMessage = async (evt) => {
        evt.preventDefault();
        setLoading(true);

        console.log(doctorId, current_user?.userId, messageContent);

        let form = new FormData();
        form.append("profileDoctorId", doctorId);
        form.append("userId", current_user?.userId);
        form.append("senderId", current_user?.userId);
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

            // const imgMes = chatImg

            var myMess = {
                "profileDoctorId": doctorId,
                "userId": current_user?.userId,
                "senderId": current_user?.userId,
                "messageContent": messageContent,
                "avatar": res.data.avatar,
                "isSeen": false
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
            setChatImg('');
            // viewDoctorMessage(userId);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const handleChatImgChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setChatImg(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    if (current_user === null)
        <Navigate to="/" />

    return <>
        <div className="Message_Wrapper">
            <div className="Message">
                <div className="Message_Left">
                    <div className="Message_Left_Content">
                        <UserMenu />
                    </div>
                </div>
                <div className="Message_Middle">
                    <div className="Message_Middle_Header">
                        <h3>Tin nhắn</h3>
                    </div>
                    <div className="Message_Middle_Content">
                        <div className="Message_Middle_Container">
                            <div className="Message_Middle_Info">
                                <input type="text" placeholder="Tìm kiếm tin nhắn..."></input>
                                <div className="Profile_List">
                                    {doctorSendMessageToUser.length === 0 ? <>
                                        <div className="Profile_List_404">
                                            <img src={printer} alt="404" width={'20%'} />
                                            <span>Chưa có tin nhắn nào</span>
                                        </div>
                                    </> : <>
                                        <div className="Profile_List_Info">
                                            <ul>
                                                {Object.values(doctorSendMessageToUser).map(pd => {
                                                    return <>
                                                        <div className="Profile_List_Detail" value={selectedProfile} onClick={() => { viewUserMessage(pd[0].profileDoctorId); setDoctorName(pd[0].name); setDoctorId(pd[0].profileDoctorId) }}>
                                                            <img src={pd[0].userId.avatar} alt="profileicon" width={'20%'} />
                                                            <li key={pd[0].profileDoctorId} value={pd[0].profileDoctorId}>{pd[0].name}</li>
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
                <div className="Message_Right">
                    <>
                        <section>
                            {/* <div className="Message_Right_Header"><h3 className="text-center mb-4">Tin nhắn</h3></div> */}
                            <div className="Message_Right_Content">
                                {profileDoctor === null ? <>
                                    <div className="Message_Null">
                                        <h5 className="mb-4">Chọn hồ sơ cần xem</h5>
                                        <img src={profile404} alt="Not found" width={'20%'} />
                                    </div>
                                </> :
                                    <>
                                        <div>
                                            {doctorSendMessageToUser.length === 0 ? <>
                                                <div className="Message_Null">
                                                    <h5 className="mb-4">Bạn hiện chưa nhắn tin với bác sĩ nào</h5>
                                                    <img src={message} alt="Not found" width={'20%'} />
                                                </div>
                                            </> :
                                                <>
                                                    {listMessage.length === 0 ? <>
                                                        <div className="Message_Null">
                                                            <h5 className="mb-4">Vui lòng chọn bác sĩ để xem tin nhắn</h5>
                                                            <img src={message} alt="Not found" width={'20%'} />
                                                        </div>
                                                    </> :
                                                        <>
                                                            <div>
                                                                <h4 className="text-center mb-3 mt-3">{doctorName}</h4>
                                                                <div className="Message_Content">
                                                                    {Object.values(listMessage).map((mes) => {
                                                                        return <>
                                                                            {current_user?.userId === mes.senderId ?
                                                                                <MessageBox
                                                                                    key={mes.messageId}
                                                                                    position={'right'}
                                                                                    type={'text'}
                                                                                    avatar={mes.avatar}
                                                                                    status={null}
                                                                                    text={mes.messageContent}
                                                                                    date={mes.createdDate}
                                                                                /> :
                                                                                <MessageBox
                                                                                    key={mes.messageId}
                                                                                    position={'left'}
                                                                                    type={'text'}
                                                                                    avatar={mes.avatar}
                                                                                    status={null}
                                                                                    text={mes.messageContent}
                                                                                    date={mes.createdDate} />
                                                                            }
                                                                        </>
                                                                    })}
                                                                </div>
                                                                <div className="Send_Message">
                                                                    {chatImg ? (
                                                                        <div style={{ position: 'relative', display: 'inline-block' }}>
                                                                            <img src={chatImg} alt="Selected" width="20%" />
                                                                            <div style={{ position: 'absolute', top: -10, right: 15, cursor: 'pointer' }} onClick={() => setChatImg('')}>
                                                                                <MdRemoveCircle size={25} color="grey" />
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <></>
                                                                    )}
                                                                    <div className="send_chat">
                                                                        <Form.Control className="mt-2" style={{ width: '15%', padding: '3px', margin: "8px" }} accept=".jpg, .jpeg, .png, .gif, .bmp" type="file" ref={avatar} onChange={handleChatImgChange} />
                                                                        <div>
                                                                            <input type="text" value={messageContent} onChange={(e) => setMessageContent(e.target.value)} placeholder="Nhập nội dung tin nhắn..." />
                                                                            {messageContent === null && chatImg === '' ? <button type="button">Gửi</button> : loading === true ? <Spinner /> : <button type="button" onClick={(e) => addMessage(e)}>Gửi</button>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>}
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

export default Message;