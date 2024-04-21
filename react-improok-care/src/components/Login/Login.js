import "./Login.css"
import LoginLogo from "../../assets/images/login-banner.png"
import { useContext, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom"
import Form from 'react-bootstrap/Form'
import Spinner from "../../layout/Spinner"
import { Facebook, Google, Lock, Person, Visibility, VisibilityOff } from "@mui/icons-material";
import { InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import cookie from "react-cookies";
import { UserContext, WebSocketContext } from "../../App";
import Apis, { authApi, endpoints } from "../../configs/Apis";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import { reConnectNotification } from "../../utils/WebSocket";
// import { connectNotification } from "../../utils/WebSocket";

var clientStomp = null
var connectNoti = null

const Login = () => {
    const [user, dispatch] = useContext(UserContext)
    const [webSocket, dispatchWebSocket] = useContext(WebSocketContext)
    const [username, setUsername] = useState();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [q] = useSearchParams();

    // const onErrorNotification = (err) => {
    //     console.log(err);
    // }

    // const onPrivateNotification = (payload) => {
    //     console.log("ĐÂY LÀ PAYLOAD");
    //     console.log(payload);
    //     var payloadData = JSON.parse(payload.body);
    //     console.log("PAYLOAD LÀM SẠCH");
    //     console.log(payloadData);
    //     toast.info(payloadData.notificationContent);
    // }

    const login = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                setLoading(true);
                let res = await Apis.post(endpoints['login'], {
                    "username": username.trim(),
                    "password": password
                });

                cookie.save("token", res.data);
                console.log(res)
                console.log(cookie.load("token"))

                let { data } = await authApi().get(endpoints['current-user']);

                console.log(data)
                cookie.save('user', data)
                // connectNotification(data.userId);

                // connectNoti = connectNotification(data.userId);
                connectNoti = reConnectNotification(false, data.userId)
                // cookie.save("socket", connectNoti)

                dispatch({
                    "type": "login",
                    "payload": data
                });
                dispatchWebSocket({
                    "type": "login",
                    "payload": connectNoti
                });

                setLoading(false)
                console.log("Login", connectNoti);
                if (res.status === 200)
                    toast.success("Đăng nhập thành công!");
                // const connectNotification = () => {
                //     let Sock = new SockJS('http://localhost:2024/IMPROOK_CARE/api/public/notification/')
                //     clientStomp = over(Sock)
                //     clientStomp.connect({}, onConnectedNotification, onErrorNotification)
                // }

                // const onConnectedNotification = () => {
                //     localStorage.setItem('isConnected', 'true');
                //     clientStomp.subscribe('/user/' + data.userId + '/notification', onPrivateNotification);
                // }

                // connectNotification(clientStomp, data.userId);
            } catch (err) {
                setLoading(false);
                toast.error("Sai tài khoản hoặc mật khẩu!");
            }
        }
        process();
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    if (user !== null) {
        let next = q.get("next") || "/";
        return <Navigate to={next} />
    }

    return (<>
        <div className="Login_Wrapper">
            <div className="Login_Content">
                <div className="Login_Form">
                    <div className="Login_Left">
                        <img src={LoginLogo} alt="IMPROOKCARE" />
                    </div>
                    <div className="Login_Right">
                        <div className="Login_Form">
                            <div className="Login_Detail">
                                <div className="Login_Header">
                                    <div>ĐĂNG NHẬP</div>
                                </div>
                                <div className="Login_Fill">
                                    <Form onSubmit={login}>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text><Person /></InputGroup.Text>
                                            <Form.Control
                                                placeholder="Username/Phone"
                                                aria-label="Username"
                                                aria-describedby="basic-addon1"
                                                required
                                                value={username}
                                                onChange={e => setUsername(e.target.value)} />
                                        </InputGroup>
                                        <div className="Separate"></div>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text><Lock /></InputGroup.Text>
                                            <Form.Control
                                                placeholder="Password"
                                                aria-label="Password"
                                                type={showPassword ? 'text' : 'password'}
                                                aria-describedby="basic-addon1"
                                                required
                                                value={password}
                                                onChange={e => setPassword(e.target.value)} />
                                            <button className="Show_Pass" type="button" onClick={toggleShowPassword}>
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </button>
                                        </InputGroup>
                                        <div className="Separate"></div>
                                        {loading === true ? <Spinner /> : <button className="Login_Butt" type="submit">Login</button>}
                                    </Form>
                                    <div className="Login_Help">
                                        <span>
                                            <span><input className="Remember_Check" type="checkbox" /> Remember Me</span>
                                        </span>
                                        <Link to="/forgetpassword">Forget Password?</Link>
                                    </div>
                                    <div className="Login_Option">
                                        <div className="Login_Or">
                                            <div></div>
                                            <span>Or</span>
                                            <div></div>
                                        </div>
                                        <div className="Login_Another">
                                            <button><Google /> Google</button>
                                            <button><Facebook /> Facebook</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="To_Register">
                                    <div>
                                        Bạn mới biết đến I'MPROOK Care?
                                        <Link to="/phoneverification"> Đăng ký</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default Login;