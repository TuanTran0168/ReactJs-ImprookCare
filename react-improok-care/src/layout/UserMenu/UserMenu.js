import { useContext, useState } from "react";
import { FaCalendar, FaHistory, FaInfoCircle } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { MdLogout, MdMessage } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import "./UserMenu.css"

const UserMenu = () => {
    const nav = useNavigate();
    const [, dispatch] = useContext(UserContext);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = (item, path) => {
        setSelectedItem(item);
        nav(path);
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
                    onClick={() => handleItemClick("personal", "/personal")}
                    to="/personal">
                    <FaInfoCircle className="icon" />
                    <span className="text">Thông tin cá nhân</span>
                </NavLink>
                <NavLink
                    activeClassName="active"
                    onClick={() => handleItemClick("appointment", "/appointment")}
                    to="/appointment">
                    <FaCalendar className="icon" />
                    <span className="text">Lịch khám</span>
                </NavLink>
                <NavLink
                    activeClassName="active"
                    onClick={() => handleItemClick("history", "/history")}
                    to="/history">
                    <FaHistory className="icon" />
                    <span className="text">Lịch sử khám</span>
                </NavLink>
                <NavLink
                    activeClassName="active"
                    onClick={() => handleItemClick("profile", "/profile")}
                    to="/profile">
                    <ImProfile className="icon" />
                    <span className="text">Hồ sơ</span>
                </NavLink>
                <NavLink
                    activeClassName="active"
                    onClick={() => handleItemClick("message", "/message")}
                    to="/message">
                    <MdMessage className="icon" />
                    <span className="text">Tin nhắn</span>
                </NavLink>
                <div onClick={logout}><MdLogout />Đăng xuất</div>
            </div>
        </div>
    )
}

export default UserMenu;