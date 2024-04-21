import { useContext, useEffect, useState } from "react";
import "./BookingResult.css"
import { BookingResultContext } from "../../App";
import { Badge } from "react-bootstrap";
import cookie from "react-cookies";
import { authApi, endpoints } from "../../configs/Apis";
import { Link } from "react-router-dom";
import success from "../../assets/images/success.png"

const BookingResult = () => {
    const [bookingResult,] = useContext(BookingResultContext);
    const [bookingDetail, setBookingDetail] = useState([])

    useEffect(() => {
        console.log(bookingResult);
        console.log(cookie.load("bookingresult"));
        let id = cookie.load("bookingresult");
        const viewBookingDetail = async () => {
            try {
                let res = await authApi().post(endpoints['booking-details-user-view'], {
                    "bookingId": id
                })
                setBookingDetail(res.data[0]);
                console.log(res.data[0]);
            } catch (error) {
                console.log(error);
            }
        }
        viewBookingDetail()
    }, [])

    console.log(cookie.load("bookingresult"));

    return (
        <>
            <div className="BookingResult_Wrapper">
                <div className="BookingResult_Content">
                    <div className="BookingResult_In4">
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ marginLeft: '3rem' }}>KẾT QUẢ ĐẶT KHÁM</h3>
                            <div className="BookingResult_In4_1">
                                <img style={{ marginLeft: '8rem' }} src={success} alt="success" width={"15%"} />
                            </div>
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>Thông tin đặt khám</div>
                        <div className="BookingResult_In4_1">
                            <span>Ngày khám</span>
                            <span>{bookingDetail[4]}</span>
                        </div>
                        <div className="BookingResult_In4_2">
                            <span>Chuyên khoa</span>
                            <span>{bookingDetail[2]?.specialtyName}</span>
                        </div>
                        <div className="BookingResult_In4_3">
                            <span>Phí khám</span>
                            <span>{bookingDetail[3]}</span>
                        </div>
                    </div>
                    <div className="BookingPatient_In4">
                        <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>Thông tin bệnh nhân</div>
                        <div className="BookingPatient_In4_1">
                            <span>Họ tên</span>
                            <span>{bookingDetail[5]}</span>
                        </div>
                        <div className="BookingPatient_In4_2">
                            <span>Ngày sinh</span>
                            <span>{bookingDetail[6]}</span>
                        </div>
                        <div className="BookingPatient_In4_3">
                            <span>Giới tính</span>
                            <span>{bookingDetail[9] === false ? 'Nam' : 'Nữ'}</span>
                        </div>
                        <div className="BookingPatient_In4_4">
                            <span>Số điện thoại</span>
                            <span>{bookingDetail[7]}</span>
                        </div>
                        <div className="BookingPatient_In4_5">
                            <span>Địa chỉ</span>
                            <span>{bookingDetail[8]}</span>
                        </div>
                    </div>
                    <div className="BookingResult_Info">
                        <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>Tình trạng</div>
                        <div className="BookingResult_Info_1">
                            <span>Tình trạng</span>
                            <span>{bookingDetail[12]?.statusValue === "Chờ xác nhận" ? <Badge bg="warning">Chờ xác nhận</Badge> :
                                bookingDetail[12]?.statusValue === "Đã xác nhận" ? <Badge bg="success">Đã xác nhận</Badge> :
                                    <Badge bg="danger">Từ chối</Badge>
                            }</span>
                        </div>
                    </div>
                    <div className="form-group" style={{ marginLeft: "7rem" }}>
                        <button><Link to="/">Quay lại trang chủ</Link></button>
                    </div>
                </div>
            </div >
        </>
    )
}

export default BookingResult;