import "./Register.css"
import LoginLogo from "../../assets/images/login-banner.png"
import { useContext, useState } from "react";
import { Form } from "react-bootstrap"
import Apis, { endpoints } from "../../configs/Apis";
import { Navigate, useNavigate, Link } from "react-router-dom"
import { UserContext } from "../../App";
import cookie from "react-cookies"
import Spinner from "../../layout/Spinner";
import { AccountCircle, Facebook, Google, Lock, Person, Visibility, VisibilityOff } from "@mui/icons-material";
import { InputGroup } from "react-bootstrap";
import Swal from "sweetalert2";

const Register = (props) => {
    const [current_user,] = useContext(UserContext)
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
                    Swal.fire(
                        'Thành công', "Đăng ký thành công!", 'success'
                    );
                    nav("/login");
                }
                else
                    Swal.fire(
                        'Thất bại', "Đăng ký thất bại!", 'error'
                    );
            } catch (error) {
                console.log(error);
            }
        }

        if (password === confirmPass)
            process();
        else
            Swal.fire(
                'Cảnh báo', "Mật khẩu không khớp!", 'warning'
            );
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
        <div className="Register_Wrapper">
            <div className="Register_Content">
                <div className="Register_Form">
                    <div className="Register_Left">
                        <img src={LoginLogo} alt="IMPROOKCARE" />
                    </div>
                    <div className="Register_Right">
                        <Form className="Register_Form">
                            <div className="Register_Detail">
                                <div className="Register_Header">
                                    <div>ĐĂNG KÝ</div>
                                </div>
                                <div className="Register_Fill">
                                    <Form onSubmit={register}>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text><Person /></InputGroup.Text>
                                            <Form.Control
                                                placeholder="Tên"
                                                aria-label="Last Name"
                                                aria-describedby="basic-addon1"
                                                defaultValue={firstname}
                                                onChange={(e) => setFirstname(e.target.value)}
                                                required
                                            />
                                        </InputGroup>
                                        <div className="Separate"></div>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text><Person /></InputGroup.Text>
                                            <Form.Control
                                                placeholder="Họ và tên đệm"
                                                aria-label="First Name"
                                                aria-describedby="basic-addon1"
                                                defaultValue={lastname}
                                                onChange={(e) => setLastname(e.target.value)}
                                                required
                                            />
                                        </InputGroup>
                                        <div className="Separate"></div>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text><AccountCircle /></InputGroup.Text>
                                            <Form.Control
                                                placeholder="Tài khoản"
                                                aria-label="Username"
                                                aria-describedby="basic-addon1"
                                                disabled
                                                value={username}
                                            />
                                        </InputGroup>
                                        <div className="Register_User">
                                            <div className="Separate"></div>
                                            <div className="Register_User_Gender">
                                                <Form.Check type="radio" label="Nam" name="radioOption" defaultChecked onChange={(e) => setGender(true)} />
                                                <Form.Check type="radio" label="Nữ" name="radioOption" onChange={(e) => setGender(false)} />
                                            </div>
                                            <div className="Separate"></div>
                                        </div>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text><Lock /></InputGroup.Text>
                                            <Form.Control
                                                placeholder="Mật khẩu"
                                                aria-label="Password"
                                                type={showPassword ? 'text' : 'password'}
                                                aria-describedby="basic-addon1"
                                                required
                                                defaultValue={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <button type="button" className="Show_Pass" onClick={toggleShowPassword}>
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </button>
                                        </InputGroup>
                                        <div className="Separate"></div>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text><Lock /></InputGroup.Text>
                                            <Form.Control
                                                placeholder="Xác nhận mật khẩu"
                                                aria-label="Confirm Password"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                aria-describedby="basic-addon1"
                                                required
                                                defaultValue={confirmPass}
                                                onChange={(e) => setConfirmPass(e.target.value)}
                                            />
                                            <button type="button" className="Show_Pass" onClick={toggleShowConfirmPassword}>
                                                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                            </button>
                                        </InputGroup>
                                        <div className="Separate"></div>
                                        {loading === true ? <Spinner /> : <button type="submit" className="Register_Butt">Đăng ký</button>}
                                    </Form>
                                    {/* {loading === true ? <Spinner /> : <button className="Register_Butt">Đăng ký</button>} */}
                                    {/* <div className="Register_Help">
                                            <a href="/">Quên mật khẩu</a>
                                            <a href="/">Đăng ký với SMS</a>
                                        </div> */}
                                    <div className="Separate"></div>
                                    <div className="Register_Option">
                                        <div className="Register_Or">
                                            <div></div>
                                            <span>Or</span>
                                            <div></div>
                                        </div>
                                        <div className="Register_Another">
                                            <button><Google /> Google</button>
                                            <button><Facebook /> Facebook</button>
                                        </div>
                                    </div>
                                    <div className="Register_Policy">
                                        <div>
                                            Bằng việc đăng kí, bạn đã đồng ý với Spring Care về
                                            <Link to="/"> Điều khoản dịch vụ </Link>
                                            &
                                            <Link to="/"> Chính sách bảo mật</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="To_Login">
                                    <div>
                                        Bạn đã có tài khoản?
                                        <Link to="/login"> Đăng nhập</Link>
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

export default Register;