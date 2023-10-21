import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MyUserContext } from "../../App";
import "../../styles/Doctor.css";
import { Form, Image } from "react-bootstrap";
import { authApi, endpoints } from "../../configs/Apis";
import cookie from "react-cookies";
import { toast } from "react-toastify";
import avatar_user from "../../assests/images/user.png"
import Moment from "react-moment";

const Doctor = () => {
    const [current_user, dispatch] = useContext(MyUserContext);
    var isDoctor = 0;
    var isLogin = 0;

    const checkLogin = (current_user) => {
        if (isLogin === 0) {
            if (current_user === null) {
                toast("Vui lòng đăng nhập!");
                isLogin = 1;
                nav('/login');
            }
        }
    }

    const doctorAuth = (current_user) => {
        if (isDoctor === 0) {
            if (current_user !== null && current_user.roleId.roleId !== 2) {
                toast.error("Bạn không có quyền truy cập!")
                isDoctor = 1;
                nav('/');
            }
        }
    }

    useEffect(() => {
        checkLogin(current_user)
        doctorAuth(current_user)
    }, [current_user])

    const [current_avatar, setCurrent_avatar] = useState(current_user.avatar);
    const [current_birthday, setCurrent_birthday] = useState(current_user.birthday);
    const [birthday, setBirthday] = useState(null)
    const [gender, setGender] = useState(null)
    const avatar = useRef();
    const nav = useNavigate();
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState({
        "firstname": current_user.firstname,
        "lastname": current_user.lastname,
        "userId": current_user.userId,
        "birthday": current_user.birthday,
        "gender": current_user.gender,
        "avatar": current_user.avatar
    })
    const [checkPersonalInfo, setCheckPersonalInfo] = useState(true)
    const formattedBirthday = (
        <Moment locale="vi" format="DD/MM/YYYY">
            {current_user.birthday}
        </Moment>
    );

    const formattedDate = new Date(current_user.birthday);
    formattedDate.setHours(formattedDate.getHours() + 7);
    const formattedDateTime = formattedDate.toISOString().substring(0, 10);
    // console.log(typeof (current_birthday))
    // console.log(typeof (current_user.birthday))
    // const formattedDate = current_user.birthDate.toISOString();
    // const formattedDate = new Date(current_birthday).toISOString();

    const logout = () => {
        dispatch({
            "type": "logout"
        })
        nav("/")
    }

    const updateClick = () => {
        setCheckPersonalInfo(!checkPersonalInfo);
    }

    const updateUser = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                let form = new FormData();

                console.log(user);
                const dateInput = document.getElementById('dateInput');
                const selectedDate = dateInput.value; // Lấy giá trị ngày từ trường input

                const birthDate = new Date(selectedDate).toISOString().split('T')[0];

                for (let field in user) {
                    if (field !== "avatar" || field !== "gender" || field !== "birthday")
                        form.append(field, user[field]);
                }

                if (avatar.current.files[0] !== undefined) {
                    form.append("avatar", avatar.current.files[0]);
                } else {
                    form.append("avatar", new Blob());
                }

                form.delete("gender");
                if (gender === false) {
                    form.append("gender", false)
                } else {
                    form.append("gender", true)
                }

                form.delete("birthday");
                form.append("birthday", birthDate);

                setLoading(true);

                try {
                    console.log(user);
                    let { data } = await authApi().post(endpoints['update-user'], form, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });

                    let update_User = await authApi().get(endpoints['current-user'])
                    cookie.save('user', update_User.data);

                    console.log(update_User.data);
                    dispatch({
                        "type": "login",
                        "payload": update_User.data
                    });

                    toast.success("Cập nhật thành công!")

                    setUser(update_User.data);
                    setLoading(false);
                } catch (err) {
                    // if (err.request.responeText === "Cập nhật thành công!")
                    //     setErr("Cập nhật thành công");
                    // else if (err.request.responeText === "Số điện thoại đã được đăng ký!")
                    //     setErr("Số điện thoại đã được đăng ký!");
                    // else if (err.request.responeText === "Email đã được đăng ký!")
                    //     setErr("Email đã được đăng ký!");
                    // else
                    //     setErr("Có lỗi xảy ra!")
                    toast.error(err.request.responseText);
                    // console.log(err.request.status);
                    setLoading(false);
                }
                setCheckPersonalInfo(!checkPersonalInfo);
            } catch (ex) {
                console.log(ex)
            }
        }
        process();
    }

    const updateAvatar = (avatar) => {
        console.log(avatar[0]);
        setCurrent_avatar(avatar[0]);
    }

    // const updateBirthDate = (birthday) => {
    //     setBirthday(formattedDate)
    // }

    const change = (evt, field) => {
        // setUser({...user, [field]: evt.target.value})
        setUser(current => {
            return { ...current, [field]: evt.target.value }
        })
    }

    // const birthDateChange = (evt, field) => {
    //     setUser(current => {
    //         return { ...current, [field]: evt.target.value }
    //     }
    // };

    // console.log(current_user)

    return <>
        <div class="Doctor_Wrapper">
            <div class="Doctor">
                <div class="Doctor_Left">
                    <div class="Doctor_Left_Content">
                        <ul>
                            <li><Link to="/doctor">Thông tin cá nhân</Link></li>
                            {/* <li><Link to="/changepassword">Đổi mật khẩu</Link></li> */}
                            <li><Link to="/schedule">Đăng ký lịch khám</Link></li>
                            <li><Link to="/bookingmanagement">Lịch hẹn</Link></li>
                            <li><Link to="/profiledoctor">Hồ sơ</Link></li>
                            <li><Link to="/doctormessage">Tin nhắn</Link></li>
                            <li onClick={logout}>Đăng xuất</li>
                        </ul>
                    </div>
                </div>
                <div class="Doctor_Right">
                    {checkPersonalInfo === true ?
                        <>
                            <section>
                                <div class="Doctor_Right_Header"><h2 className="text-center text-success">Thông tin cá nhân của {current_user.firstname}</h2></div>
                                <div class="Doctor_Right_Content">
                                    <div class="Doctor_Avatar">
                                        {current_avatar === null ? <>
                                            <div><Image class="user_Avatar" src={avatar_user} style={{ width: "30%" }} alt="Not Found" rounded /></div>
                                        </> : <>
                                            <div><Image class="user_Avatar" src={current_user.avatar} style={{ width: "35%" }} alt="Not Found" rounded /></div>
                                        </>}
                                        <Form.Control className="avatar_input" accept=".jpg, .jpeg, .png, .gif, .bmp" style={{ width: "10%", marginLeft: 'auto', marginRight: 'auto' }} onChange={(e) => updateAvatar(e.target.files)} type="file" ref={avatar} />
                                    </div>
                                    <div class="Doctor_LastName">
                                        <Form.Label style={{ width: "30%" }}>Họ và tên đệm</Form.Label>
                                        <Form.Control value={current_user.lastname} type="text" disabled />
                                    </div>
                                    <div class="Doctor_FirstName">
                                        <Form.Label style={{ width: "30%" }}>Tên</Form.Label>
                                        <Form.Control value={current_user.firstname} type="text" disabled />
                                    </div>
                                    <div class="Doctor_Email">
                                        <Form.Label style={{ width: "30%" }}>Email</Form.Label>
                                        <Form.Control value={current_user.email} type="email" disabled />
                                    </div>
                                    <div class="Doctor_Gender">
                                        <Form.Label style={{ width: "30%" }}>Giới tính</Form.Label>
                                        <Form.Control value={current_user.gender === true ? "Nam" : "Nữ"} type="Text" disabled />
                                    </div>
                                    <div class="Doctor_Birthday">
                                        <Form.Label style={{ width: "30%" }}>Ngày sinh</Form.Label>
                                        {current_user.birthday === null ? <>
                                            <Form.Control value="Thiết lập ngày sinh" type="Text" disabled />
                                        </> : <>
                                            <Form.Control value={formattedDateTime} type="Text" disabled />
                                        </>}
                                    </div>
                                    <div class="Change_Button">
                                        <button type="button" onClick={updateClick}>Thay đổi thông tin</button>
                                    </div>
                                </div>
                            </section>
                        </> : <>
                            <section>
                                <div class="Doctor_Right_Header"><h2 className="text-center text-success">Thông tin cá nhân của {current_user.firstname}</h2></div>
                                <div class="Doctor_Right_Content">
                                    <div class="Doctor_Avatar">
                                        <div><Image class="user_Avatar" src={current_user.avatar} style={{ width: "35%" }} alt="Not Found" rounded /></div>
                                        <Form.Control className="avatar_input" accept=".jpg, .jpeg, .png, .gif, .bmp" style={{ width: "10%", marginLeft: 'auto', marginRight: 'auto' }} type="file" ref={avatar} />
                                    </div>
                                    <div class="Doctor_LastName">
                                        <Form.Label style={{ width: "30%" }}>Họ và tên đệm</Form.Label>
                                        <Form.Control defaultValue={current_user.lastname} onChange={(e) => change(e, "lastname")} type="text" placeholder="Họ và tên đệm" required />
                                    </div>
                                    <div class="Doctor_FirstName">
                                        <Form.Label style={{ width: "30%" }}>Tên</Form.Label>
                                        <Form.Control defaultValue={current_user.firstname} onChange={(e) => change(e, "firstname")} type="text" placeholder="Tên" required />
                                    </div>
                                    <div class="Doctor_Email">
                                        <Form.Label style={{ width: "30%" }}>Email</Form.Label>
                                        <Form.Control defaultValue={current_user.email} type="email" placeholder="Email" required />
                                    </div>
                                    <div class="Doctor_Gender">
                                        <Form.Label style={{ width: "22%" }}>Giới tính</Form.Label>
                                        <div class="Doctor_Gender_Tick">
                                            {current_user.gender === true ? <>
                                                <Form.Check type="radio" label="Nam" name="radioOption" defaultChecked onChange={() => setGender(true)} />
                                                <Form.Check type="radio" label="Nữ" name="radioOption" onChange={() => setGender(false)} />
                                            </> : <>
                                                <Form.Check type="radio" label="Nam" name="radioOption" onChange={() => setGender(true)} />
                                                <Form.Check type="radio" label="Nữ" name="radioOption" defaultChecked onChange={() => setGender(false)} />
                                            </>}
                                        </div>
                                    </div>
                                    <div className="Doctor_Birthday">
                                        <Form.Label style={{ width: "22%" }}>Ngày sinh</Form.Label>
                                        <div className="Doctor_Birthday_Tick">
                                            <input
                                                type="date" defaultValue={formattedDateTime} id="dateInput"
                                            />
                                        </div>
                                    </div>
                                    <div class="Update_Button">
                                        <button type="button" onClick={updateClick}>Hủy</button>
                                        <button type="button" onClick={updateUser}>Cập nhật thông tin</button>
                                    </div>
                                </div>
                            </section>
                        </>}
                </div>
            </div>
        </div>
    </>
}

export default Doctor;