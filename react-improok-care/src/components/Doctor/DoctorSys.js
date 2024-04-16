import { useContext, useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import "./Doctor.css";
import { Form, Image } from "react-bootstrap";
import { authApi, endpoints } from "../../configs/Apis";
import cookie from "react-cookies";
import { toast } from "react-toastify";
import avatar_user from "../../assets/images/user.png"
import Moment from "react-moment";
import DoctorMenu from "../../layout/DoctorLayout/DoctorMenu";

const Doctor = () => {
    const [current_user, dispatch] = useContext(UserContext);
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
            if (current_user !== null && current_user?.roleId.roleId !== 2) {
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

    const [current_avatar, setCurrent_avatar] = useState(current_user?.avatar);
    const [current_birthday, setCurrent_birthday] = useState(current_user?.birthday);
    const [birthday, setBirthday] = useState(null)
    const [gender, setGender] = useState(null)
    const avatar = useRef();
    const nav = useNavigate();
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState({
        "firstname": current_user?.firstname,
        "lastname": current_user?.lastname,
        "userId": current_user?.userId,
        "birthday": current_user?.birthday,
        "gender": current_user?.gender,
        "avatar": current_user?.avatar
    })
    const [checkPersonalInfo, setCheckPersonalInfo] = useState(true)
    const formattedBirthday = (
        <Moment locale="vi" format="DD/MM/YYYY">
            {current_user?.birthday}
        </Moment>
    );

    const formattedDate = new Date(current_user?.birthday);
    formattedDate.setHours(formattedDate.getHours() + 7);
    const formattedDateTime = formattedDate.toISOString().substring(0, 10);
    // console.log(typeof (current_birthday))
    // console.log(typeof (current_user.birthday))
    // const formattedDate = current_user.birthDate.toISOString();
    // const formattedDate = new Date(current_birthday).toISOString();

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
        <div className="Doctor_Wrapper">
            <div className="Doctor">
                <div className="Doctor_Left">
                    <div className="Doctor_Left_Content">
                        <DoctorMenu />
                    </div>
                </div>
                <div className="Doctor_Right">
                    <Outlet />
                </div>
            </div>
        </div>
    </>
}

export default Doctor;