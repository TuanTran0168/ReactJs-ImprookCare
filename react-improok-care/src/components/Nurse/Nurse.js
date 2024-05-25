import { useContext, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { UserContext } from "../../App";
import "./Nurse.css";
import { toast } from "react-toastify";
import NurseMenu from "../../layout/NurseLayout/NurseMenu";
import cookie from "react-cookies";
import { reConnectNotification } from "../../utils/WebSocket";
import Swal from "sweetalert2";

const Nurse = () => {
    const [current_user,] = useContext(UserContext);
    var isNurse = 0;
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

    const nurseAuth = (current_user) => {
        if (isNurse === 0) {
            if (current_user !== null && current_user?.roleId.roleId !== 4) {
                Swal.fire(
                    'Thất bại', "Bạn không có quyền truy cập!", 'error'
                );
                isNurse = 1;
                nav('/');
            }
        }
    }

    useEffect(() => {
        checkLogin(current_user)
        nurseAuth(current_user)
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
        <div className="Nurse_Wrapper">
            <div className="Nurse">
                <div className="Nurse_Left">
                    <div className="Nurse_Left_Content">
                        <NurseMenu />
                    </div>
                </div>
                <div className="Nurse_Right">
                    <Outlet />
                </div>
            </div>
        </div>
    </>
}

export default Nurse;