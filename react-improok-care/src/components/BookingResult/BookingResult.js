import { useContext, useEffect, useState } from "react";
import "./BookingResult.css"
import { BookingResultContext } from "../../App";
import { Badge } from "react-bootstrap";
import cookie from "react-cookies";
import Apis, { authApi, endpoints } from "../../configs/Apis";
import { Link } from "react-router-dom";
import success from "../../assets/images/success.png"
import { toast } from "react-toastify";

const BookingResult = () => {
    const [bookingResult,] = useContext(BookingResultContext);
    const [bookingDetail, setBookingDetail] = useState([]);
    const [birthday, setBirthday] = useState('');
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState('');
    const [patientName, setPatientName] = useState('');

    useEffect(() => {
        console.log(bookingResult);
        console.log(cookie.load("bookingresult"));
        let bookingId = bookingResult;
        const viewBookingDetail = async () => {
            try {
                let res = await authApi().post(endpoints['booking-details-user-view'], {
                    "bookingId": bookingId
                })
                setBookingDetail(res.data[0]);
                console.log(res.data[0]);
                const formattedDate = new Date(res.data[0][6]);
                formattedDate.setHours(formattedDate.getHours() + 7);

                const formattedDateTime = formattedDate.toISOString().substring(0, 10);
                setBirthday(formattedDateTime);
                setPrice(res.data[0][3])
                setPatientName(res.data[0][5])
            } catch (error) {
                console.log(error);
            }
        }
        viewBookingDetail()
    }, [])

    const servicePayment = async () => {
        try {
            setLoading(true);
            let res = await Apis.post(endpoints['vnpay-payment'], {
                "amount": price,
                "orderInfor": "Service Payment: " + patientName + " đã thanh toán tiền khám thành công ",
                "returnUrl": "http://localhost:3000/payment"
            });
            window.location.href = res.data;
            // toast.success(res.data);
            setLoading(false);
            console.log(res.data);
        } catch (error) {
            toast.error(error);
            console.log(error);
        }
    }

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
                            <span>{bookingDetail[3]} VNĐ</span>
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
                            {/* <span>{bookingDetail[6]?.substring(0, 10)}</span> */}
                            <span>{birthday}</span>
                        </div>
                        <div className="BookingPatient_In4_3">
                            <span>Giới tính</span>
                            <span>{bookingDetail[9] === true ? 'Nam' : 'Nữ'}</span>
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
                            <span><Badge bg="secondary">{bookingDetail[12]?.statusValue}</Badge></span>
                        </div>
                    </div>
                    <div className="form-group" style={{ display: 'flex', marginLeft: '5rem', gap: '1rem' }}>
                        <button><Link to="/">Về trang chủ</Link></button>
                        <button onClick={() => servicePayment()}>Thanh toán</button>
                    </div>
                </div>
            </div >
        </>
    )
}

export default BookingResult;