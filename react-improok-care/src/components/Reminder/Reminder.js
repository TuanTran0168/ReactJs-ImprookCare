import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import './Reminder.css'

const Reminder = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const nav = useNavigate()

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    useEffect(() => {
        nav('/user/reminder/prescriptionreminder')
    }, [])

    return (
        <>
            <div className="reminder_wrapper">
                <div className="reminder">
                    <div className="reminder_menu">
                        <div>
                            <NavLink
                                activeClassName="active"
                                onClick={() => handleItemClick("prescriptionreminder")}
                                to="prescriptionreminder">
                                <span className="text">Từ đơn thuốc</span>
                            </NavLink>
                            <NavLink
                                activeClassName="active"
                                onClick={() => handleItemClick("customreminder")}
                                to="customreminder">
                                <span className="text">Tùy chỉnh</span>
                            </NavLink>
                        </div>
                    </div>
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default Reminder;