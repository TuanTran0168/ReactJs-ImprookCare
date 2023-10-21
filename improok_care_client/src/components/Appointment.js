import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MyUserContext } from "../App";
import "../styles/Appointment.css";
import { authApi, endpoints } from "../configs/Apis";
import printer from "../assests/images/printer.png"
import { Badge, Form } from "react-bootstrap";
import schedule from "../assests/images/schedule.png"
import { set } from "date-fns";

const Appointment = () => {
    const [current_user, dispatch] = useContext(MyUserContext);
    const nav = useNavigate();
    const [booking, setBooking] = useState([]);
    const [bookingDetail, setBookingDetail] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState('');

    const logout = () => {
        dispatch({
            "type": "logout"
        })
        nav("/");
    }

    const loadUserBooking = async () => {
        try {
            let res = await authApi().post(endpoints['booking-user-view'], {
                "userId": current_user.userId
            })
            setBooking(res.data);
            console.log(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadUserBooking();
    }, [current_user.userId])

    const viewBookingDetail = (evt, b) => {
        evt.preventDefault();
        // setSelectedBooking(b[8]);
        console.log(b[8])

        const process = async () => {
            try {
                // console.log(selectedBooking)
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

    return <>
        <div class="Appointment_Wrapper">
            <div class="Appointment">
                <div class="Appointment_Left">
                    <div class="Appointment_Left_Content">
                        <ul>
                            <li><Link to="/personalpage">Thông tin cá nhân</Link></li>
                            {/* <li><Link to="/changepassword">Đổi mật khẩu</Link></li> */}
                            <li><Link to="/appointment">Lịch khám</Link></li>
                            <li><Link to="/medicalrecord">Lịch sử khám</Link></li>
                            <li><Link to="/profile">Hồ sơ</Link></li>
                            <li><Link to="/message">Tin nhắn</Link></li>
                            <li onClick={logout}>Đăng xuất</li>
                        </ul>
                    </div>
                </div>
                <div class="Appointment_Middle">
                    <div class="Appoitment_Middle_Header">
                        <h3>Lịch khám</h3>
                    </div>
                    <div class="Appointment_Middle_Content">
                        <div class="Appointment_Middle_Container">
                            <div class="Appointment_Middle_Info">
                                <input type="text" placeholder="Tên bệnh nhân, tên bác sĩ,..."></input>
                                <div class="Appointment_List">
                                    {booking.length === 0 ? <>
                                        <div class="Appointment_List_404">
                                            <img src={printer} alt="404" width={'20%'} />
                                            <span>Không tìm thấy kết quả</span>
                                        </div>
                                    </> : <>
                                        <div class="Appointment_List_Info">
                                            <ul>
                                                {Object.values(booking).map(b => {
                                                    const isCancelled = b[7] === true;
                                                    const created_date = new Date(b[6]);

                                                    const formattedDate = created_date.toLocaleDateString(); // Định dạng ngày
                                                    const formattedTime = created_date.toLocaleTimeString(); // Định dạng giờ
                                                    return <>
                                                        <div class="Appointment_List_Detail" value={selectedBooking} onClick={(e) => viewBookingDetail(e, b)}>
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
                </div>
                <div class="Appointment_Right">
                    <section>
                        <div class="Appointment_Right_Content">
                            {bookingDetail === null ? <>
                                <div class="Appointment_Null">
                                    <h5 className="mb-4">Chọn hồ sơ cần xem</h5>
                                    <img src={schedule} alt="Not found" width={'20%'} />
                                </div>
                            </> :
                                <>
                                    {Object.values(bookingDetail).map(bd => {
                                        // const formattedDate = created_date.toLocaleDateString(); // Định dạng ngày
                                        // const formattedTime = created_date.toLocaleTimeString(); // Định dạng giờ
                                        return <>
                                            <div class="Doctor_In4">
                                                <div class="Doctor_Avatar_Name">
                                                    <img src={bd[10]?.avatar} alt="avatar" width={'50%'} />
                                                    <div>
                                                        <span>{bd[0]}</span>
                                                        <span>{bd[1]}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="Booking_In4">
                                                <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>Thông tin đặt khám</div>
                                                <div class="Booking_In4_1">
                                                    <span>Ngày khám</span>
                                                    <span>{bd[4]}</span>
                                                </div>
                                                <div class="Booking_In4_2">
                                                    <span>Chuyên khoa</span>
                                                    <span>{bd[2]?.specialtyName}</span>
                                                </div>
                                                <div class="Booking_In4_3">
                                                    <span>Phí khám</span>
                                                    <span>{bd[3]}</span>
                                                </div>
                                            </div>
                                            <div class="Patient_In4">
                                                <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>Thông tin bệnh nhân</div>
                                                <div class="Patient_In4_1">
                                                    <span>Họ tên</span>
                                                    <span>{bd[5]}</span>
                                                </div>
                                                <div class="Patient_In4_2">
                                                    <span>Ngày sinh</span>
                                                    <span>{bd[6] === null ? 'Chưa cập nhật' : bd[6].substring(0, 10)}</span>
                                                </div>
                                                <div class="Patient_In4_3">
                                                    <span>Giới tính</span>
                                                    <span>{bd[9] === false ? 'Nam' : 'Nữ'}</span>
                                                </div>
                                                <div class="Patient_In4_4">
                                                    <span>Số điện thoại</span>
                                                    <span>{bd[7]}</span>
                                                </div>
                                                <div class="Patient_In4_5">
                                                    <span>Địa chỉ</span>
                                                    <span>{bd[8]}</span>
                                                </div>
                                            </div>
                                            <div class="Result_Info">
                                                <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>Tình trạng & Kết quả</div>
                                                <div class="Result_In4_1">
                                                    <span>Tình trạng</span>
                                                    <span>{bd[11] === true ? <Badge bg="danger">Đã hủy</Badge> : <Badge bg="success">Đã đặt lịch</Badge>}</span>
                                                </div>
                                                <div class="Result_In4_2">
                                                    <span>Kết quả</span>
                                                    <span>{bd[12]?.statusValue === "Chờ xác nhận" ? <Badge bg="warning">Chờ xác nhận</Badge> :
                                                        bd[12]?.statusValue === "Đã xác nhận" ? <Badge bg="success">Đã xác nhận</Badge> :
                                                            <Badge bg="danger">Từ chối</Badge>
                                                    }</span>
                                                </div>
                                            </div>
                                            <div class="Cancel_Button">
                                                <button type="button" onClick={(evt) => cancelBooking(evt, bd[13])}>Hủy Lịch</button>
                                            </div>
                                        </>
                                    })}
                                </>}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </>
}

export default Appointment;