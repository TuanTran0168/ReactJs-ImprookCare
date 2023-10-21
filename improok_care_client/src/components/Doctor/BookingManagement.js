import { useContext, useEffect, useState, createContext } from "react";
import { MyUserContext, BookingManagementContext } from "../../App";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/BookingManagement.css";
import Apis, { authApi, endpoints } from "../../configs/Apis";
import { Badge, Button, Form, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import ProfileDoctor from "./ProfileDoctor";
import Prescription from "./Prescription";
import { PrescriptionProvider } from '../../reducers/PrescriptionContext';
import cookie from "react-cookies"

const BookingManagement = () => {
    const [current_user, dispatch] = useContext(MyUserContext);
    const [booking, dispatchBooking] = useContext(BookingManagementContext)
    const [profileDoctorByUserId, setProfileDoctorByUserId] = useState([]);
    const [selectedProfileDoctorId, setSelectedProfileDoctorId] = useState('');
    const [bookingList, setBookingList] = useState([]);
    const [minDate, setMinDate] = useState('');
    const nav = useNavigate();
    const [selectedOption, setSelectedOption] = useState('new');
    const [bookingListCheck, setBookingListCheck] = useState("");

    const [bookingPrice, setBookingPrice] = useState('');
    const [selectedDoctorName, setSelectedDoctorName] = useState('');

    const [selectedBookingId, setSelectedBookingId] = useState("");
    const [selectedProfilePatientName, setSelectedProfilePatientName] = useState("");

    const [profileDoctor, setProfileDoctor] = useState();

    const [loading, setLoading] = useState(false);

    const [bookingInfo, setBookingInfo] = useState({
        bookingId: null,
        profilePatientName: null,
        profileDoctorName: null,
        bookingPrice: null
    })

    // const [selectedBookingId, setSelectedBookingId] = useState('');

    const logout = () => {
        dispatch({
            "type": "logout"
        })
        nav("/")
    }

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

    const loadWaitingBooking = async () => {
        try {
            // console.log("qq");
            console.log(selectedProfileDoctorId);
            let res = await authApi().post(endpoints['booking-doctor-view'], {
                "profileDoctorId": selectedProfileDoctorId
            })
            setBookingList(res.data);
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        loadWaitingBooking();
    }, [selectedProfileDoctorId])

    const handleCreatePrescription = (e, bookingId, profilePatientName) => {
        setSelectedBookingId(bookingId);
        setSelectedProfilePatientName(profilePatientName);
        loadDoctorById();
        console.log(bookingId)
        console.log(profilePatientName)
        console.log(selectedBookingId);
        console.log(selectedProfilePatientName);
        const updatedBookingInfo = {
            bookingId: bookingId,
            profilePatientName: profilePatientName,
            profileDoctorName: profileDoctor.name,
            bookingPrice: profileDoctor.bookingPrice
        };

        setBookingInfo(updatedBookingInfo);
        dispatchBooking({
            type: "booking",
            payload: updatedBookingInfo
        });
        cookie.save("bookingInfo", updatedBookingInfo);
        console.log(bookingInfo);
        console.log(current_user);
    };

    const loadDoctorById = async () => {
        try {
            setLoading(true);
            console.log(selectedProfileDoctorId)
            let res = await Apis.get(endpoints['load-profile-doctor-by-Id'](selectedProfileDoctorId))
            setProfileDoctor(res.data);
            setLoading(false);
            console.log("Đây là userInfo");
            console.log(res.data);
            console.log(profileDoctor);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        loadDoctorById()
    }, [selectedProfileDoctorId])

    // useEffect(() => {
    //     loadWaitingBooking();
    // }, [bookingList])

    // const loadWaitingBooking = async () => {
    //     try {
    //         console.log(selectedProfileDoctorId);
    //         let res = await authApi().post(endpoints['booking-doctor-view'], {
    //             "profiledoctorId": selectedProfileDoctorId
    //         });
    //         setBookingList(res.data);
    //         console.log(res.data);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    // useEffect(() => {
    //     loadWaitingBooking();
    // }, [selectedProfileDoctorId]);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    const acceptBooking = (evt, bookingId) => {
        evt.preventDefault();

        const process = async () => {
            try {
                const requestBody = bookingId.toString()
                let res = await authApi().post(endpoints['accept-booking'], requestBody, {
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                })
                console.log(requestBody)
                if (res.data === "Xác nhận thành công lịch đặt khám!") {
                    toast.success(res.data);
                    loadWaitingBooking();
                    let mes = await Apis.post(endpoints['send-custom-email'], {
                        "mailTo": "2051050549tuan@ou.edu.vn",
                        "mailSubject": "Xác nhận lịch khám",
                        "mailContent": "Lịch khám của quý khách đã được xác nhận! Vui lòng đến trước giờ khám bệnh 15’"
                    })
                    console.log(mes.data);
                }
                else {
                    toast.error(res.data);
                }
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        process();
    }

    const denyBooking = (evt, bookingId) => {
        evt.preventDefault();

        const process = async () => {
            try {
                const requestBody = bookingId.toString()
                let res = await authApi().post(endpoints['deny-booking'], requestBody, {
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                })
                if (res.data === "Từ chối thành công lịch đặt khám!") {
                    toast.success(res.data);
                    loadWaitingBooking();
                    let mes = await Apis.post(endpoints['send-custom-email'], {
                        "mailTo": "2051050549tuan@ou.edu.vn",
                        "mailSubject": "Từ chối lịch khám",
                        "mailContent": "Lịch khám của quý khách đã bị từ chối do chưa phù hợp. Mong quý khách thông cảm!"
                    })
                    console.log(mes.data);
                }
                else {
                    toast.error(res.data);
                }
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        process();
    }

    // const cancelBooking = (evt, bookingId) => {
    //     evt.preventDefault();

    //     const process = async () => {
    //         try {
    //             const requestBody = bookingId.toString()
    //             let res = await authApi().post(endpoints['cancel-booking'], requestBody, {
    //                 headers: {
    //                     'Content-Type': 'text/plain'
    //                 }
    //             })
    //             if (res.data === "Hủy thành công lịch đặt khám!") {
    //                 toast.success(res.data);
    //                 let mes = await Apis.post(endpoints['send-custom-email'], {
    //                     "mailTo": "2051050549tuan@ou.edu.vn",
    //                     "mailSubject": "Hello quý khách đã tin tưởng dịch vụ bên em",
    //                     "mailContent": "Điểm em quá thấp mời em đến nhập học ĐH Family"
    //                 })
    //                 console.log(mes.data);
    //             }
    //             else {
    //                 toast.error(res.data);
    //             }
    //             console.log(res.data);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    //     process();
    // }

    const removePres = () => {
        cookie.remove("pres");
    }

    const renderContent = () => {
        switch (selectedOption) {
            case "new":
                return <>
                    <div>
                        <div>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Tên bệnh nhân</th>
                                        <th>Ngày</th>
                                        <th>Khung giờ</th>
                                        <th>Tình trạng</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(bookingList).map((bl, index) => {
                                        const timeBegin = new Date(bl[3]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                        const timeEnd = new Date(bl[4]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                        if (bl[5] === "Chờ xác nhận") {
                                            return <>
                                                <tr key={index}>
                                                    <td>{bl[0]}</td>
                                                    <td>{bl[6]}</td>
                                                    <td>{bl[2]}</td>
                                                    <td>{timeBegin} - {timeEnd}</td>
                                                    <td>{bl[5]}</td>
                                                    <td>
                                                        <Button style={{ marginRight: '.5rem' }} variant="success" onClick={(evt) => acceptBooking(evt, bl[0])}>Xác nhận</Button>
                                                        <Button variant="danger" onClick={(evt) => denyBooking(evt, bl[0])}>Từ chối</Button>
                                                    </td>
                                                </tr>
                                            </>
                                        }
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </>
            case "confirmed":
                return <>
                    <div>
                        <div>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Tên bệnh nhân</th>
                                        <th>Ngày</th>
                                        <th>Khung giờ</th>
                                        <th>Tình trạng</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(bookingList).map((bl, index) => {
                                        const timeBegin = new Date(bl[3]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                        const timeEnd = new Date(bl[4]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                        const name = bl[6];
                                        if (bl[5] === "Đã xác nhận") {
                                            return <>
                                                <tr key={index}>
                                                    <td>{bl[0]}</td>
                                                    <td>{name}</td>
                                                    <td>{bl[2]}</td>
                                                    <td>{timeBegin} - {timeEnd}</td>
                                                    <td><Badge bg="success">{bl[5]}</Badge></td>
                                                    {/* <td><Button variant="primary" onClick={(e) => handleCreatePrescription(e, bl[0], bl[6])}>
                                                    <Link to={`/prescription/?bookingId=${bl[0]}&&profilePatientName=${bl[6]}&&profileDoctorName=${profileDoctor.name}&&bookingPrice=${profileDoctor.bookingPrice}`}>Tạo đơn thuốc</Link></Button></td> */}
                                                    <td><Button variant="primary" onClick={(e) => handleCreatePrescription(e, bl[0], bl[6])}><Link to='/prescription' class="toPrescription" onClick={() => removePres()}>Tạo đơn thuốc</Link></Button></td>
                                                </tr>
                                            </>
                                        }
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </>
            case "rejected":
                return <>
                    <div>
                        <div>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Tên bệnh nhân</th>
                                        <th>Ngày</th>
                                        <th>Khung giờ</th>
                                        <th>Tình trạng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(bookingList).map((bl, index) => {
                                        const timeBegin = new Date(bl[3]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                        const timeEnd = new Date(bl[4]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                        if (bl[5] === "Từ chối") {
                                            return <>
                                                <tr key={index}>
                                                    <td>{bl[0]}</td>
                                                    <td>{bl[6]}</td>
                                                    <td>{bl[2]}</td>
                                                    <td>{timeBegin} - {timeEnd}</td>
                                                    <td><Badge bg="danger">Đã {bl[5]}</Badge></td>
                                                </tr>
                                            </>
                                        }
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </>
            case "cancelled":
                return <>
                    <div>Nội dung cho Đã hủy</div>
                </>
            default:
                return null;
        }
    };

    return <>
        <div class="BookingManagement_Wrapper">
            <div class="BookingManagement">
                <div class="BookingManagement_Left">
                    <div class="BookingManagement_Left_Content">
                        <ul>
                            <li><Link to="/doctor">Thông tin cá nhân</Link></li>
                            {/* <li><Link to="/changepassword">Đổi mật khẩu</Link></li> */}
                            <li><Link to="/schedule">Đăng ký lịch khám</Link></li>
                            <li><Link to="/bookingmanagement">Lịch hẹn</Link></li>
                            <li><Link to="/profiledoctor">Hồ sơ</Link></li>
                            <li><Link to="/doctormessage">Tin nhắn</Link></li>
                            <li onClick={logout}>Đăng xuất</li>
                        </ul>
                    </div>
                </div>
                <div class="BookingManagement_Right">
                    <div class="BookingManagement_Right_Header">
                        <h2 className="text-center mb-3 text-info">QUẢN LÝ LỊCH HẸN</h2>
                    </div>
                    <div class="BookingManagement_Right_Body_1">
                        {/* <div class="BookingManagement_Date_Option">
                            <Form.Label style={{ width: "30%" }}>Chọn ngày</Form.Label>
                            <input type="date" style={{ width: "60%" }} defaultValue={minDate} min={minDate} id="dateInput" />
                        </div> */}
                        <div class="BookingManagement_Profile_Option">
                            <Form.Label style={{ width: "30%" }}>Chọn hồ sơ</Form.Label>
                            <select style={{ width: "60%" }} class="value" defaultValue={selectedProfileDoctorId} onChange={(e) => profileDoctorChange(e)}>
                                {Object.values(profileDoctorByUserId).map(pd => <option key={pd.profileDoctorId} value={pd.profileDoctorId}>{pd.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div class="BookingManagement_Right_Body_2">
                        <div class="List_Action">
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
                        <div>
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default BookingManagement;