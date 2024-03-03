import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../App";
import "./Personal.css";
import { Form, Image } from "react-bootstrap";
import { authApi, endpoints } from "../../configs/Apis";
import cookie from "react-cookies";
import { toast } from "react-toastify";
import avatar_user from "../../assets/images/user.png"
import Moment from "react-moment";
import { FaCalendar, FaHistory, FaInfoCircle } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { MdLogout, MdMessage } from "react-icons/md";

const Personal = () => {
    const [current_user, dispatch] = useContext(UserContext);
    const [current_avatar, setCurrent_avatar] = useState(current_user.avatar);
    const [current_birthday, setCurrent_birthday] = useState('');
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

    // const formattedBirthday = (
    //     <Moment locale="vi" format="DD/MM/YYYY">
    //         {current_user.birthday}
    //     </Moment>
    // );

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

    // useEffect(() => {
    //     const formattedDate = new Date(current_user.birthday).toISOString().substring(0, 10);
    //     setCurrent_birthday(formattedDate);
    // }, [current_user.birthday]);


    const updateClick = () => {
        setCheckPersonalInfo(!checkPersonalInfo);
    }

    const updateUser = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                const dateInput = document.getElementById('dateInput');
                const selectedDate = dateInput.value; // Lấy giá trị ngày từ trường input

                const birthDate = new Date(selectedDate).toISOString().split('T')[0]; // Định dạng lại ngày thành "yyyy-MM-dd"

                console.log(birthDate);
                let form = new FormData();
                console.log(user);

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

                form.delete("birthday")
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

                    console.log(current_user.birthday)
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
        <div className="PersonalPage_Wrapper">
            <div className="PersonalPage">
                <div className="PersonalPage_Left">
                    <div className="PersonalPage_Left_Content">
                        <ul>
                            <li><FaInfoCircle /><Link to="/personal">Thông tin cá nhân</Link></li>
                            <li><FaCalendar /><Link to="/appointment">Lịch khám</Link></li>
                            <li><FaHistory /><Link to="/history">Lịch sử khám</Link></li>
                            <li><ImProfile /><Link to="/profile">Hồ sơ</Link></li>
                            <li><MdMessage /><Link to="/message">Tin nhắn</Link></li>
                            <li onClick={logout}><MdLogout />Đăng xuất</li>
                        </ul>
                    </div>
                </div>
                <div className="PersonalPage_Right">
                    {checkPersonalInfo === true ?
                        <>
                            <section>
                                <div className="PersonalPage_Right_Header"><h2 className="text-center text-success">Thông tin cá nhân của {current_user.firstname}</h2></div>
                                <div className="PersonalPage_Right_Content">
                                    <div className="Personal_Avatar">
                                        {current_avatar === null ? <>
                                            <Image className="user_Avatar" src={avatar_user} style={{ width: "20%" }} alt="Not Found" rounded />
                                        </> : <>
                                            <Image className="user_Avatar" src={current_user.avatar} style={{ width: "20%" }} alt="Avatar" rounded />
                                        </>}
                                        <Form.Control className="avatar_input" accept=".jpg, .jpeg, .png, .gif, .bmp" style={{ width: "10%", marginLeft: 'auto', marginRight: 'auto' }} onChange={(e) => updateAvatar(e.target.files)} type="file" ref={avatar} />
                                    </div>
                                    <div className="Personal_LastName">
                                        <Form.Label style={{ width: "30%" }}>Họ và tên đệm</Form.Label>
                                        <Form.Control value={current_user.lastname} type="text" disabled />
                                    </div>
                                    <div className="Personal_FirstName">
                                        <Form.Label style={{ width: "30%" }}>Tên</Form.Label>
                                        <Form.Control value={current_user.firstname} type="text" disabled />
                                    </div>
                                    <div className="Personal_Email">
                                        <Form.Label style={{ width: "30%" }}>Email</Form.Label>
                                        <Form.Control value={current_user.email} type="email" disabled />
                                    </div>
                                    <div className="Personal_Gender">
                                        <Form.Label style={{ width: "30%" }}>Giới tính</Form.Label>
                                        <Form.Control value={current_user.gender === true ? "Nam" : "Nữ"} type="Text" disabled />
                                    </div>
                                    <div className="Personal_Birthday">
                                        <Form.Label style={{ width: "30%" }}>Ngày sinh</Form.Label>
                                        {current_user.birthday === null ? <>
                                            <Form.Control value="Thiết lập ngày sinh" type="Text" disabled />
                                        </> : <>
                                            {/* <Moment locale="vi" format="DD/MM/YYYY">{current_user.birthday}</Moment> */}
                                            <Form.Control value={formattedDateTime} type="Text" disabled />
                                        </>}
                                    </div>
                                    <div className="Change_Button">
                                        <button type="button" onClick={updateClick}>Thay đổi thông tin</button>
                                    </div>
                                </div>
                            </section>
                        </> : <>
                            <section>
                                <div className="PersonalPage_Right_Header"><h2 className="text-center text-success">Thông tin cá nhân của {current_user.firstname}</h2></div>
                                <div className="PersonalPage_Right_Content">
                                    <div className="Personal_Avatar">
                                        <div><Image className="user_Avatar" src={current_user.avatar} style={{ width: "20%" }} alt="Not Found" rounded /></div>
                                        <Form.Control className="avatar_input" accept=".jpg, .jpeg, .png, .gif, .bmp" style={{ width: "10%", marginLeft: 'auto', marginRight: 'auto' }} type="file" ref={avatar} />
                                    </div>
                                    <div className="Personal_LastName">
                                        <Form.Label style={{ width: "30%" }}>Họ và tên đệm</Form.Label>
                                        <Form.Control defaultValue={current_user.lastname} onChange={(e) => change(e, "lastname")} type="text" placeholder="Họ và tên đệm" required />
                                    </div>
                                    <div className="Personal_FirstName">
                                        <Form.Label style={{ width: "30%" }}>Tên</Form.Label>
                                        <Form.Control defaultValue={current_user.firstname} onChange={(e) => change(e, "firstname")} type="text" placeholder="Tên" required />
                                    </div>
                                    <div className="Personal_Email">
                                        <Form.Label style={{ width: "30%" }}>Email</Form.Label>
                                        <Form.Control defaultValue={current_user.email} type="email" placeholder="Email" required />
                                    </div>
                                    <div className="Personal_Gender">
                                        <Form.Label style={{ width: "22%" }}>Giới tính</Form.Label>
                                        <div className="Personal_Gender_Tick">
                                            {current_user.gender === true ? <>
                                                <Form.Check type="radio" label="Nam" name="radioOption" defaultChecked onChange={() => setGender(true)} />
                                                <Form.Check type="radio" label="Nữ" name="radioOption" onChange={() => setGender(false)} />
                                            </> : <>
                                                <Form.Check type="radio" label="Nam" name="radioOption" onChange={() => setGender(true)} />
                                                <Form.Check type="radio" label="Nữ" name="radioOption" defaultChecked onChange={() => setGender(false)} />
                                            </>}
                                        </div>
                                    </div>
                                    <div className="Personal_Birthday">
                                        <Form.Label style={{ width: "22%" }}>Ngày sinh</Form.Label>
                                        <div className="Personal_Birthday_Tick">
                                            <input type="date" defaultValue={formattedDateTime} id="dateInput" />
                                        </div>
                                    </div>
                                    <div className="Update_Button">
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

export default Personal;