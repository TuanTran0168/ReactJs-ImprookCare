import { useEffect, useState } from "react";
import Apis, { authApi, endpoints } from "../../configs/Apis";
import { Badge } from "react-bootstrap";
import "./AppointmentDetail.css"
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import Swal from "sweetalert2";

const AppointmentDetail = () => {
    const [bookingDetail, setBookingDetail] = useState([]);
    const [q] = useSearchParams();
    const [loading, setLoading] = useState(false)

    const viewBookingDetail = async () => {
        try {
            let bookingId = q.get('bookingId')
            let res = await authApi().post(endpoints['booking-details-user-view'], {
                "bookingId": bookingId
            })
            setBookingDetail(res.data[0]);
            console.log(res.data[0]);
        } catch (error) {
            console.log(error);
        }
    }

    const cancelBooking = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                let bookingId = q.get('bookingId')
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

    const refund = async () => {
        try {
            setLoading(true);
            let bookingId = q.get('bookingId')
            let uri = "Bệnh nhân " + bookingDetail[5] + " đã được hoàn tiền thành công "
            let encoded = encodeURIComponent(uri)
            let res = await Apis.post(endpoints['vnpay-payment'], {
                "amount": bookingDetail[3],
                "orderInfor": encoded,
                "returnUrl": `http://localhost:3000/refund/?bookingId=${bookingId}`
            });
            window.location.href = res.data;
            setLoading(false);
            console.log(res.data);
        } catch (error) {
            Swal.fire(
                'Thất bại', "Có lỗi xảy ra!", 'error'
            );
            console.log(error);
        }
    }

    useEffect(() => {
        viewBookingDetail()
    }, [])

    return <>
        <div className="appointment_detail_wrapper">
            <div>
                <div className="Doctor_In4">
                    <div className="Doctor_Avatar_Name">
                        <img src={bookingDetail[10]?.avatar} alt="avatar" width={'25%'} />
                        <div>
                            <span>{bookingDetail[0]}</span>
                            <span>{bookingDetail[1]}</span>
                        </div>
                    </div>
                </div>
                <div className="Booking_In4">
                    <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>Thông tin đặt khám</div>
                    <div className="Booking_In4_1">
                        <span>Ngày khám</span>
                        <span>{moment(bookingDetail[4]).format('DD-MM-YYYY')}</span>
                    </div>
                    <div className="Booking_In4_2">
                        <span>Chuyên khoa</span>
                        <span>{bookingDetail[2]?.specialtyName}</span>
                    </div>
                    <div className="Booking_In4_3">
                        <span>Phí khám</span>
                        <span>{bookingDetail[3]} VNĐ</span>
                    </div>
                </div>
                <div className="Patient_In4">
                    <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>Thông tin bệnh nhân</div>
                    <div className="Patient_In4_1">
                        <span>Họ tên</span>
                        <span>{bookingDetail[5]}</span>
                    </div>
                    <div className="Patient_In4_2">
                        <span>Ngày sinh</span>
                        <span>{bookingDetail[6] === null ? 'Chưa cập nhật' : moment(bookingDetail[6]).format('DD-MM-YYYY')}</span>
                    </div>
                    <div className="Patient_In4_3">
                        <span>Giới tính</span>
                        <span>{bookingDetail[9] === true ? 'Nam' : 'Nữ'}</span>
                    </div>
                    <div className="Patient_In4_4">
                        <span>Số điện thoại</span>
                        <span>{bookingDetail[7]}</span>
                    </div>
                    <div className="Patient_In4_5">
                        <span>Địa chỉ</span>
                        <span>{bookingDetail[8]}</span>
                    </div>
                </div>
                <div className="Result_Info">
                    <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>Tình trạng & Kết quả</div>
                    <div className="Result_In4_1">
                        <span>Tình trạng</span>
                        <span>{bookingDetail[11] === true ? <Badge bg="danger">Đã hủy</Badge> : <Badge bg="success">Đã đặt lịch</Badge>}</span>
                    </div>
                    <div className="Result_In4_2">
                        <span>Kết quả</span>
                        <span><Badge bg="secondary">{bookingDetail[12]?.statusValue}</Badge></span>
                    </div>
                </div>
                <div className="Cancel_Button">
                    {bookingDetail[12]?.statusValue === "Đã khám xong" || bookingDetail[12]?.statusValue === "Đã xác nhận" ? '' : bookingDetail[12]?.statusValue === "Chưa thanh toán" || bookingDetail[12]?.statusValue === "Tái khám" ? <button type="button" onClick={(evt) => cancelBooking(evt)}>Hủy lịch</button> : <button type="button" onClick={(evt) => { cancelBooking(evt); refund() }}>Hủy lịch & Hoàn tiền</button>}
                </div>
            </div>
        </div>
    </>
}

export default AppointmentDetail;