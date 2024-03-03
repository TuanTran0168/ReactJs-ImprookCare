import Spinner from "../../layout/Spinner";
import { Form, InputGroup } from "react-bootstrap";
import { useContext, useState } from "react";
import { UserContext } from "../../App";
import "./ChangePassword.css";
import { Link, useNavigate } from "react-router-dom";
import { authApi, endpoints } from "../../configs/Apis";
import { toast } from "react-toastify";
// import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Key, Lock, Visibility, VisibilityOff } from "@mui/icons-material";

const ChangePassword = () => {
    const [current_user, dispatch] = useContext(UserContext);
    const [loading, setLoading] = useState(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // const [username, setUsername] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewpassword, setConfirmNewpassword] = useState('')

    // const [newPassword, setNewPassword] = useState({
    //     "username": current_user.username,
    //     "currentPassword": "",
    //     "newPassword": "",
    //     "confirmNewpassword": "",
    // })

    const nav = useNavigate();

    // const change = (evt, field) => {
    //     setNewPassword(current => {
    //         return { ...current, [field]: evt.target.value }
    //     })
    // }

    const passwordChange = (evt) => {
        const process = async () => {
            try {
                setLoading(true);

                // let form = new FormData();

                console.log(currentPassword, newPassword)

                // form.append("username", newPassword.username);
                // form.append("currentPassword", newPassword.currentPassword);
                // form.append("newPassword", newPassword.newPassword);

                let res = await authApi().post(endpoints['change-password'], {
                    "username": current_user.username,
                    "currentPassword": currentPassword,
                    "newPassword": newPassword
                });

                if (res.data === "Đổi mật khẩu thành công!") {
                    toast.success("Đổi mật khẩu thành công!")
                    nav("/");
                    console.log(res.data)
                }
                setLoading(false);
            } catch (error) {
                if (error.request.responseText === "Người dùng không tồn tại!") {
                    toast.error(error.request.responseText)
                    console.log(error.request.responseText)
                }
                else if (error.request.responseText === "Mật khẩu hiện tại và mật khẩu cũ không khớp!") {
                    toast.error(error.request.responseText)
                    console.log(error.request.responseText)
                }
                else {
                    toast.error(error.request.responseText)
                    console.log(error.request.responseText)
                }
                setLoading(false);
            }
        }
        if (newPassword === confirmNewpassword)
            process();
        else {
            toast.error("Mật khẩu KHÔNG khớp!");
        }
    }

    const toggleShowCurrentPassword = () => {
        setShowCurrentPassword(!showCurrentPassword);
    };

    const toggleShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const logout = () => {
        dispatch({
            "type": "logout"
        })
        nav("/")
    }

    return <>
        <div className="ChangePassword_Wrapper">
            <div className="ChangePassword_Content">
                <div className="ChangePassword_Form">
                    {/* <div class="ChangePassword_Left">
                        <ul>
                            <li><Link to="/personalpage">Thông tin cá nhân</Link></li>
                            <li><Link to="/changepassword">Đổi mật khẩu</Link></li>
                            <li><Link to="/appointment">Lịch khám</Link></li>
                            <li><Link to="/medicalrecord">Lịch sử khám</Link></li>
                            <li><Link to="/profile">Hồ sơ</Link></li>
                            <li onClick={logout}>Đăng xuất</li>
                        </ul>
                    </div> */}
                    <div className="ChangePassword_Right">
                        <div className="ChangePassword_Right_Form">
                            <div className="ChangePassword_Detail">
                                <div className="ChangePassword_Header">
                                    <div>
                                        <div>THAY ĐỔI MẬT KHẨU</div>
                                    </div>
                                </div>
                                <div className="ChangePassword_Fill">
                                    {/* <div class="ChangePassword_User">
                                        <div class="ChangePassword_Old">
                                            <input type={showCurrentPassword ? 'text' : 'password'} defaultValue={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Mật khẩu hiện tại" required></input>
                                            <button type="button" onClick={toggleShowCurrentPassword}>
                                                {showCurrentPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                                            </button>
                                        </div>
                                        <div class="Separate"></div>
                                    </div>
                                    <div class="ChangePassword_User">
                                        <div class="ChangePassword_New">
                                            <input type={showNewPassword ? 'text' : 'password'} defaultValue={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mật khẩu mới" required></input>
                                            <button type="button" onClick={toggleShowNewPassword}>
                                                {showNewPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                                            </button>
                                        </div>
                                        <div class="Separate"></div>
                                    </div>
                                    <div class="ChangePassword_User">
                                        <div class="ChangePassword_Confirm">
                                            <input type={showConfirmPassword ? 'text' : 'password'} onChange={(e) => setConfirmNewpassword(e.target.value)} placeholder="Xác nhận mật khẩu mới" required></input>
                                            <button type="button" onClick={toggleShowConfirmPassword}>
                                                {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                                            </button>
                                        </div>
                                        <div class="Separate"></div>
                                    </div>
                                    {loading === true ? <Spinner /> : <button type="button" class="ChangePassword_Butt" onClick={(e) => passwordChange(e)}>Lưu thay đổi</button>} */}
                                    <Form onSubmit={(e) => passwordChange(e)}>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text><Lock /></InputGroup.Text>
                                            <Form.Control
                                                placeholder="Password"
                                                aria-label="Password"
                                                type={showCurrentPassword ? 'text' : 'password'}
                                                aria-describedby="basic-addon1"
                                                required
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                            />
                                            <button className="Show_Pass" type="button" onClick={toggleShowCurrentPassword}>
                                                {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                                            </button>
                                        </InputGroup>
                                        <div className="Separate"></div>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text><Key /></InputGroup.Text>
                                            <Form.Control
                                                placeholder="New Password"
                                                aria-label="New Password"
                                                type={showNewPassword ? 'text' : 'password'}
                                                aria-describedby="basic-addon1"
                                                required
                                                value={newPassword}
                                                onChange={e => setNewPassword(e.target.value)}
                                            />
                                            <button className="Show_Pass" type="button" onClick={toggleShowNewPassword}>
                                                {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                            </button>
                                        </InputGroup>
                                        <div className="Separate"></div>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text><Key /></InputGroup.Text>
                                            <Form.Control
                                                placeholder="Confirm Password"
                                                aria-label="Confirm Password"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                aria-describedby="basic-addon1"
                                                required
                                                value={confirmNewpassword}
                                                onChange={e => setConfirmNewpassword(e.target.value)}
                                            />
                                            <button className="Show_Pass" type="button" onClick={toggleShowConfirmPassword}>
                                                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                            </button>
                                        </InputGroup>
                                        {/* {loading === true ? <Spinner /> : <button type="button" className="ChangePassword_Butt" onClick={(e) => passwordChange(e)}>Lưu thay đổi</button>} */}
                                        {loading === true ? <Spinner /> : <button type="submit" className="ChangePassword_Butt">Lưu thay đổi</button>}
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default ChangePassword;