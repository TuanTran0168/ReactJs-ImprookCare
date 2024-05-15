import { useContext, useEffect, useRef, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../App";
import "./DoctorMessage.css";
import { Form } from "react-bootstrap";
import Apis, { SERVER, authApi, endpoints } from "../../configs/Apis";
import printer from "../../assets/images/printer.png"
import profile404 from "../../assets/images/profile.png"
import message from "../../assets/images/message.png"
import { MessageBox } from "react-chat-elements";
import 'react-chat-elements/dist/main.css';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import Spinner from "../../layout/Spinner"
import * as React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import AddIcon from '@mui/icons-material/Add';
import { blue } from '@mui/material/colors';
import { MdRemoveCircle } from "react-icons/md";
import { toast } from "react-toastify";

var stompClient = null;
var clientStomp = null;

function SimpleDialog(props) {
    const { onClose, selectedValue, open, onButtonClick } = props;
    const [current_user,] = useContext(UserContext);
    const [profileDoctor, setProfileDoctor] = useState([]);
    // const [loading, setLoading] = useState(false);

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    const loadProfileDoctor = async () => {
        try {
            let res = await Apis.get(endpoints['load-profile-doctor-by-userId'](current_user?.userId))
            setProfileDoctor(res.data);
            console.log(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadProfileDoctor();
    }, [current_user?.userId])

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Vui lòng chọn hồ sơ</DialogTitle>
            <List sx={{ pt: 0 }}>
                {profileDoctor.map((pd) => (
                    <ListItem disableGutters key={pd.profileDoctorId}>
                        <ListItemButton
                            onClick={() => { onButtonClick(pd); handleListItemClick(pd.profileDoctorId) }}>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                    <img src={pd.userId.avatar} alt="PD" />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={pd.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem disableGutters>
                    <ListItemButton
                        autoFocus
                        onClick={() => handleListItemClick('addAccount')}>
                        <ListItemAvatar>
                            <Avatar>
                                <AddIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Add account" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
};

const DoctorMessage = () => {
    const [current_user,] = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [profileDoctor, setProfileDoctor] = useState([]);

    const [addProfileInfo, setAddProfileInfo] = useState(false);
    const [profile, setProfile] = useState(null);
    const [checkProfileInfo, setCheckProfileInfo] = useState(true);
    const [selectedProfile, setSelectedProfile] = useState();
    const [userSendMessageToDoctor, setUserSendMessageToDoctor] = useState([]);
    const [listMessage, setListMessage] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientName, setPatientName] = useState('');

    const [messageContent, setMessageContent] = useState(null);
    const [lastMessageId, setLastMessageId] = useState(null);

    const [selectImg, setSelectImg] = useState('')

    const avatar = useRef();
    const messagesEndRef = useRef(null);

    const onError = (err) => {
        console.log(err);
    }

    const connectNotification = () => {
        let Sock = new SockJS(`${SERVER}${endpoints['web-notification']}`)
        clientStomp = over(Sock)
        clientStomp.connect({}, onConnectedNotification, onErrorNotification)
    }

    const onConnectedNotification = () => {
        clientStomp.subscribe('/user/' + current_user?.userId + '/notification', onPrivateNotification);
    }

    const onErrorNotification = (err) => {
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

    const onPrivateNotification = (payload) => {
        console.log("ĐÂY LÀ PAYLOAD");
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        console.log("PAYLOAD LÀM SẠCH");
        console.log(payloadData);
    }

    const loadProfileDoctor = async () => {
        try {
            let res = await Apis.get(endpoints['load-profile-doctor-by-userId'](current_user?.userId))
            setProfileDoctor(res.data);
            console.log(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadProfileDoctor();
    }, [current_user?.userId])

    useEffect(() => {
        const loadNewMessage = async () => {
            try {
                let res = await authApi().get(endpoints['get-user-send-message-to-doctor'](selectedProfile))
                setUserSendMessageToDoctor(res.data.content);
                console.log(res.data.content[0][1]);
                setLastMessageId(res.data.content[0][1]);
                console.log(res.data.content);
            } catch (error) {
                console.log(error);
            }
        }
        if (selectedProfile && listMessage.length > 0) {
            loadNewMessage()
        }
    }, [listMessage])

    const getUserSendMessageToDoctor = async (pd) => {
        setSelectedProfile(pd.profileDoctorId, () => {
            console.log(selectedProfile);
        });
        setProfile(pd.name, () => {
            console.log(profile)
        })
        const connect = () => {
            let Sock = new SockJS(`${SERVER}${endpoints['web-socket']}`);
            stompClient = over(Sock);
            stompClient.connect({}, onConnected, onError);
        }
        const onConnected = () => {
            stompClient.subscribe('/user/' + pd.profileDoctorId + '/private', onPrivateMessage);
            // stompClient.subscribe('/user/private', onPrivateMessage);
        }
        // setListMessage(prevList => [...prevList, payloadData], () => {
        //     console.log("List sau làm sạch");
        //     console.log(listMessage);
        // });
        connect();
        connectNotification();
        try {
            let res = await authApi().get(endpoints['get-user-send-message-to-doctor'](pd.profileDoctorId))
            setUserSendMessageToDoctor(res.data.content);
            console.log(res.data.content);
            console.log(res.data.content[0][0].userId);
            setLastMessageId(res.data.content[0][1]);
            setSelectedPatient(res.data.content[0][0].userId);
            setPatientName(`${res.data.content[0][0].firstname} ${res.data.content[0][0].lastname}`);
            let mes = await authApi().get(endpoints['get-message-for-all-view'](pd.profileDoctorId, res.data.content[0][0].userId));
            setListMessage(mes.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleFocus = async () => {
        try {
            console.log(lastMessageId);
            let res = await authApi().post(endpoints['seen-message'](lastMessageId))
            console.log(res.data)
            let mes = await authApi().get(endpoints['get-user-send-message-to-doctor'](selectedProfile))
            setUserSendMessageToDoctor(mes.data.content);
        } catch (error) {
            console.log(error)
        }
    };

    const viewDoctorMessage = (userId, messageId) => {
        setLastMessageId(messageId);
        console.log(messageId);
        setSelectedPatient(userId);
        const process = async () => {
            try {
                setLoading(true);
                let res = await authApi().get(endpoints['get-message-for-all-view'](selectedProfile, userId));
                setListMessage(res.data);
                console.log(res.data);
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

            // const imgMes = selectImg

            var myMess = {
                "profileDoctorId": selectedProfile,
                "userId": userId,
                "senderId": selectedProfile,
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

            if (stompClient) {
                console.log("OK STOMP")
                stompClient.send("/app/private-message", {}, JSON.stringify(myMess));
            }
            else
                console.log("Chưa có kết nối")
            setMessageContent('');
            setSelectImg('');
            // viewDoctorMessage(userId);
            addNotification(userId, messageContent)
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    if (current_user === null)
        <Navigate to="/" />

    const [open, setOpen] = useState(true);
    const [selectedValue, setSelectedValue] = useState(1);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
    };

    const handleImgChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setSelectImg(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [listMessage, messagesEndRef]);

    const addNotification = async (userId, notificationContent) => {
        try {
            let res = await authApi().post(endpoints['add-notification'], {
                "senderId": current_user?.userId,
                "receiverId": userId,
                "notificationTypeId": "1",
                "notificationContent": "Bạn có một tin nhắn mới: " + notificationContent
            })

            var myNoti = {
                "senderId": current_user?.userId,
                "receiverId": userId,
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

    return <>
        <div className="Doctor_Message_Wrapper">
            <div className="Doctor_Message">
                {/* <div className="Doctor_Message_Left">
                    <div className="Doctor_Message_Left_Content">
                        <DoctorMenu />
                    </div>
                </div> */}
                <div className="Doctor_Message_Middle">
                    <div className="Doctor_Message_Middle_Header">
                        <h5 style={{ width: "65%" }}>{profile}</h5>
                        <button onClick={handleClickOpen}>
                            {/* <img src={current_user?.avatar} alt="avatar" style={{ width: "100%" }} /> */}
                            Chọn hồ sơ
                        </button>
                    </div>
                    <div style={{ marginRight: "2rem" }}>
                        <SimpleDialog
                            selectedValue={selectedValue}
                            open={open}
                            onClose={handleClose}
                            onButtonClick={getUserSendMessageToDoctor}
                        />
                    </div>
                    <div className="Doctor_Message_Middle_Content">
                        <div className="Doctor_Message_Middle_Container">
                            <div className="Doctor_Message_Middle_Info">
                                <input type="text" placeholder="Nhập tên hồ sơ cần tìm..."></input>
                                <div className="Profile_List">
                                    {userSendMessageToDoctor.length === 0 ? <>
                                        <div className="Profile_List_404">
                                            <img src={printer} alt="404" width={'20%'} />
                                            <span>Vui lòng chọn Profile để xem tin nhắn</span>
                                        </div>
                                    </> : <>
                                        <div className="Profile_List_Info">
                                            <ul style={{ paddingLeft: "1rem", paddingRight: "0.75rem" }}>
                                                {/* {Object.values(userSendMessageToDoctor).map(usmtd => {
                                                    return <>
                                                        <div className="Profile_List_Detail" value={selectedProfile} onClick={() => { viewDoctorMessage(usmtd[0].userId); setPatientName(`${usmtd[0].firstname} ${usmtd[0].lastname}`) }}>
                                                            <div className="avatar_Cont"><img src={usmtd[0].avatar} alt="profileicon" /></div>
                                                            <div className="Profile_List_Detail_Mes_Info">
                                                                <li key={usmtd[0].userId} value={usmtd[0].userId}>{usmtd[0].firstname} {usmtd[0].lastname}</li>
                                                                <p>{usmtd[3]}</p>
                                                            </div>
                                                        </div>
                                                    </>
                                                })} */}
                                                {Object.values(userSendMessageToDoctor).map(usmtd => {
                                                    const isSeen = usmtd[5] === false;

                                                    return (
                                                        <div
                                                            className={`Profile_List_Detail ${isSeen && usmtd[2] !== selectedProfile ? 'seen' : ''}`}
                                                            value={selectedProfile}
                                                            onClick={() => {
                                                                viewDoctorMessage(usmtd[0].userId, usmtd[1]);
                                                                setPatientName(`${usmtd[0].firstname} ${usmtd[0].lastname}`);
                                                            }}
                                                        >
                                                            <div className="avatar_Cont">
                                                                <img src={usmtd[0].avatar} alt="profileicon" />
                                                            </div>
                                                            <div className="Profile_List_Detail_Mes_Info">
                                                                <li key={usmtd[0].userId} value={usmtd[0].userId}>
                                                                    {usmtd[0].firstname} {usmtd[0].lastname}
                                                                </li>
                                                                <p>{usmtd[3]}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="Doctor_Message_Right">
                    <>
                        <section>
                            {/* <div className="Doctor_Message_Right_Header"><h2 className="text-center mb-4">Tin nhắn</h2></div> */}
                            <div className="Doctor_Message_Right_Content">
                                {profileDoctor === null ? <>
                                    <div className="Doctor_Message_Null">
                                        <h5 className="mb-4">Chọn hồ sơ cần xem</h5>
                                        <img src={profile404} alt="Not found" width={'20%'} />
                                    </div>
                                </> :
                                    <>
                                        <div>
                                            {userSendMessageToDoctor.length === 0 ? <>
                                                <div className="Doctor_Message_Null">
                                                    <h5 className="mb-4">Bạn chưa nhắn tin với bệnh nhân nào</h5>
                                                    <img src={message} alt="Not found" width={'20%'} />
                                                </div>
                                            </> :
                                                <>
                                                    {/* {userSendMessageToDoctor.map(usmtd => {
                                                        return <>
                                                            <Accordion>
                                                                <AccordionSummary
                                                                    expandIcon={<ExpandMoreIcon />}
                                                                    aria-controls="panel1a-content"
                                                                    id="panel1a-header"
                                                                    className="Prescription_Item"
                                                                >
                                                                    <Typography>Bệnh nhân: {usmtd.firstname} {usmtd.lastname}</Typography>
                                                                </AccordionSummary>
                                                                <AccordionDetails className="Doctor_Message_Detail">
                                                                    <div className="Doctor_Message_Detail_Inner">
                                                                        <h4 className="text-center mb-3 mt-3">{usmtd.firstname} {usmtd.lastname}</h4>
                                                                        <div className="Message_Content">
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
                                                                        <div className="Send_Message">
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
                                                    })} */}
                                                    {listMessage.length === 0 ? <>
                                                        <div className="Doctor_Message_Null">
                                                            <h5 className="mb-4">Vui lòng chọn bệnh nhân để xem tin nhắn</h5>
                                                            <img src={message} alt="Not found" width={'20%'} />
                                                        </div>
                                                    </> :
                                                        <>
                                                            <div>
                                                                <h4 className="text-center mb-3 mt-3">{patientName}</h4>
                                                                <div className="Message_Content">
                                                                    {Object.values(listMessage).map((mes) => {
                                                                        return <>
                                                                            {selectedProfile === mes.senderId ?
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
                                                                    {selectImg ? (
                                                                        <div style={{ position: 'relative', display: 'inline-block' }}>
                                                                            <img src={selectImg} alt="Selected" width="20%" />
                                                                            <div style={{ position: 'absolute', top: -10, right: 15, cursor: 'pointer' }} onClick={() => setSelectImg('')}>
                                                                                <MdRemoveCircle size={25} color="grey" />
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <></>
                                                                    )}
                                                                    <div className="send_area">
                                                                        <Form.Control className="mt-2" style={{ width: '15%', padding: '3px', margin: "8px" }} accept=".jpg, .jpeg, .png, .gif, .bmp" type="file" onChange={handleImgChange} ref={avatar} />
                                                                        <div>
                                                                            <input type="text" value={messageContent} onFocus={handleFocus} onChange={(e) => setMessageContent(e.target.value)} placeholder="Nhập nội dung tin nhắn..." />
                                                                            {messageContent === null && selectImg === '' ? <button type="button">Gửi</button> : loading === true ? <Spinner /> : <button type="button" onClick={(e) => addMessage(e, selectedPatient)}>Gửi</button>}
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

export default DoctorMessage;