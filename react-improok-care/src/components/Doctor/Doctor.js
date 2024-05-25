import { useContext, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { UserContext } from "../../App";
import "./Doctor.css";
import { toast } from "react-toastify";
import DoctorMenu from "../../layout/DoctorLayout/DoctorMenu";
import cookie from "react-cookies";
import { reConnectNotification } from "../../utils/WebSocket";
import Swal from "sweetalert2";

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
                Swal.fire(
                    'Thất bại', "Bạn chưa có quyền truy cập!", 'error'
                );
                isDoctor = 1;
                nav('/');
            }
        }
    }

    useEffect(() => {
        checkLogin(current_user)
        doctorAuth(current_user)
    }, [current_user])

    useEffect(() => {
        let client = cookie.load("socket")
        console.log("Client", client?.connected);
        if (current_user && client) {
            cookie.remove("socket");
            reConnectNotification(false, current_user?.userId);
        }
    }, [])

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