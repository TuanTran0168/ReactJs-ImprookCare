import { useContext, useState } from "react";
import { FaBell, FaCalendar, FaHistory, FaInfoCircle, FaWallet } from "react-icons/fa";
import { IoIosChatboxes } from "react-icons/io";
import { ImProfile } from "react-icons/im";
import { MdLogout, MdMessage } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import "./UserMenu.css"

const UserMenu = () => {
    const nav = useNavigate();
    const [, dispatch] = useContext(UserContext);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    const logout = () => {
        dispatch({
            "type": "logout"
        })
        nav("/")
    }

    return (
        <div className="UserMenu">
            <div>
                <NavLink
                    activeClassName="active"
                    onClick={() => handleItemClick("personal")}
                    to="personal">
                    <FaInfoCircle className="icon" />
                    <span className="text">Thông tin cá nhân</span>
                </NavLink>
                <NavLink
                    activeClassName="active"
                    onClick={() => handleItemClick("appointment")}
                    to="appointment">
                    <FaCalendar className="icon" />
                    <span className="text">Lịch sử đặt khám</span>
                </NavLink>
                <NavLink
                    activeClassName="active"
                    onClick={() => handleItemClick("history")}
                    to="history">
                    <FaHistory className="icon" />
                    <span className="text">Lịch sử đơn thuốc</span>
                </NavLink>
                <NavLink
                    activeClassName="active"
                    onClick={() => handleItemClick("payment")}
                    to="paymenthistory">
                    <FaWallet className="icon" />
                    <span className="text">Lịch sử thanh toán</span>
                </NavLink>
                <NavLink
                    activeClassName="active"
                    onClick={() => handleItemClick("reminder")}
                    to="reminder">
                    <FaBell className="icon" />
                    <span className="text">Nhắc uống thuốc</span>
                </NavLink>
                <NavLink
                    activeClassName="active"
                    onClick={() => handleItemClick("profile")}
                    to="profile">
                    <ImProfile className="icon" />
                    <span className="text">Hồ sơ</span>
                </NavLink>
                <NavLink
                    activeClassName="active"
                    onClick={() => handleItemClick("message")}
                    to="message">
                    <MdMessage className="icon" />
                    <span className="text">Tin nhắn</span>
                </NavLink>
                <NavLink
                    activeClassName="active"
                    onClick={() => handleItemClick("consultantmessage")}
                    to="consultantchat">
                    <IoIosChatboxes className="icon" />
                    <span className="text">Tư vấn</span>
                </NavLink>
                <div onClick={logout}><MdLogout />Đăng xuất</div>
            </div>
        </div>
    )
}

export default UserMenu;