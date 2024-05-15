import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { Badge, Button, Table } from "react-bootstrap";
import Apis, { authApi, endpoints } from "../../configs/Apis";
import { useNavigate } from "react-router-dom";
import cookie from "react-cookies";
import moment from "moment";

const PaidAppointment = () => {
    const [paidAppointment, setPaidAppointment] = useState([]);
    const [current_user,] = useContext(UserContext);
    const [loading, setLoading] = useState(false);

    const nav = useNavigate();
    // const [selectedBookingId, setSelectedBookingId] = useState("");
    // const [selectedProfilePatientName, setSelectedProfilePatientName] = useState("");
    // const [loading, setLoading] = useState(false);

    // const loadPaidAppointment = async () => {
    //     try {
    //         let e = endpoints['booking-user-view-page']
    //         e += "?pageNumber=0"
    //         console.log(e)
    //         let res = await authApi().post(e, {
    //             "userId": current_user?.userId,
    //             "bookingStatusId": "6"
    //         })
    //         console.log(res.data.content)
    //         setPaidAppointment(res.data.content)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const loadPaidAppointment = async () => {
        try {
            let e = endpoints['booking-user-view-page']
            e += "?pageNumber=0"
            console.log(e)

            let res1 = await authApi().post(e, {
                "userId": current_user?.userId,
                "bookingStatusId": "5"
            })

            let res2 = await authApi().post(e, {
                "userId": current_user?.userId,
                "bookingStatusId": "6"
            })

            console.log(res1.data.content)
            console.log(res2.data.content)

            const bookings = [...res1.data.content, ...res2.data.content]
            setPaidAppointment(bookings)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadPaidAppointment()
    }, [])

    const viewBookingDetail = (evt, bookingId) => {
        evt.preventDefault();
        nav(`/appointmentdetail?bookingId=${bookingId}`)
    }

    const servicePayment = async (price, patientName, bookingId) => {
        try {
            setLoading(true);
            cookie.save('bookingresult', bookingId)
            let res = await Apis.post(endpoints['vnpay-payment'], {
                "amount": price,
                "orderInfor": "Service Payment: " + patientName + " đã thanh toán tiền khám thành công ",
                "returnUrl": "http://localhost:3000/payment"
            });
            window.location.href = res.data;
            setLoading(false);
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

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
                            <th>Thanh toán</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(paidAppointment).map((pa, index) => {
                            const timeBegin = new Date(pa.scheduleId.timeSlotId?.timeBegin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            const timeEnd = new Date(pa.scheduleId.timeSlotId?.timeEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            return <>
                                <tr key={index}>
                                    <td>{pa.bookingId}</td>
                                    <td>{pa.profilePatientId.name}</td>
                                    <td>{moment(pa.scheduleId.date).format('DD-MM-YYYY')}</td>
                                    <td>{timeBegin} - {timeEnd}</td>
                                    <td><Badge bg="secondary">{pa.statusId.statusValue}</Badge></td>
                                    <td><Button variant="primary" onClick={(e) => viewBookingDetail(e, pa.bookingId)}>Chi tiết</Button></td>
                                    <td><Button variant="primary" onClick={() => servicePayment(pa.scheduleId.profileDoctorId.bookingPrice, pa.profilePatientId.name, pa.bookingId)}>Thanh toán</Button></td>
                                </tr>
                            </>
                        })}
                    </tbody>
                </Table>
            </div>
        </div>
    </>
}

export default PaidAppointment;