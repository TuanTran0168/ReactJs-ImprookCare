import "../styles/Register.css"
import { FaFacebook, FaGoogle, FaRegTimesCircle } from "react-icons/fa";
import logo from "../assests/images/tech-health-care.png";
import { useContext, useState } from "react";
import { Form } from "react-bootstrap"
import Apis, { endpoints } from "../configs/Apis";
import { Navigate, useNavigate, Link } from "react-router-dom"
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { MyUserContext } from "../App";
import cookie from "react-cookies"
import { toast } from "react-toastify";
import MySpinner from "../layout/MySpinner";

const Register = (props) => {
    const [current_user,] = useContext(MyUserContext)
    // const [user, setUser] = useState({
    //     "firstname": "",
    //     "lastname": "",
    //     "username": cookie.load("phonenumber"),
    //     "password": "",
    //     "confirmPass": "",
    //     "gender": ""
    // })

    const nav = useNavigate();
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username,] = useState(cookie.load("phonenumber"));
    // const [username,] = useState(props.username);
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [gender, setGender] = useState(true)
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const register = (evt) => {
        evt.preventDefault();

        const process = async () => {
            setLoading(true);

            try {
                // let form = new FormData();
                // for (let field in user)
                //     if (field !== "confirmPass" || field !== "gender")
                //         form.append(field, user[field]);

                // form.delete("gender");
                // if (gender === false) {
                //     form.append("gender", false)
                // } else {
                //     form.append("gender", true)
                // }

                let res = await Apis.post(endpoints['register'], {
                    "username": username,
                    "password": password,
                    "firstname": firstname,
                    "lastname": lastname,
                    "gender": gender
                });

                cookie.save("register", res.data);
                console.log(res)

                // let res = await Apis.post(endpoints['register']);
                if (res.status === 200) {
                    cookie.remove("register");
                    cookie.remove("phonenumber");
                    toast.success("Đăng ký thành công!");
                    nav("/login");
                }
                else
                    toast.error("Đăng ký thất bại!");
            } catch (error) {
                console.log(error);
            }
        }

        if (password === confirmPass)
            process();
        else
            toast.warning("Mật khẩu không khớp!")
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    // const change = (evt, field) => {
    //     // setUser({ ...user, [field]: evt.target.value })
    //     setUser(current => {
    //         return { ...current, [field]: evt.target.value }
    //     })
    // }

    if (current_user !== null)
        return <Navigate to="/" />

    return (<>
        <div class="Register_Wrapper">
            <div class="Register_Content">
                <div class="Register_Form">
                    <div class="Register_Left">
                        <img src={logo} alt="IMPROOKCARE" />
                    </div>
                    <div class="Register_Right">
                        <Form class="Register_Form">
                            <div class="Register_Form">
                                <div class="Register_Detail">
                                    <div class="Register_Header">
                                        <div>
                                            <div>ĐĂNG KÝ NGƯỜI DÙNG</div>
                                        </div>
                                    </div>
                                    <div class="Register_Fill">
                                        <div class="Register_User">
                                            <div class="Register_User_Input">
                                                <input type="text" defaultValue={firstname} onChange={(e) => setFirstname(e.target.value)} placeholder="Tên" required></input>
                                            </div>
                                            <div class="Separate"></div>
                                        </div>
                                        <div class="Register_User">
                                            <div class="Register_User_Input">
                                                <input type="text" defaultValue={lastname} onChange={(e) => setLastname(e.target.value)} placeholder="Họ và tên đệm" required></input>
                                            </div>
                                            <div class="Separate"></div>
                                        </div>
                                        <div class="Register_User">
                                            <div class="Register_User_Gender">
                                                <Form.Check type="radio" label="Nam" name="radioOption" defaultChecked onChange={(e) => setGender(true)} />
                                                <Form.Check type="radio" label="Nữ" name="radioOption" onChange={(e) => setGender(false)} />
                                            </div>
                                            <div class="Separate"></div>
                                        </div>
                                        <div class="Register_User">
                                            <div class="Register_User_Input">
                                                <input type="text" value={username} disabled></input>
                                            </div>
                                            <div class="Separate"></div>
                                        </div>
                                        <div class="Register_Password">
                                            <div class="Register_Password_Input">
                                                <input type={showPassword ? 'text' : 'password'} defaultValue={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nhập mật khẩu" required></input>
                                                <button type="button" onClick={toggleShowPassword}>
                                                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                                                </button>
                                            </div>
                                            <div class="Separate"></div>
                                        </div>
                                        <div class="Password_Confirm">
                                            <div class="Password_Confirm_Input">
                                                <input type={showConfirmPassword ? 'text' : 'password'} defaultValue={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} placeholder="Xác nhận mật khẩu" required></input>
                                                <button type="button" onClick={toggleShowConfirmPassword}>
                                                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                                                </button>
                                            </div>
                                            <div class="Separate"></div>
                                        </div>
                                        {/* <button class="Register_Butt">Đăng ký</button> */}
                                        {loading === true ? <MySpinner /> : <button class="Register_Butt" onClick={register}>Đăng ký</button>}
                                        {/* <div class="Register_Help">
                                            <a href="/">Quên mật khẩu</a>
                                            <a href="/">Đăng ký với SMS</a>
                                        </div> */}
                                        <div class="Register_Option">
                                            <div class="Register_Or">
                                                <div></div>
                                                <span>Hoặc</span>
                                                <div></div>
                                            </div>
                                            <div class="Register_Another">
                                                <button><FaGoogle /> Google</button>
                                                <button><FaFacebook /> Facebook</button>
                                            </div>
                                        </div>
                                        <div class="Register_Policy">
                                            <div>
                                                Bằng việc đăng kí, bạn đã đồng ý với Spring Care về
                                                <Link to="/"> Điều khoản dịch vụ </Link>
                                                &
                                                <Link to="/"> Chính sách bảo mật</Link>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div class="To_Login">
                                        <div>
                                            Bạn đã có tài khoản?
                                            <a href="/login"> Đăng nhập</a>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default Register;