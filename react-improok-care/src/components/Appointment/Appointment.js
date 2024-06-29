import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import "./Appointment.css";
import { authApi, endpoints } from "../../configs/Apis";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const Appointment = () => {
    const [current_user,] = useContext(UserContext);
    const [booking, setBooking] = useState([]);
    const [bookingDetail, setBookingDetail] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState('');
    const nav = useNavigate();

    const loadUserBooking = async () => {
        try {
            let res = await authApi().post(endpoints['booking-user-view'], {
                "userId": current_user?.userId
            })
            setBooking(res.data);
            console.log(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadUserBooking();
        nav("/user/appointment/paid")
        // Load lại trang vẫn giữ nguyên tab đang chọn
    }, [current_user?.userId])

    const viewBookingDetail = (evt, b) => {
        evt.preventDefault();
        console.log(b[8]);

        const process = async () => {
            try {
                let res = await authApi().post(endpoints['booking-details-user-view'], {
                    "bookingId": b[8]
                })
                setBookingDetail(res.data);
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        process();
    }

    const cancelBooking = (evt, bookingId) => {
        evt.preventDefault();

        const process = async () => {
            try {
                const requestBody = bookingId.toString()
                let res = await authApi().post(endpoints['cancel-booking'], requestBody, {
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                })
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        process();
    }

    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    return <>
        <div className="Appointment_Wrapper">
            <div className="Appointment">
                <div className="Appointment_Menu">
                    <div>
                        <NavLink
                            activeClassName="active"
                            onClick={() => handleItemClick("paid")}
                            to="paid"
                        >
                            <span className="text">Chờ thanh toán</span>
                        </NavLink>
                        <NavLink
                            activeClassName="active"
                            onClick={() => handleItemClick("waited")}
                            to="waited">
                            <span className="text">Chờ tiếp nhận</span>
                        </NavLink>
                        <NavLink
                            activeClassName="active"
                            onClick={() => handleItemClick("confirmed")}
                            to="confirmed">
                            <span className="text">Đã tiếp nhận</span>
                        </NavLink>
                        <NavLink
                            activeClassName="active"
                            onClick={() => handleItemClick("completed")}
                            to="completed">
                            <span className="text">Đã khám</span>
                        </NavLink>
                        <NavLink
                            activeClassName="active"
                            onClick={() => handleItemClick("denied")}
                            to="denied">
                            <span className="text">Đã từ chối</span>
                        </NavLink>
                        <NavLink
                            activeClassName="active"
                            onClick={() => handleItemClick("canceled")}
                            to="canceled">
                            <span className="text">Đã hủy</span>
                        </NavLink>
                    </div>
                </div>
                <Outlet />
                {/* <div className="Appointment_Left">
                    <div className="Appointment_Left_Content">
                        <UserMenu />
                    </div>
                </div> */}
                {/* <div className="Appointment_Middle">
                    <div className="Appoitment_Middle_Header">
                        <h3>Lịch khám</h3>
                    </div>
                    <div className="Appointment_Middle_Content">
                        <div className="Appointment_Middle_Container">
                            <div className="Appointment_Middle_Info">
                                <input type="text" placeholder="Tên bệnh nhân, tên bác sĩ,..."></input>
                                <div className="Appointment_List">
                                    {booking.length === 0 ? <>
                                        <div className="Appointment_List_404">
                                            <img src={printer} alt="404" width={'20%'} />
                                            <span>Không tìm thấy kết quả</span>
                                        </div>
                                    </> : <>
                                        <div className="Appointment_List_Info">
                                            <ul>
                                                {Object.values(booking).map(b => {
                                                    const isCancelled = b[7] === true;
                                                    const created_date = new Date(b[6]);

                                                    const formattedDate = created_date.toLocaleDateString();
                                                    const formattedTime = created_date.toLocaleTimeString();
                                                    return <>
                                                        <div className="Appointment_List_Detail" value={selectedBooking} onClick={(e) => viewBookingDetail(e, b)}>
                                                            <li key={b[8]} style={{ fontWeight: 'bold', fontSize: '1.25rem' }} value={b[8]}>{b[4]}</li>
                                                            <li >{formattedTime} - {formattedDate}</li>
                                                            <li >{b[2]}</li>
                                                            <li style={{ color: isCancelled ? 'red' : 'green', fontSize: '0.8rem' }}>
                                                                {isCancelled ? 'Đã hủy' : 'Đã đặt lịch'}
                                                            </li>
                                                        </div>
                                                    </>
                                                })}
                                            </ul>
                                        </div>
                                    </>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
                {/* <div className="Appointment_Right">
                    <section>
                        <div className="Appointment_Right_Header"><h3 className="text-center mb-4">Thông tin lịch khám</h3></div>
                        <div className="Appointment_Right_Content">
                            {bookingDetail === null ? <>
                                <div className="Appointment_Null">
                                    <h5 className="mb-4">Chọn hồ sơ cần xem</h5>
                                    <img src={schedule} alt="Not found" width={'20%'} />
                                </div>
                            </> :
                                <>
                                    {Object.values(bookingDetail).map(bd => {
                                        return <>
                                            <div className="Doctor_In4">
                                                <div className="Doctor_Avatar_Name">
                                                    <img src={bd[10]?.avatar} alt="avatar" width={'50%'} />
                                                    <div>
                                                        <span>{bd[0]}</span>
                                                        <span>{bd[1]}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="Booking_In4">
                                                <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>Thông tin đặt khám</div>
                                                <div className="Booking_In4_1">
                                                    <span>Ngày khám</span>
                                                    <span>{bd[4]}</span>
                                                </div>
                                                <div className="Booking_In4_2">
                                                    <span>Chuyên khoa</span>
                                                    <span>{bd[2]?.specialtyName}</span>
                                                </div>
                                                <div className="Booking_In4_3">
                                                    <span>Phí khám</span>
                                                    <span>{bd[3]}</span>
                                                </div>
                                            </div>
                                            <div className="Patient_In4">
                                                <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>Thông tin bệnh nhân</div>
                                                <div className="Patient_In4_1">
                                                    <span>Họ tên</span>
                                                    <span>{bd[5]}</span>
                                                </div>
                                                <div className="Patient_In4_2">
                                                    <span>Ngày sinh</span>
                                                    <span>{bd[6] === null ? 'Chưa cập nhật' : bd[6].substring(0, 10)}</span>
                                                </div>
                                                <div className="Patient_In4_3">
                                                    <span>Giới tính</span>
                                                    <span>{bd[9] === false ? 'Nam' : 'Nữ'}</span>
                                                </div>
                                                <div className="Patient_In4_4">
                                                    <span>Số điện thoại</span>
                                                    <span>{bd[7]}</span>
                                                </div>
                                                <div className="Patient_In4_5">
                                                    <span>Địa chỉ</span>
                                                    <span>{bd[8]}</span>
                                                </div>
                                            </div>
                                            <div className="Result_Info">
                                                <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>Tình trạng & Kết quả</div>
                                                <div className="Result_In4_1">
                                                    <span>Tình trạng</span>
                                                    <span>{bd[11] === true ? <Badge bg="danger">Đã hủy</Badge> : <Badge bg="success">Đã đặt lịch</Badge>}</span>
                                                </div>
                                                <div className="Result_In4_2">
                                                    <span>Kết quả</span>
                                                    <span>{bd[12]?.statusValue === "Chờ xác nhận" ? <Badge bg="warning">Chờ xác nhận</Badge> :
                                                        bd[12]?.statusValue === "Đã xác nhận" ? <Badge bg="success">Đã xác nhận</Badge> :
                                                            <Badge bg="danger">Từ chối</Badge>
                                                    }</span>
                                                </div>
                                            </div>
                                            <div className="Cancel_Button">
                                                <button type="button" onClick={(evt) => cancelBooking(evt, bd[13])}>Hủy Lịch</button>
                                            </div>
                                        </>
                                    })}
                                </>}
                        </div>
                    </section>
                </div> */}
            </div>
        </div>
    </>
}

export default Appointment;