import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import './Examination.css'

const Examination = () => {
    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    return (
        <>
            <div className="examination_wrapper">
                <div className="examination">
                    <div className="examination_menu">
                        <div>
                            <NavLink
                                activeClassName="active"
                                onClick={() => handleItemClick("prescription")}
                                to="prescription">
                                <span className="text">Tạo đơn thuốc</span>
                            </NavLink>
                            <NavLink
                                activeClassName="active"
                                onClick={() => handleItemClick("prescriptionhistory")}
                                to="prescriptionhistory">
                                <span className="text">Lịch sử đơn thuốc</span>
                            </NavLink>
                            <NavLink
                                activeClassName="active"
                                onClick={() => handleItemClick("testservice")}
                                to="testservice">
                                <span className="text">Xét nghiệm</span>
                            </NavLink>
                            <NavLink
                                activeClassName="active"
                                onClick={() => handleItemClick("reexamination")}
                                to="reexamination">
                                <span className="text">Tái khám</span>
                            </NavLink>
                        </div>
                    </div>
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default Examination;