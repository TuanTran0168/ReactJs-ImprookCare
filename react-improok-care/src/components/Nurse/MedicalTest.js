import { useContext, useEffect, useState } from "react";
import "./MedicalTest.css"
import medicaltest from "../../assets/images/medical-test.png"
import { UserContext } from "../../App";
import { authApi, endpoints } from "../../configs/Apis";
import { NavLink, Outlet } from "react-router-dom";

const MedicalTest = () => {
    const [current_user,] = useContext(UserContext)
    const [testList, setTestList] = useState([])

    useEffect(() => {
        const loadtestList = async () => {
            try {
                let res = await authApi().get(endpoints['load-test-result'])
                console.log(res.data.content)
                setTestList(res.data.content)
            } catch (error) {
                console.log(error)
            }
        }
        loadtestList()
    }, [])

    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    return (
        <>
            <div className="medical-test-wrapper">
                <div className="medical-test">
                    <div className="medical-test-list">
                        {testList.length === 0 ? <>
                            <h3>Danh sách xét nghiệm</h3>
                            <div className="medical-test-list-null">
                                <h5 className="mb-4">Chưa có yêu cầu xét nghiệm nào</h5>
                                <img src={medicaltest} alt="Not found" width={'20%'} />
                            </div>
                        </>
                            :
                            <>
                                <div className="medical-test-menu">
                                    <div>
                                        <NavLink
                                            activeClassName="active"
                                            onClick={() => handleItemClick("unchecked")}
                                            to="unchecked">
                                            <span className="text">Chờ xét nghiệm</span>
                                        </NavLink>
                                        <NavLink
                                            activeClassName="active"
                                            onClick={() => handleItemClick("checked")}
                                            to="checked">
                                            <span className="text">Đã xét nghiệm</span>
                                        </NavLink>
                                    </div>
                                </div>
                                <Outlet />
                            </>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default MedicalTest;