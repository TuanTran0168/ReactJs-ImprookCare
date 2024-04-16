import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";
import "./BookingManagement.css";
import Apis, { endpoints } from "../../configs/Apis";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import DoctorMenu from "../../layout/DoctorLayout/DoctorMenu";
import NewBooking from "./NewBooking";
import DeclineBooking from "./DeclineBooking";
import AcceptBooking from "./AcceptBooking";

const BookingManagement = () => {
    const [current_user,] = useContext(UserContext);
    const [profileDoctorByUserId, setProfileDoctorByUserId] = useState([]);
    const [selectedProfileDoctorId, setSelectedProfileDoctorId] = useState("");
    const [minDate, setMinDate] = useState('');
    const nav = useNavigate();
    const [selectedOption, setSelectedOption] = useState('new');

    const [bookingPrice, setBookingPrice] = useState('');
    const [selectedDoctorName, setSelectedDoctorName] = useState('');

    useEffect(() => {
        const loadProfileDoctorByUserId = async () => {
            try {
                let res = await Apis.get(endpoints['load-profile-doctor-by-userId'](current_user.userId));
                setProfileDoctorByUserId(res.data);
                console.log(res.data.length)
                if (res.data === 0) {
                    toast.info("Vui lòng tạo hồ sơ!");
                    nav('/profiledoctor');
                }
                if (res.data[0] !== undefined) {
                    setSelectedProfileDoctorId(res.data[0].profileDoctorId)
                }
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        loadProfileDoctorByUserId();
    }, [])

    // const profileDoctorChange = (e) => {
    //     // const selectedId = e.target.value;
    //     setSelectedProfileDoctorId(e.target.value);

    //     console.log("Id của bác sĩ được chọn", selectedProfileDoctorId)

    //     // console.log("List các bác sĩ", profileDoctorByUserId)

    //     // Lấy tên bác sĩ từ danh sách bác sĩ ban đầu
    //     const selectedDoctor = Object.values(profileDoctorByUserId).find(pd => pd.profileDoctorId === selectedProfileDoctorId);
    //     // console.log(Object.values(profileDoctorByUserId).map(pd => pd.profileDoctorId))
    //     console.log("select: " + selectedDoctor)
    //     console.log("Id của bác sĩ được chọn", selectedProfileDoctorId)
    //     // const doctorBookingPrice = Object.values(profileDoctorByUserId).find(pd => pd.bookingPrice === selectedId)
    //     if (selectedDoctor) {
    //         setSelectedDoctorName(selectedDoctor.name);
    //         setBookingPrice(selectedDoctor.bookingPrice)
    //     }
    //     else {
    //         setSelectedDoctorName('');
    //         setBookingPrice('');
    //     }
    // }

    const profileDoctorChange = (e) => {
        const selectedId = e.target.value;
        setSelectedProfileDoctorId(selectedId);
    };

    useEffect(() => {
        console.log("Id của bác sĩ được chọn", selectedProfileDoctorId);

        const selectedDoctor = Object.values(profileDoctorByUserId).find(pd => pd.profileDoctorId === selectedProfileDoctorId);
        console.log("select: ", selectedDoctor);

        console.log(Object.values(profileDoctorByUserId).map(pd => pd.profileDoctorId === selectedProfileDoctorId))
        console.log(Object.values(profileDoctorByUserId).map(pd => pd.profiledoctorId))

        if (selectedDoctor) {
            setSelectedDoctorName(selectedDoctor.name);
            setBookingPrice(selectedDoctor.bookingPrice);
        } else {
            setSelectedDoctorName('');
            setBookingPrice('');
        }
    }, [selectedProfileDoctorId, profileDoctorByUserId]);

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setMinDate(today);
    }, []);

    // const loadWaitingBooking = async () => {
    //     try {
    //         console.log(selectedProfileDoctorId);
    //         let res = await authApi().post(endpoints['booking-doctor-view'], {
    //             "profileDoctorId": selectedProfileDoctorId
    //         })
    //         setBookingList(res.data);
    //         console.log(res.data);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    const renderContent = () => {
        switch (selectedOption) {
            case "new":
                return <>
                    {selectedProfileDoctorId === "" ? <h2>Vui lòng chọn bác sĩ</h2> :
                        <NewBooking profileDoctorId={selectedProfileDoctorId} />
                    }
                </>
            case "confirmed":
                return <>
                    {selectedProfileDoctorId === "" ? <h2>Vui lòng chọn bác sĩ</h2> :
                        <AcceptBooking profileDoctorId={selectedProfileDoctorId} />
                    }
                </>
            case "rejected":
                return <>
                    {selectedProfileDoctorId === "" ? <h2>Vui lòng chọn bác sĩ</h2> :
                        <DeclineBooking profileDoctorId={selectedProfileDoctorId} />
                    }
                </>
            // case "cancelled":
            //     return <>
            //         <div>Nội dung cho Đã hủy</div>
            //     </>
            default:
                return null;
        }
    };

    return <>
        <div className="BookingManagement_Wrapper">
            <div className="BookingManagement">
                <div className="BookingManagement_Left">
                    <div className="BookingManagement_Left_Content">
                        <DoctorMenu />
                    </div>
                </div>
                <div className="BookingManagement_Right">
                    <div className="BookingManagement_Right_Header">
                        <h2 className="text-center mb-3">Quản lý lịch hẹn</h2>
                    </div>
                    <div className="BookingManagement_Right_Body_1">
                        <div className="BookingManagement_Date_Option">
                            <Form.Label style={{ width: "30%" }}>Chọn ngày</Form.Label>
                            <input type="date" style={{ width: "60%" }} defaultValue={minDate} min={minDate} id="dateInput" />
                        </div>
                        <div className="BookingManagement_Profile_Option">
                            <Form.Label style={{ width: "30%" }}>Chọn hồ sơ</Form.Label>
                            <select style={{ width: "60%" }} className="value" defaultValue={selectedProfileDoctorId} onChange={(e) => profileDoctorChange(e)}>
                                {Object.values(profileDoctorByUserId).map(pd => <option key={pd.profileDoctorId} value={pd.profileDoctorId}>{pd.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="BookingManagement_Right_Body_2">
                        <div className="List_Action">
                            <ul>
                                <li className={selectedOption === "new" ? "active" : ""}
                                    onClick={() => handleOptionClick("new")}>Bệnh nhân mới</li>
                                <li className={selectedOption === "confirmed" ? "active" : ""}
                                    onClick={() => handleOptionClick("confirmed")}>Đã xác nhận</li>
                                <li className={selectedOption === "rejected" ? "active" : ""}
                                    onClick={() => handleOptionClick("rejected")}>Đã từ chối</li>
                                <li className={selectedOption === "cancelled" ? "active" : ""}
                                    onClick={() => handleOptionClick("cancelled")}>Đã hủy</li>
                            </ul>
                        </div>
                        <div>{renderContent()}</div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default BookingManagement;