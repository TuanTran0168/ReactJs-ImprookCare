import "../styles/PhoneVerification.css"
import { FaFacebook, FaGoogle } from "react-icons/fa";
// import logo from "../assests/images/improokcare-logo.png"
import logo from "../assests/images/tech-health-care.png"
import { useContext, useState } from "react";
import { Form } from "react-bootstrap"
import Apis, { endpoints } from "../configs/Apis";
import { Navigate, useNavigate, Link } from "react-router-dom"
import MySpinner from "../layout/MySpinner";
import { MyUserContext } from "../App";
import { toast } from "react-toastify";
import cookie from "react-cookies"

const PhoneVerification = () => {
    const [user,] = useContext(MyUserContext)
    const [err, setErr] = useState(null);
    const [code, setCode] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [check, setCheck] = useState(false)
    const [isPhonenumbervalid, setIsPhoneNumberValid] = useState(false)
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
                let resVerification = await Apis.post(endpoints['verification'], {
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
        <div class="PhoneVerification_Wrapper">
            <div class="PhoneVerification_Content">
                <div class="PhoneVerification_Form">
                    <div class="PhoneVerification_Left">
                        <img src={logo} alt="IMPROOKCARE" />
                    </div>
                    <div class="PhoneVerification_Right">
                        <Form class="PhoneVerification_Form">
                            <div class="PhoneVerification_Form">
                                <div class="PhoneVerification_Detail">
                                    <div class="PhoneVerification_Header">
                                        <div>
                                            <div>XÁC THỰC NGƯỜI DÙNG</div>
                                        </div>
                                    </div>
                                    <div class="PhoneVerification_Fill">
                                        <div class="PhoneVerification_User">
                                            <div class="PhoneVerification_Warning">
                                                <div class="PhoneVerification_User_OTP">
                                                    <div class="PhoneVerification_User_Input">
                                                        <input type="text" id="phoneNumberInput" defaultValue={phonenumber} onChange={(e) => validatePhoneNumber(e)} placeholder="Số điện thoại" pattern="[0-9]+" required></input>
                                                    </div>
                                                    {isPhonenumbervalid === true ? <button type="button" class="OTP" onClick={OTPSender}>Gửi OTP</button> : <button type="button" class="OTP" disabled style={{ color: "gray", cursor: "auto" }}>Gửi OTP</button>}
                                                </div>
                                                <p id="errorMsg" style={{ color: 'red', display: 'none' }}>Số điện thoại không hợp lệ</p>
                                            </div>
                                            <div class="Separate"></div>
                                        </div>
                                        <div class="PhoneVerification_User">
                                            <div class="PhoneVerification_User_Input">
                                                <input type="text" defaultValue={code} onChange={(e) => setCode(e.target.value)} placeholder="Mã OTP" pattern="[0-9]+" required></input>
                                            </div>
                                            <div class="Separate"></div>
                                        </div>
                                        <div class="PhoneVerification_User">
                                            <div class="PhoneVerification_User_PolicyCheck">
                                                <span><input type="checkbox" onChange={handleCheck} /> Tôi đã đọc và đồng ý với
                                                    các điều khoản và điều kiện sử dụng</span>
                                            </div>
                                            <div class="Separate"></div>
                                        </div>
                                        {/* <button type="button" class="PhoneVerification_Butt" onClick={toRegister}>Register</button> */}
                                        {/* <button class="PhoneVerification_Butt">Đăng ký</button> */}
                                        {loading === true ? <MySpinner /> : <button type="button" class="PhoneVerification_Butt" onClick={verification}>Xác thực</button>}
                                        <div class="PhoneVerification_Option">
                                            <div class="PhoneVerification_Or">
                                                <div></div>
                                                <span>Hoặc</span>
                                                <div></div>
                                            </div>
                                            <div class="PhoneVerification_Another">
                                                <button><FaGoogle /> Google</button>
                                                <button><FaFacebook /> Facebook</button>
                                            </div>
                                        </div>
                                        <div class="PhoneVerification_Policy">
                                            <div>
                                                Bằng việc đăng kí, bạn đã đồng ý với Spring Care về
                                                <Link to="/"> Điều khoản dịch vụ </Link>
                                                &
                                                <Link to="/"> Chính sách bảo mật</Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="To_Login">
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