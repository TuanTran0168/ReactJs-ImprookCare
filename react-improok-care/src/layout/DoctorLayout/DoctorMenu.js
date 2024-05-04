import { useContext, useState } from "react";
import { FaCalendarCheck, FaInfoCircle, FaCalendarPlus } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { MdEditCalendar, MdLogout, MdMessage } from "react-icons/md";
import { useNavigate, NavLink } from "react-router-dom";
import { UserContext } from "../../App";
import "./DoctorMenu.css";

const DoctorMenu = () => {
    const nav = useNavigate();
    const [, dispatch] = useContext(UserContext);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    const logout = (item) => {
        setSelectedItem(item);
        dispatch({
            type: "logout",
        });
        nav("/");
    };

    return (
        <div className="DoctorMenu">
            <div>
                <NavLink
                    activeClassName="active"
                    onClick={() => handleItemClick("doctorinformation", "/doctorinformation")}
                    to="doctorinformation"
                >
                    <FaInfoCircle className="icon" />
                    <span className="text">Thông tin cá nhân</span>
                </NavLink>
                <NavLink
                    activeClassName="active"
                    onClick={() => handleItemClick("schedule", "/schedule")}
                    to="schedule"
                >
                    <MdEditCalendar className="icon" />
                    <span className="text">Đăng ký lịch khám</span>
                </NavLink>
                <NavLink
                    activeClassName="active"
                    onClick={() => handleItemClick("customschedule", "/customschedule")}
                    to="customschedule"
                >
                    <FaCalendarPlus className="icon" />
                    <span className="text">Lịch khám tùy chỉnh</span>
                </NavLink>
                <NavLink
                    activeClassName="active"
                    onClick={() => handleItemClick("bookingmanagement", "/bookingmanagement")}
                    to="bookingmanagement"
                >
                    <FaCalendarCheck className="icon" />
                    <span className="text">Lịch hẹn</span>
                </NavLink>
                <NavLink
                    activeClassName="active"
                    onClick={() => handleItemClick("profiledoctor", "/profiledoctor")}
                    to="profiledoctor"
                >
                    <ImProfile className="icon" />
                    <span className="text">Hồ sơ</span>
                </NavLink>
                <NavLink
                    activeClassName="active"
                    onClick={() => handleItemClick("doctormessage", "/doctormessage")}
                    to="doctormessage"
                >
                    <MdMessage className="icon" />
                    <span className="text">Tin nhắn</span>
                </NavLink>
                {/* <NavLink
                    activeClassName="active"
                    onClick={() => handleItemClick("videocall", "/videocall")}
                    to="videocall"
                >
                    <FaVideo className="icon" />
                    <span className="text">Cuộc họp</span>
                </NavLink> */}
                {/* <NavLink
                    activeClassName="active"
                    onClick={() => handleItemClick("zego", "/zego")}
                    to="zego"
                >
                    <FaVideo className="icon" />
                    <span className="text">Zego</span>
                </NavLink> */}
                <div onClick={logout}><MdLogout />Đăng xuất</div>
            </div>
        </div>
    );
};

export default DoctorMenu;