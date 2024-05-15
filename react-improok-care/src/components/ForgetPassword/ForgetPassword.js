import { Form, InputGroup } from "react-bootstrap";
import LoginLogo from "../../assets/images/login-banner.png"
import Spinner from "../../layout/Spinner"
import Apis, { endpoints } from "../../configs/Apis";
import { toast } from "react-toastify";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import "./ForgetPassword.css"
import { Lock, Password, Phone, Visibility, VisibilityOff } from "@mui/icons-material";

const ForgetPassword = () => {
    const [current_user,] = useContext(UserContext)
    const [err, setErr] = useState(null);
    const [code, setCode] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewpassword, setConfirmNewpassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [check, setCheck] = useState(false)
    const [isPhonenumbervalid, setIsPhoneNumberValid] = useState(false)
    const [successVerification, setSuccessVerification] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // const [isPhonenumberValid, setIsPhonenumberValid] = useState(false);
    // const [isCodeValid, setIsCodeValid] = useState(false);
    const nav = useNavigate();

    const [verificationInfo, setVerificationInfo] = useState(null)

    const handleCodeChange = (evt) => {
        setCode(evt.target.value);
    };

    const handleCheck = (evt) => {
        setCheck(evt.target.checked);
    }

    const OTPSender = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                setLoading(true);
                console.log(phonenumber);
                // let form = new FormData();
                // form.append("phonenumber", phonenumber);
                let resVerification = await Apis.post(endpoints['verification-forgot-password'], {
                    "phonenumber": phonenumber
                })
                // let resVerification = await Apis.get(endpoints['verification'], form)
                console.log(resVerification.status);
                setLoading(false);

            } catch (error) {
                if (error.response.data === "Số điện thoại " + phonenumber + " đã được đăng ký") {
                    toast.warning(error.response.data);
                    console.log(error.code);
                }
                else {
                    toast.success(error.response.data);
                    console.log(error.response.data);
                }
                setLoading(false);
            }
        }
        process();
    }

    const toggleShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const verification = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                setLoading(true)
                if (code === '') {
                    toast.warning("Vui lòng nhập OTP");
                    setLoading(false);
                }
                console.log("code" + code)
                console.log("phonenumber" + phonenumber)
                let res = await Apis.post(endpoints['verification-check'], {
                    "code": code,
                    "phonenumber": phonenumber
                })
                console.log(res.data);
                setSuccessVerification(!successVerification);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
        process();
    }

    const createNewPassword = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                setLoading(true)
                console.log("code" + code)
                console.log("phonenumber" + phonenumber)
                let res = await Apis.post(endpoints['forgot-password'], {
                    "username": phonenumber,
                    "newPassword": newPassword
                })
                if (res.data === "Đổi mật khẩu thành công!") {
                    toast.success(res.data)
                    nav('/login')
                }
                else {
                    toast.error(res.data)
                    nav('/login')
                }
                console.log(res.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
        process();
    }

    const validatePhoneNumber = (evt) => {
        evt.preventDefault();

        const phoneNumberInput = document.getElementById('phoneNumberInput');
        const errorMsg = document.getElementById('errorMsg');
        const phoneNumber = phoneNumberInput.value;

        // Kiểm tra định dạng số điện thoại
        const phoneRegex = /^0\d{9}$/;
        if (phoneNumber === '') {
            errorMsg.style.display = 'none';
            setIsPhoneNumberValid(false)
        } else if (!phoneRegex.test(phoneNumber)) {
            errorMsg.style.display = 'block';
            setIsPhoneNumberValid(false);
        } else {
            errorMsg.style.display = 'none';
            setIsPhoneNumberValid(true);
            setPhonenumber(evt.target.value);
        }
    }

    return <>
        {successVerification === true ?
            <>
                <div className="ForgetPassword_Wrapper">
                    <div className="ForgetPassword_Content">
                        <div className="ForgetPassword_Form">
                            <div className="ForgetPassword_Left">
                                <img src={LoginLogo} alt="IMPROOKCARE" />
                            </div>
                            <div className="ForgetPassword_Right">
                                <Form className="ForgetPassword_Form">
                                    <div className="ForgetPassword_Detail">
                                        <div className="ForgetPassword_Header">
                                            <div>QUÊN MẬT KHẨU</div>
                                        </div>
                                        <div className="ForgetPassword_Fill">
                                            {/* <div class="ForgetPassword_User">
                                                <div class="ForgetPassword_Warning">
                                                    <div class="ForgetPassword_User_OTP">
                                                        <div class="ForgetPassword_User_Input">
                                                            <input type="text" id="phoneNumberInput" defaultValue={phonenumber} onChange={(e) => validatePhoneNumber(e)} placeholder="Số điện thoại" pattern="[0-9]+" required></input>
                                                        </div>
                                                        {isPhonenumbervalid === true ? <button type="button" class="OTP">Gửi OTP</button> : <button type="button" class="OTP" disabled style={{ color: "gray", cursor: "auto" }}>Gửi OTP</button>}
                                                    </div>
                                                    <p id="errorMsg" style={{ color: 'red', display: 'none' }}>Số điện thoại không hợp lệ</p>
                                                </div>
                                                <div class="Separate"></div>
                                            </div>
                                            <div class="ForgetPassword_User">
                                                <div class="ForgetPassword_User_Input">
                                                    <input type="text" defaultValue={code} onChange={(e) => setCode(e.target.value)} placeholder="Mã OTP" pattern="[0-9]+" required></input>
                                                </div>
                                                <div class="Separate"></div>
                                            </div> */}
                                            <Form onSubmit={verification}>
                                                <InputGroup className="mb-3 ForgetPassword_Warning">
                                                    <div className="ForgetPassword_User_OTP">
                                                        <InputGroup className="ForgetPassword_User_Input">
                                                            <InputGroup.Text><Phone /></InputGroup.Text>
                                                            <Form.Control
                                                                placeholder="Username/Phone"
                                                                aria-label="Username"
                                                                aria-describedby="basic-addon1"
                                                                id="phoneNumberInput"
                                                                defaultValue={phonenumber}
                                                                onChange={(e) => validatePhoneNumber(e)}
                                                                pattern="[0-9]+"
                                                                required
                                                                maxLength={10}
                                                            // className="Input_Phone"
                                                            />
                                                        </InputGroup>
                                                        {isPhonenumbervalid === true ? <button type="button" onClick={OTPSender} className="OTP">Gửi OTP</button> : <button type="button" className="OTP" disabled style={{ color: "gray", cursor: "auto" }}>Gửi OTP</button>}
                                                    </div>
                                                    <p id="errorMsg" style={{ color: 'red', display: 'none' }}>Số điện thoại không hợp lệ</p>
                                                </InputGroup>
                                                <div className="Separate"></div>
                                                <InputGroup className="mb-3">
                                                    <InputGroup.Text><Password /></InputGroup.Text>
                                                    <Form.Control
                                                        placeholder="OTP"
                                                        aria-label="OTP"
                                                        aria-describedby="basic-addon1"
                                                        required
                                                        defaultValue={code}
                                                        onChange={(e) => setCode(e.target.value)}
                                                    />
                                                </InputGroup>
                                                <div className="Separate"></div>
                                                {loading === true ? <Spinner /> : <button type="submit" className="ForgetPassword_Butt">Xác thực</button>}
                                            </Form>
                                            {/* {loading === true ? <Spinner /> : <button type="button" className="ForgetPassword_Butt">Xác thực</button>} */}
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </> :
            <>
                {/* <div class="ForgetPassword_Wrapper">
                    <div class="ForgetPassword_Content">
                        <div class="ForgetPassword_Form">
                            <div class="ForgetPassword_Left">
                                <img src={LoginLogo} alt="IMPROOKCARE" />
                            </div>
                            <div class="ForgetPassword_Right">
                                <Form class="ForgetPassword_Form">
                                    <div class="ForgetPassword_Detail">
                                        <div class="ForgetPassword_Header">
                                            <div>MẬT KHẨU MỚI</div>
                                        </div>
                                        <div class="ForgetPassword_Fill">
                                            <div class="CreatePassword">
                                                <div class="ForgetPassword_UserName">
                                                    <input type="text" value={phonenumber} disabled required></input>
                                                </div>
                                                <div class="Separate"></div>
                                            </div>
                                            <InputGroup className="mb-3">
                                                <InputGroup.Text><Phone /></InputGroup.Text>
                                                <Form.Control
                                                    aria-label="Username"
                                                    aria-describedby="basic-addon1"
                                                    disabled
                                                />
                                            </InputGroup>
                                            <div class="Separate"></div>
                                            <InputGroup className="mb-3">
                                                <InputGroup.Text><Lock /></InputGroup.Text>
                                                <Form.Control
                                                    placeholder="Password"
                                                    aria-label="Password"
                                                    type={showNewPassword ? 'text' : 'password'}
                                                    aria-describedby="basic-addon1"
                                                    required
                                                />
                                                <button type="button" className="Show_Pass" onClick={toggleShowNewPassword}>
                                                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                                </button>
                                            </InputGroup>
                                            <div className="Separate"></div>
                                            <InputGroup className="mb-3">
                                                <InputGroup.Text><Lock /></InputGroup.Text>
                                                <Form.Control
                                                    placeholder="Confirm Password"
                                                    aria-label="Confirm Password"
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    aria-describedby="basic-addon1"
                                                    required
                                                />
                                                <button type="button" className="Show_Pass" onClick={toggleShowConfirmPassword}>
                                                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                                </button>
                                            </InputGroup>
                                            <div class="Separate"></div>
                                            <div class="CreatePassword">
                                                <div class="ForgetPassword_NewPassword">
                                                    <input type={showNewPassword ? 'text' : 'password'} defaultValue={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mật khẩu mới" required></input>
                                                    <button type="button" onClick={toggleShowNewPassword}>
                                                        {showNewPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                                                    </button>
                                                </div>
                                                <div class="Separate"></div>
                                            </div>
                                            <div class="CreatePassword">
                                                <div class="ForgetPassword_ConfirmPassword">
                                                    <input type={showConfirmPassword ? 'text' : 'password'} defaultValue={confirmNewpassword} onChange={(e) => setConfirmNewpassword(e.target.value)} placeholder="Xác nhận mật khẩu mới" required></input>
                                                    <button type="button" onClick={toggleShowConfirmPassword}>
                                                        {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                                                    </button>
                                                </div>
                                                <div class="Separate"></div>
                                            </div>
                                            {loading === true ? <Spinner /> : <button type="button" class="ForgetPassword_Butt">Xác nhận</button>}
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className="NewPassword_Wrapper">
                    <div className="NewPassword_Content">
                        <div className="NewPassword_Form">
                            <div className="NewPassword_Left">
                                <img src={LoginLogo} alt="IMPROOKCARE" />
                            </div>
                            <div className="NewPassword_Right">
                                <Form className="NewPassword_Form" onSubmit={(e) => createNewPassword(e)}>
                                    <div className="NewPassword_Detail">
                                        <div className="NewPassword_Header">
                                            <div>MẬT KHẨU MỚI</div>
                                        </div>
                                        <div className="NewPassword_Fill">
                                            {/* <div class="CreatePassword">
                                                <div class="ForgetPassword_UserName">
                                                    <input type="text" value={phonenumber} disabled required></input>
                                                </div>
                                                <div class="Separate"></div>
                                            </div> */}
                                            <InputGroup className="mb-3">
                                                <InputGroup.Text><Phone /></InputGroup.Text>
                                                <Form.Control
                                                    aria-label="Username"
                                                    aria-describedby="basic-addon1"
                                                    disabled
                                                    value={phonenumber}
                                                />
                                            </InputGroup>
                                            <div className="Separate"></div>
                                            <InputGroup className="mb-3">
                                                <InputGroup.Text><Lock /></InputGroup.Text>
                                                <Form.Control
                                                    placeholder="Password"
                                                    aria-label="Password"
                                                    type={showNewPassword ? 'text' : 'password'}
                                                    aria-describedby="basic-addon1"
                                                    required
                                                    defaultValue={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                />
                                                <button type="button" className="Show_Pass" onClick={toggleShowNewPassword}>
                                                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                                </button>
                                            </InputGroup>
                                            <div className="Separate"></div>
                                            <InputGroup className="mb-3">
                                                <InputGroup.Text><Lock /></InputGroup.Text>
                                                <Form.Control
                                                    placeholder="Confirm Password"
                                                    aria-label="Confirm Password"
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    aria-describedby="basic-addon1"
                                                    required
                                                    defaultValue={confirmNewpassword}
                                                    onChange={(e) => setConfirmNewpassword(e.target.value)}
                                                />
                                                <button type="button" className="Show_Pass" onClick={toggleShowConfirmPassword}>
                                                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                                </button>
                                            </InputGroup>
                                            <div className="Separate"></div>
                                            {/* <div class="CreatePassword">
                                                <div class="ForgetPassword_NewPassword">
                                                    <input type={showNewPassword ? 'text' : 'password'} defaultValue={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mật khẩu mới" required></input>
                                                    <button type="button" onClick={toggleShowNewPassword}>
                                                        {showNewPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                                                    </button>
                                                </div>
                                                <div class="Separate"></div>
                                            </div>
                                            <div class="CreatePassword">
                                                <div class="ForgetPassword_ConfirmPassword">
                                                    <input type={showConfirmPassword ? 'text' : 'password'} defaultValue={confirmNewpassword} onChange={(e) => setConfirmNewpassword(e.target.value)} placeholder="Xác nhận mật khẩu mới" required></input>
                                                    <button type="button" onClick={toggleShowConfirmPassword}>
                                                        {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                                                    </button>
                                                </div>
                                                <div class="Separate"></div>
                                            </div> */}
                                            {loading === true ? <Spinner /> : <button type="submit" className="ForgetPassword_Butt">Xác nhận</button>}
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </>}
    </>
}

export default ForgetPassword;