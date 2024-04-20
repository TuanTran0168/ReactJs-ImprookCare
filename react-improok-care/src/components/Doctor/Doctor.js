import { useContext, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { UserContext } from "../../App";
import "./Doctor.css";
import { toast } from "react-toastify";
import DoctorMenu from "../../layout/DoctorLayout/DoctorMenu";

const Doctor = () => {
    const [current_user,] = useContext(UserContext);
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

    const nav = useNavigate();

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