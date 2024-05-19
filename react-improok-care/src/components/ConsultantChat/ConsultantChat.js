import "./ConsultantChat.css"
import { MessageBox } from "react-chat-elements";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../App";
import Spinner from "../../layout/Spinner"
import { Navigate } from "react-router-dom";
import doctorai from "../../assets/images/doctor_ai.png";
import { authApi, endpoints } from "../../configs/Apis";

const ConsultantChat = () => {
    const [current_user,] = useContext(UserContext);
    const messagesEndRef = useRef(null);
    const [listMessage, setListMessage] = useState([]);
    const [messageContent, setMessageContent] = useState([]);
    const [loading, setLoading] = useState(false);

    const [reversedMessages, setReversedMessages] = useState([]);

    useEffect(() => {
        const loadChatGPTConsult = async () => {
            try {
                let res = await authApi().get(endpoints['load-chatgpt-consult'](current_user?.userId))
                console.log(res.data.content)
                setListMessage(res.data.content)
            } catch (error) {
                console.log(error)
            }
        }
        loadChatGPTConsult();
    }, [])

    const addChatGPTConsult = async () => {
        try {
            setLoading(true);
            let res = await authApi().post(endpoints['add-chatgpt-consult'], {
                "patientQuestion": messageContent,
                "userId": current_user?.userId
            })
            console.log(res.data)
            // setListMessage(prevList => [...prevList, res.data]);
            setListMessage(prevList => [res.data, ...prevList]);
            setMessageContent('');
            setLoading(false);
        } catch (error) {
            console.log(error)
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    };

    useEffect(() => {
        scrollToBottom();
        setReversedMessages(Object.values(listMessage).reverse());
    }, [listMessage]);

    if (current_user === null)
        <Navigate to="/" />

    return (
        <>
            <div className="consultant_wrapper">
                <div>
                    <div className="consultant_header">
                        <img src={doctorai} alt="404" width={'5%'} />
                        <h2 className="text-center mb-3 mt-3">DOCTOR OPEN AI</h2>
                    </div>
                    <div className="consultant_content">
                        {listMessage.length === 0 ?
                            <>
                                <div className="consultant_null">
                                    <p>Chào bạn! Tôi là DOCTOR AI, có thể giúp bạn với những câu hỏi về sức khỏe. Các tư vấn của tôi chỉ dành cho mục đích tham khảo và không thay thế cho việc chuẩn đoán hoặc điều trị y khoa. Bạn cần tuyệt đối tuân theo hướng dẫn của Bác sĩ và Nhân viên y tế.</p>
                                </div>
                            </> :
                            <>
                                <div>
                                    {Object.values(reversedMessages).map((mes) => {
                                        return <>
                                            <div key={mes.chatgptConsultId}>
                                                <MessageBox
                                                    position={'right'}
                                                    type={'text'}
                                                    // avatar={mes.avatar}
                                                    status={null}
                                                    text={mes.patientQuestion}
                                                    date={mes.createdDate}
                                                />
                                                <MessageBox
                                                    position={'left'}
                                                    type={'text'}
                                                    // avatar={mes.avatar}
                                                    status={null}
                                                    text={mes.chatgptConsultAnswer}
                                                    date={mes.createdDate} />
                                            </div>
                                        </>
                                    })}
                                    <div ref={messagesEndRef}></div>
                                </div>
                            </>
                        }
                    </div>
                    <div className="consultant_send">
                        <div className="consultant_send_chat">
                            <div>
                                <input className="input-text" type="text" value={messageContent} onChange={(e) => setMessageContent(e.target.value)} placeholder="Nhập nội dung tin nhắn..." />
                                {messageContent === "" ? <button type="button">Gửi</button> : loading === true ? <Spinner /> : <button type="button" onClick={() => addChatGPTConsult()}>Gửi</button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConsultantChat;