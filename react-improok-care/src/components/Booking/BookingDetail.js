import { useNavigate, useParams, Link } from "react-router-dom";
import "./BookingDetail.css"
import { useContext, useEffect, useState } from "react";
import Apis, { authApi, endpoints } from "../../configs/Apis";
import { UserContext, BookingResultContext } from "../../App";
import printer from "../../assets/images/printer.png"
import profileicon from "../../assets/images/profile-icon.png"
// import profile404 from "../../assets/images/profile.png"
import googleplay from "../../assets/images/googleplay.svg"
import appstore from "../../assets/images/appstore.svg"
import { Badge } from "react-bootstrap";
import { FaAngleDown, FaArrowRight } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { toast } from "react-toastify";
import { reConnectNotification } from "../../utils/WebSocket";
import cookie from "react-cookies";
import MySpinner from "../../layout/Spinner";
import Swal from "sweetalert2";

const BookingDetail = () => {
    const [current_user,] = useContext(UserContext);
    const [bookingResult, dispatchBookingResult] = useContext(BookingResultContext);
    const { profileDoctorId } = useParams();
    const [doctorDetail, setDoctorDetail] = useState('');
    const [profilePatient, setProfilePatient] = useState([]);
    const [profilePatientName, setProfilePatientName] = useState('')
    const [profilePatientId, setProfilePatientId] = useState('')
    const [dateBooking, setDateBooking] = useState([]);
    const [timeSlotBooking, setTimeSlotBooking] = useState([]);
    const [bookingStep, setBookingStep] = useState(true);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTimeSlot, setBookingTimeSlot] = useState('');
    const [scheduleId, setScheduleId] = useState('')
    const [timeSlotId, setTimeSlotId] = useState('')
    const [bookingProfile, setBookingProfile] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [bookingResultList, setBookingResultList] = useState([]);

    const [loading, setLoading] = useState(false);

    const nav = useNavigate();

    const handleDateClick = (formattedDate) => {
        setSelectedDate(formattedDate);
    };

    useEffect(() => {
        const loadProfileDoctorById = async () => {
            try {
                console.log(profileDoctorId)
                let res = await Apis.get(endpoints['load-profile-doctor-by-Id'](profileDoctorId));
                setDoctorDetail(res.data);
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        loadProfileDoctorById();
    }, [profileDoctorId])

    useEffect(() => {
        const loadDateBooking = async () => {
            try {
                let res = await Apis.post(endpoints['date-booking'], {
                    "profileDoctorId": profileDoctorId
                })
                setDateBooking(res.data);
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        loadDateBooking();
    }, [profileDoctorId])

    const checkBookingStep = (e, timeBegin, timeEnd) => {
        setBookingStep(!bookingStep);
        setBookingTimeSlot(`${timeBegin} - ${timeEnd}`)
    }

    const profilePatientChoice = (evt, profilePatientId, profilePatientName) => {
        evt.preventDefault();

        const process = async () => {
            try {
                setProfilePatientId(profilePatientId);
                setProfilePatientName(profilePatientName);

                console.log(profilePatientId, profilePatientName);
            } catch (error) {
                console.log(error);
            }
        }
        process();
    }

    const addBooking = (evt, timeBegin, timeEnd, timeSlotId) => {
        evt.preventDefault();

        const process = async () => {
            setBookingStep(!bookingStep);
            setBookingTimeSlot(`${timeBegin} - ${timeEnd}`)
            setTimeSlotId(timeSlotId);
            const [day, month, year] = bookingDate.split('/');
            const formattedDateNew = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            console.log(formattedDateNew, timeSlotId, profileDoctorId)

            let res = await Apis.post(endpoints['find-check-scheduled'], {
                "profileDoctorId": profileDoctorId,
                "date": formattedDateNew,
                "timeSlotId": timeSlotId
            })
            console.log(res.data);
            const scheduleId = res.data.scheduleId;
            setScheduleId(scheduleId)
            console.log(scheduleId)
        }
        process();
    }

    const saveBooking = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                setLoading(true)
                console.log(scheduleId, profilePatientName)
                let res = await authApi().post(endpoints['add-booking'], {
                    "scheduleId": scheduleId,
                    "profilePatientId": profilePatientId
                })
                if (res.data.length !== 0) {
                    cookie.save('bookingresult', res.data.bookingId);
                    setBookingResultList(res.data);
                    let mes = await Apis.post(endpoints['send-custom-email'], {
                        "mailTo": "2051050549tuan@ou.edu.vn",
                        "mailSubject": "Xác nhận đặt khám",
                        "mailContent": "Bạn đã đặt khám thành công tại hệ thống I'MPROOKCARE"
                    })
                    console.log(mes.data);

                    const bookingId = res.data.bookingId

                    dispatchBookingResult({
                        "type": "booking",
                        "payload": bookingId
                    });
                    console.log(res.data.bookingId);
                    console.log(bookingId);
                    nav('/bookingresult');
                    Swal.fire(
                        'Thành công', "Đặt lịch thành công!", 'success'
                    );
                    setLoading(false)
                }
                else {
                    Swal.fire(
                        'Thất bại', "Có lỗi xảy ra!", 'error'
                    );
                    setLoading(false)
                }
            } catch (error) {
                console.log(error);
                setLoading(false)
            }
        }
        process();
    }

    useEffect(() => {
        const loadProfilePatient = async () => {
            try {
                let e = endpoints['load-profile-patient'](current_user?.userId)
                e += `?isLock=false`
                let res = await authApi().get(e)
                setProfilePatient(res.data.content);
                console.log(res.data.content);
            } catch (error) {
                console.log(error)
            }
        }
        loadProfilePatient();
    }, [current_user?.userId])

    const dateBookingChoice = (evt, formattedDate) => {
        evt.preventDefault();

        const process = async () => {
            try {
                setBookingDate(formattedDate)
                const [day, month, year] = formattedDate.split('/');
                const formattedDateNew = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                console.log(profileDoctorId, formattedDateNew)
                let res = await Apis.post(endpoints['timeslot-booking'], {
                    "profileDoctorId": profileDoctorId,
                    "date": formattedDateNew
                })
                setTimeSlotBooking(res.data);
                console.log(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        process();
    }

    useEffect(() => {
        let client = cookie.load("socket")
        console.log("Client", client?.connected);
        if (current_user && client) {
            cookie.remove("socket");
            reConnectNotification(false, current_user?.userId);
        }
    }, [])

    return <>
        <div className="Booking_Detail_Wrapper">
            {bookingStep === true ?
                <>
                    <div className="Booking_Detail">
                        <div className="Booking_Detail_Header" style={{ marginBottom: "3rem" }}>
                            <div className="Booking_Step">
                                <div className="Booking_Step_1">
                                    <span style={{ marginRight: ".5rem" }}><Badge bg="success">1</Badge></span>
                                    <span>Thời gian khám</span>
                                </div>
                            </div>
                        </div>
                        <div className="Booking_Detail_Body">
                            <div className="Booking_Detail_Body_Left">
                                <div className="Booking_Date_Time">
                                    <div>
                                        <span style={{ marginRight: ".5rem" }}><Badge bg="primary">1</Badge></span>
                                        <span style={{ marginRight: ".5rem" }}>Ngày và giờ khám</span>
                                        <span style={{ marginLeft: "auto" }}><FaAngleDown /></span>
                                    </div>
                                    <div className="Booking_Date">
                                        {dateBooking.length === 0 ? (
                                            <h5>Bác sĩ này hiện chưa đăng ký lịch khám</h5>
                                        ) : (
                                            Object.values(dateBooking).map(db => {
                                                const currentDate = new Date();
                                                const bookingDate = new Date(db);

                                                if (bookingDate.getDate() >= currentDate.getDate() &&
                                                    bookingDate.getMonth() >= currentDate.getMonth() &&
                                                    bookingDate.getFullYear() >= currentDate.getFullYear()) {
                                                    const dateObj = new Date(db);
                                                    const dayOfWeek = dateObj.toLocaleString('vi-VN', { weekday: 'long' });
                                                    const day = dateObj.getDate();
                                                    const month = dateObj.getMonth() + 1;
                                                    const year = dateObj.getFullYear();
                                                    const formattedDate = `${day}/${month}/${year}`;
                                                    return (
                                                        <div className="Booking_Date_Item" key={db} onClick={(evt) => dateBookingChoice(evt, formattedDate)}>
                                                            <span style={{ marginRight: ".25rem" }}>{dayOfWeek}</span>
                                                            <span id="dateInput">{formattedDate}</span>
                                                        </div>
                                                    );
                                                }
                                            })
                                        )}
                                    </div>
                                    <div className="Booking_TimeSlot">
                                        <div className="Booking_Time_Slot_List">
                                            {Object.values(timeSlotBooking).map(ts => {
                                                const timeSlotId = ts[0];
                                                const timeBegin = new Date(ts[1]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                                const timeEnd = new Date(ts[2]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                                const booked = ts[3];

                                                const spanStyle = {
                                                    marginRight: '10px',
                                                    backgroundColor: booked ? 'gray' : 'white',
                                                    color: booked ? 'white' : 'black',
                                                    cursor: booked ? 'not-allowed' : 'pointer'
                                                };

                                                const buttonDisabled = booked ? true : false;

                                                return (
                                                    <button style={spanStyle} disabled={buttonDisabled}><span key={timeSlotId} value={timeSlotId}
                                                        onClick={(evt) => addBooking(evt, timeBegin, timeEnd, timeSlotId)}>
                                                        {timeBegin} - {timeEnd}
                                                    </span></button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="Booking_Detail_Body_Right">
                                <div>
                                    <h5>Thông tin đặt khám</h5>
                                    <div className="Booking_Detail_Body_Doctor">
                                        <div>
                                            {doctorDetail?.userId?.avatar && (
                                                <div className="Booking_Detail_Doctor_Avatar">
                                                    <img src={doctorDetail.userId.avatar} width={"80%"} alt="Doctor Avatar" />
                                                </div>
                                            )}
                                            <div>
                                                <span style={{ fontWeight: "700", fontSize: "1.5rem" }}>{doctorDetail.name}</span>
                                                <span style={{ fontWeight: "300", fontSize: "1rem" }}>{doctorDetail.workAddress}</span>
                                            </div>
                                        </div>
                                        <div className="Booking_Detail_Body_Info">
                                            <div className="Booking_Date_Info" style={{ width: "100%" }}>
                                                <span>Ngày khám</span>
                                                <span>{bookingDate}</span>
                                            </div>
                                            <div className="Booking__TimeSlotInfo" style={{ width: "100%" }}>
                                                <span>Khung giờ</span>
                                                <span></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <button style={{ backgroundColor: "grey", cursor: "not-allowed" }}>Xác nhận đặt khám</button>
                                    </div>
                                </div>
                                <span>Bằng cách nhấn nút xác nhận, bạn đã đồng ý với các điều khoản và điều kiện đặt khám</span>
                            </div>
                        </div>
                    </div>
                </> :
                <>
                    <div className="Booking_Detail">
                        <div className="Booking_Detail_Header" style={{ marginBottom: "3rem" }}>
                            <div className="Booking_Step">
                                <div className="Booking_Step_1">
                                    <span style={{ marginRight: ".5rem", cursor: "pointer" }} onClick={() => checkBookingStep()}><Badge bg="primary"><TiTick /></Badge></span>
                                    <span>Thời gian khám</span>
                                </div>
                                <div>
                                    <FaArrowRight />
                                </div>
                                <div className="Booking-Step_2">
                                    <span style={{ marginRight: ".5rem" }}><Badge bg="success">2</Badge></span>
                                    <span>Bệnh nhân</span>
                                </div>
                            </div>
                        </div>
                        <div className="Booking_Detail_Body">
                            <div className="Booking_Detail_Body_Left">
                                <div className="Booking_Date_Time" style={{ marginBottom: "3rem" }}>
                                    <div>
                                        <span style={{ marginRight: ".5rem" }}><Badge bg="primary">1</Badge></span>
                                        <span style={{ marginRight: ".5rem" }}>Ngày và giờ khám</span>
                                        <span style={{ marginLeft: "auto", cursor: "pointer" }} onClick={() => checkBookingStep()}><FaAngleDown /></span>
                                    </div>
                                    <div></div>
                                </div>
                                <div className="Booking_Patient">
                                    <div style={{ marginBottom: "3rem" }}>
                                        <span style={{ marginRight: ".5rem" }}><Badge bg="primary">2</Badge></span>
                                        <span>Hồ sơ bệnh nhân</span>
                                    </div>
                                    <div>
                                        {profilePatient.length === 0 ? (
                                            <>
                                                <h6>Chọn hồ sơ bạn muốn đặt khám</h6>
                                                <div className="Profile_List_404">
                                                    <img src={printer} alt="404" width={'20%'} />
                                                    <span>Không tìm thấy kết quả</span>
                                                </div>
                                                <div>
                                                    Đăng ký Profile tại <Link to={`/user/profile?next=/booking/doctor/${profileDoctorId}`}>đây</Link>
                                                </div>
                                            </>
                                        ) : (
                                            Object.values(profilePatient).map(pp => {
                                                return <>
                                                    <div className="Profile_List_Detail" key={pp.profilePatientId} onClick={(e) => profilePatientChoice(e, pp.profilePatientId, pp.name)}>
                                                        <ul>
                                                            <li className="Image_Patient"><img src={profileicon} alt="profileicon" width={"100%"} /></li>
                                                            <li className="Name_Patient" key={pp.profilePatientId} value={pp.profilePatientId}>{pp.name}</li>
                                                        </ul>
                                                    </div>
                                                </>
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="Booking_Detail_Body_Right">
                                <div>
                                    <h5>Thông tin đặt khám</h5>
                                    <div className="Booking_Detail_Body_Doctor">
                                        <div>
                                            {doctorDetail?.userId?.avatar && (
                                                <div className="Booking_Detail_Doctor_Avatar">
                                                    <img src={doctorDetail?.userId?.avatar} width={"80%"} alt="Doctor Avatar" />
                                                </div>
                                            )}
                                            <div>
                                                <span style={{ fontWeight: "700", fontSize: "1.5rem" }}>{doctorDetail.name}</span>
                                                <span style={{ fontWeight: "300", fontSize: "1rem" }}>{doctorDetail.workAddress}</span>
                                            </div>
                                        </div>
                                        <div className="Booking_Detail_Body_Info">
                                            <div className="Booking_Date_Info" style={{ width: "100%" }}>
                                                <span>Ngày khám</span>
                                                <span>{bookingDate}</span>
                                            </div>
                                            <div className="Booking__TimeSlotInfo" style={{ width: "100%" }}>
                                                <span>Khung giờ</span>
                                                <span>{bookingTimeSlot}</span>
                                            </div>
                                            <div className="Booking_Patient_Info" style={{ width: "100%" }}>
                                                <span>Bệnh nhân</span>
                                                <span>{profilePatientName}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {profilePatient.length === 0 ? <>
                                            <button style={{ backgroundColor: "gray", cursor: "not-allowed" }}>Đặt lịch</button>
                                            {/* <button onClick={(e) => saveBooking(e)}>Đặt hàng</button> */}
                                        </> : <>
                                            {profilePatientId === '' ? <><button style={{ backgroundColor: "gray", cursor: "not-allowed" }}>Đặt lịch</button></> : <>
                                                {loading === true ? <MySpinner /> : <button onClick={saveBooking}>Đặt lịch</button>}</>}
                                            {/* <button style={{ backgroundColor: "gray" }}>Đặt lịch</button> */}
                                            {/* <button onClick={(e) => saveBooking(e)}>Đặt lịch</button> */}
                                        </>}
                                    </div>
                                    <span>Bằng cách nhấn nút xác nhận, bạn đã đồng ý với các điều khoản và điều kiện đặt khám</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>}
            <div className="Booking_Detail_Footer">
                <div>
                    <span>Đặt lịch khám Bác sĩ dễ dàng</span>
                    <h3>Tải ngay I'MPROOK CARE</h3>
                    <div>
                        <Link to="/" style={{ marginRight: '1rem' }}><img src={googleplay} alt="GooglePlay" /></Link>
                        <Link to="/"><img src={appstore} alt="AppStore" /></Link>
                    </div>
                </div>
            </div>
        </div >
    </>
}

export default BookingDetail;