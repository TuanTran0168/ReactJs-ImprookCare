import "./PhoneVerification.css"
// import { FaFacebook, FaGoogle } from "react-icons/fa";
// import logo from "../assests/images/improokcare-logo.png"
import Logo from "../../assets/images/login-banner.png"
import { useContext, useState } from "react";
import { Form, InputGroup } from "react-bootstrap"
import Apis, { endpoints } from "../../configs/Apis";
import { Navigate, useNavigate, Link } from "react-router-dom"
import Spinner from "../../layout/Spinner";
import { UserContext } from "../../App";
import { toast } from "react-toastify";
import cookie from "react-cookies"
import { Facebook, Google, Password, Phone } from "@mui/icons-material";

const PhoneVerification = () => {
    const [user,] = useContext(UserContext)
    const [err, setErr] = useState(null);
    const [code, setCode] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [check, setCheck] = useState(false)
    const [isPhonenumbervalid, setIsPhoneNumberValid] = useState(false)
    const nav = useNavigate();

    const [verificationInfo, setVerificationInfo] = useState(null)

    // const handleCodeChange = (evt) => {
    //     setCode(evt.target.value);
    // };

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
                let resVerification = await Apis.post(endpoints['verification'], {
                    "phonenumber": phonenumber
                })
                // let resVerification = await Apis.get(endpoints['verification'], form)
                console.log(resVerification.status);
                setLoading(false);

            } catch (error) {
                console.log(error);
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

    const verification = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                setLoading(true)
                if (code === '') {
                    toast.warning("Vui lòng nhập OTP");
                    setLoading(false);
                } else if (check === false) {
                    toast.warning("Vui lòng đồng ý với điều khoản dịch vụ");
                    setLoading(false);
                }

                console.log("code" + code)
                console.log("phonenumber" + phonenumber)

                let res = await Apis.post(endpoints['verification-check'], {
                    "code": code,
                    "phonenumber": phonenumber
                })

                cookie.save("phonenumber", phonenumber);
                console.log(res.data);

                setLoading(false);
                nav('/register');
            } catch (error) {
                console.log(error);
            }
        }
        process();
    }

    // const toRegister = () => {
    //     // const phonenumber1 = "01236547896";
    //     // <Register username={phonenumber1} />
    //     setPhonenumber(phonenumber);
    //     cookie.save("phonenumber", phonenumber)
    //     nav('/register')
    // }

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

    // const phonenumber1 = "01236547896";
    // <Register username={phonenumber1} />

    if (user !== null)
        return <Navigate to="/" />

    return (<>
        <div className="PhoneVerification_Wrapper">
            <div className="PhoneVerification_Content">
                <div className="PhoneVerification_Form">
                    <div className="PhoneVerification_Left">
                        <img src={Logo} alt="IMPROOKCARE" />
                    </div>
                    <div className="PhoneVerification_Right">
                        <Form className="PhoneVerification_Form">
                            <div className="PhoneVerification_Form">
                                <div className="PhoneVerification_Detail">
                                    <div className="PhoneVerification_Header">
                                        <div>XÁC THỰC SỐ ĐIỆN THOẠI</div>
                                    </div>
                                    <div className="PhoneVerification_Fill">
                                        {/* <div className="PhoneVerification_User">
                                            <div className="PhoneVerification_Warning">
                                                <div className="PhoneVerification_User_OTP">
                                                    <div className="PhoneVerification_User_Input">
                                                        <input type="text" id="phoneNumberInput" defaultValue={phonenumber} onChange={(e) => validatePhoneNumber(e)} placeholder="Số điện thoại" pattern="[0-9]+" required></input>
                                                    </div>
                                                    {isPhonenumbervalid === true ? <button type="button" className="OTP" onClick={OTPSender}>Gửi OTP</button> : <button type="button" className="OTP" disabled style={{ color: "gray", cursor: "auto" }}>Gửi OTP</button>}
                                                </div>
                                                <p id="errorMsg" style={{ color: 'red', display: 'none' }}>Số điện thoại không hợp lệ</p>
                                            </div>
                                            <div className="Separate"></div>
                                        </div>
                                        <div className="PhoneVerification_User">
                                            <div className="PhoneVerification_User_Input">
                                                <input type="text" defaultValue={code} onChange={(e) => setCode(e.target.value)} placeholder="Mã OTP" pattern="[0-9]+" required></input>
                                            </div>
                                            <div className="Separate"></div>
                                        </div>
                                        <div className="PhoneVerification_User">
                                            <div className="PhoneVerification_User_PolicyCheck">
                                                <span><input type="checkbox" onChange={handleCheck} /> Tôi đã đọc và đồng ý với
                                                    các điều khoản và điều kiện sử dụng</span>
                                            </div>
                                            <div className="Separate"></div>
                                        </div> */}
                                        {/* <button type="button" className="PhoneVerification_Butt" onClick={toRegister}>Register</button>
                                        <button className="PhoneVerification_Butt">Đăng ký</button> */}
                                        {/* {loading === true ? <Spinner /> : <button type="button" className="PhoneVerification_Butt" onClick={verification}>Xác thực</button>} */}
                                        <Form onSubmit={verification}>
                                            <InputGroup className="mb-3 PhoneVerification_Warning">
                                                <div className="PhoneVerification_User_OTP">
                                                    <InputGroup className="PhoneVerification_User_Input">
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
                                                    onChange={(e) => setCode(e.target.value)} />
                                            </InputGroup>
                                            <div className="PhoneVerification_User">
                                                <div className="PhoneVerification_User_PolicyCheck">
                                                    <span><input type="checkbox" onChange={handleCheck} /> Tôi đã đọc và đồng ý với
                                                        các điều khoản và điều kiện sử dụng</span>
                                                </div>
                                            </div>
                                            <div className="Separate"></div>
                                            {loading === true ? <Spinner /> : <button type="submit" className="PhoneVerification_Butt">Xác thực</button>}
                                        </Form>
                                        <div className="Separate"></div>
                                        <div className="PhoneVerification_Option">
                                            <div className="PhoneVerification_Or">
                                                <div></div>
                                                <span>Or</span>
                                                <div></div>
                                            </div>
                                            <div className="PhoneVerification_Another">
                                                <button><Google /> Google</button>
                                                <button><Facebook /> Facebook</button>
                                            </div>
                                        </div>
                                        <div className="PhoneVerification_Policy">
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
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default PhoneVerification;