import { FaFacebook, FaGoogle } from "react-icons/fa";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import "../styles/Login.css"
import logo from "../assests/images/improokcare-logo.png"
import { useState } from "react";
import cookie from "react-cookies"
import { useContext } from "react";
import { MyUserContext } from "../App";
import { Navigate, useNavigate, Link, useSearchParams } from "react-router-dom"
import { Form } from "react-bootstrap"
import Apis, { authApi, endpoints } from "../configs/Apis";
import { toast } from "react-toastify";
import MySpinner from "../layout/MySpinner";

const Login = () => {
    const [user, dispatch] = useContext(MyUserContext)
    const [username, setUsername] = useState();
    const [password, setPassword] = useState("");
    const nav = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [q] = useSearchParams();

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

                dispatch({
                    "type": "login",
                    "payload": data
                });
                setLoading(false)
                if (res.status === 200)
                    toast.success("Đăng nhập thành công!");
            } catch (err) {
                // toast.error(err.request.responseText)
                // console.log(err.request.responseText);
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
        <div class="Login_Wrapper">
            <div class="Login_Content">
                <div class="Login_Form">
                    <div class="Login_Left">
                        <img src={logo} alt="IMPROOKCARE" />
                    </div>
                    <div class="Login_Right">
                        <Form class="Login_Form">
                            <div class="Login_Detail">
                                <div class="Login_Header">
                                    <div>
                                        <div>ĐĂNG NHẬP NGƯỜI DÙNG</div>
                                    </div>
                                </div>
                                <div class="Login_Fill">
                                    <div class="Login_User">
                                        <div class="Login_User_Input">
                                            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Số điện thoại/Tên Đăng Nhập"></input>
                                        </div>
                                        <div class="Separate"></div>
                                    </div>
                                    <div class="Login_Password">
                                        <div class="Login_Password_Input">
                                            <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Nhập mật khẩu"></input>
                                            <button type="button" onClick={toggleShowPassword}>
                                                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                                            </button>
                                        </div>
                                        <div class="Separate"></div>
                                    </div>
                                    {loading === true ? <MySpinner /> : <button class="Login_Butt" onClick={login}>Đăng nhập</button>}
                                    <div class="Login_Help">
                                        <span>
                                            <span><input type="checkbox" /> Ghi nhớ mật khẩu</span>
                                        </span>
                                        <Link to="/forgetpassword">Quên mật khẩu</Link>
                                    </div>
                                    <div class="Login_Option">
                                        <div class="Login_Or">
                                            <div></div>
                                            <span>Hoặc</span>
                                            <div></div>
                                        </div>
                                        <div class="Login_Another">
                                            <button><FaGoogle /> Google</button>
                                            <button><FaFacebook /> Facebook</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="To_Register">
                                    <div>
                                        Bạn mới biết đến đền I'MPROOK Care?
                                        <Link to="/register"> Đăng ký</Link>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default Login;