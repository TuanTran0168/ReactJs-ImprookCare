import { useContext, useState } from "react";
import { TbTestPipe } from "react-icons/tb";
import { MdLogout } from "react-icons/md";
import { useNavigate, NavLink } from "react-router-dom";
import { UserContext } from "../../App";
import "./NurseMenu.css";

const NurseMenu = () => {
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
        <div className="NurseMenu">
            <div>
                <NavLink
                    activeClassName="active"
                    onClick={() => handleItemClick("medicaltest")}
                    to="medicaltest"
                >
                    <TbTestPipe className="icon" />
                    <span className="text">Thông tin xét nghiệm</span>
                </NavLink>
                <div onClick={logout}><MdLogout />Đăng xuất</div>
            </div>
        </div>
    );
};

export default NurseMenu;