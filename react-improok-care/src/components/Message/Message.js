import { useContext, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../App";
import "./Message.css";
import { Form } from "react-bootstrap";
import { SERVER, authApi, endpoints } from "../../configs/Apis";
import printer from "../../assets/images/printer.png"
import profile404 from "../../assets/images/profile.png"
import message from "../../assets/images/message.png"
import { MessageBox } from "react-chat-elements";
import 'react-chat-elements/dist/main.css';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import Spinner from "../../layout/Spinner"
import { MdRemoveCircle } from "react-icons/md";
import { toast } from "react-toastify";
var stompClient = null;
var clientStomp = null;

const Message = () => {
    const [current_user,] = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [profileDoctor, setProfileDoctor] = useState([]);
    const [doctorName, setDoctorName] = useState('');
    const [doctorId, setDoctorId] = useState(null);
    const [selectedProfile, setSelectedProfile] = useState();
    const [doctorSendMessageToUser, setDoctorSendMessageToUser] = useState([]);
    const [listMessage, setListMessage] = useState([]);
    const [chatImg, setChatImg] = useState('');
    const messagesEndRef = useRef(null);

    const [userDoctorId, setUserDoctorId] = useState(null)

    const [messageContent, setMessageContent] = useState(null);
    const [lastMessageId, setLastMessageId] = useState(null);

    const avatar = useRef();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    };

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

    const connectNotification = () => {
        let Sock = new SockJS(`${SERVER}${endpoints['web-notification']}`);
        clientStomp = over(Sock);
        clientStomp.connect({}, onConnectedNotification, onErrorNotification);
    }

    const onConnectedNotification = () => {
        clientStomp.subscribe('/user/' + current_user?.userId + '/notification', onPrivateNotification);
        // stompClient.subscribe('/user/private', onPrivateMessage);
    }

    const onErrorNotification = (err) => {
        console.log(err);
    }

    const onPrivateNotification = (payload) => {
        console.log("ĐÂY LÀ PAYLOAD");
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        console.log("PAYLOAD LÀM SẠCH");
        console.log(payloadData);
        // toast.info(payloadData.notificationContent)
    }

    useEffect(() => {
        const loadNewMessage = async () => {
            try {
                let res = await authApi().get(endpoints['get-doctor-send-message-to-user'](current_user?.userId))
                setDoctorSendMessageToUser(res.data.content);
                setLastMessageId(res.data.content[0][1]);
                console.log(res.data.content);
            } catch (error) {
                console.log(error);
            }
        }
        if (listMessage.length > 0) {
            loadNewMessage()
        }
    }, [listMessage])

    const getDoctorSendMessageToUser = async () => {
        connect();
        // connectNotification();
        try {
            let res = await authApi().get(endpoints['get-doctor-send-message-to-user'](current_user?.userId))
            setDoctorSendMessageToUser(res.data.content);
            console.log(res.data.content);
            console.log(res.data.content[0][0].profileDoctorId);
            console.log(res.data.content[0][0].userId.userId);
            setDoctorId(res.data.content[0][0].profileDoctorId);
            setUserDoctorId(res.data.content[0][0].userId.userId);
            console.log(res.data.content[0][1].messageId);
            setLastMessageId(res.data.content[0][1].messageId);
            setDoctorName(res.data.content[0][0].name)
            let mes = await authApi().get(endpoints['get-message-for-all-view'](res.data.content[0][0].profileDoctorId, current_user?.userId));
            setListMessage(mes.data);
        } catch (error) {
            console.log(error);
        }
    }

    const viewUserMessage = (profileDoctorId, messageId) => {
        console.log(messageId);
        setLastMessageId(messageId);
        const process = async () => {
            try {
                setLoading(true);
                const res = await authApi().get(endpoints['get-message-for-all-view'](profileDoctorId, current_user?.userId));
                setListMessage(res.data);
                console.log(res.data[0].profileDoctorId.userId)
                setUserDoctorId(res.data[0].profileDoctorId.userId)
                console.log(res.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
        process();
    }

    useEffect(() => {
        getDoctorSendMessageToUser()
        if (current_user && current_user.userId) {
            console.log(current_user.userId);
            connectNotification(current_user.userId);
        }
    }, [])

    const addMessage = async (evt) => {
        evt.preventDefault();
        setLoading(true);
        // connectNotification();

        console.log(doctorId, current_user?.userId, messageContent);

        let form = new FormData();
        form.append("profileDoctorId", doctorId);
        form.append("userId", current_user?.userId);
        form.append("senderId", current_user?.userId);
        form.append("messageContent", messageContent);

        if (avatar.current.files[0] !== undefined && avatar !== null) {
            // form.append("avatar", avatar.current.files[0]);
            form.append("avatar", chatImg);
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
            addNotification(doctorId, messageContent);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const handleFocus = async () => {
        try {
            console.log(lastMessageId)
            let res = await authApi().post(endpoints['seen-message'](lastMessageId))
            console.log(res.data)
            let mes = await authApi().get(endpoints['get-doctor-send-message-to-user'](current_user?.userId))
            setDoctorSendMessageToUser(mes.data.content);
        } catch (error) {
            console.log(error)
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

    const addNotification = async (profileDoctorId, notificationContent) => {
        try {
            // connectNotification();
            let res = await authApi().post(endpoints['add-notification'], {
                "senderId": current_user?.userId,
                "receiverId": userDoctorId,
                "profileDoctorId": profileDoctorId,
                "notificationTypeId": "1",
                "notificationContent": "Bạn có một tin nhắn mới: " + notificationContent
            })

            var myNoti = {
                "senderId": current_user?.userId,
                "receiverId": userDoctorId,
                "profileDoctorId": profileDoctorId,
                "notificationTypeId": "1",
                "notificationContent": "Bạn có một tin nhắn mới: " + notificationContent
            }

            if (clientStomp) {
                console.log("OK STOMP")
                clientStomp.send("/app/private-notification", {}, JSON.stringify(myNoti));
            }
            else
                console.log("Chưa có kết nối")
            console.log(res.status)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        scrollToBottom();
    }, [listMessage]);

    if (current_user === null)
        <Navigate to="/" />

    return <>
        <div className="Message_Wrapper">
            <div className="Message">
                {/* <div className="Message_Left">
                    <div className="Message_Left_Content">
                        <UserMenu />
                    </div>
                </div> */}
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
                                            <ul style={{ paddingLeft: "1rem", paddingRight: "0.75rem" }}>

                                                {Object.values(doctorSendMessageToUser).map(pd => {
                                                    const isSeen = pd[5] === false;
                                                    return <>
                                                        <div className={`Profile_List_Detail ${isSeen && pd[2] !== current_user?.userId ? 'seen' : ''}`} value={selectedProfile} onClick={() => { viewUserMessage(pd[0].profileDoctorId, pd[1]); setDoctorName(pd[0].name); setDoctorId(pd[0].profileDoctorId) }}>
                                                            <img src={pd[0].userId.avatar} alt="profileicon" width={'20%'} />
                                                            <div className="Profile_List_Detail_Mes_Info">
                                                                <li key={pd[0].profileDoctorId} value={pd[0].profileDoctorId}>{pd[0].name}</li>
                                                                <p>{pd[3]}</p>
                                                            </div>
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
                                                                    <div ref={messagesEndRef}></div>
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
                                                                        <Form.Control className="mt-2" style={{ width: '15%', padding: '3px', margin: "8px" }} accept=".jpg, .jpeg, .png, .gif, .bmp" type="file" key={chatImg} ref={avatar} onChange={handleChatImgChange} />
                                                                        <div>
                                                                            <input type="text" value={messageContent} onFocus={handleFocus} onChange={(e) => setMessageContent(e.target.value)} placeholder="Nhập nội dung tin nhắn..." />
                                                                            {chatImg === "" && messageContent === "" ? <button type="button">Gửi</button> : loading === true ? <Spinner /> : <button type="button" onClick={(e) => addMessage(e)}>Gửi</button>}
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