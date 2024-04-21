import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./User.css";
import UserMenu from "../../layout/UserMenu/UserMenu";
import { UserContext } from "../../App";
import { reConnectNotification } from "../../utils/WebSocket";
import cookie from "react-cookies";

const User = () => {
    const [current_user,] = useContext(UserContext);
    useEffect(() => {
        let client = cookie.load("socket")
        console.log("Client", client?.connected);
        if (current_user && client) {
            cookie.remove("socket");
            reConnectNotification(false, current_user?.userId);
        }
    }, [])
    return <>
        <div className="User_Wrapper">
            <div className="User">
                <div className="User_Left">
                    <div className="User_Left_Content">
                        <UserMenu />
                    </div>
                </div>
                <div className="User_Right">
                    <Outlet />
                </div>
            </div>
        </div>
    </>
}

export default User;