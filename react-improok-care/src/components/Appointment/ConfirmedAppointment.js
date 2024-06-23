import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { Badge, Button, Table } from "react-bootstrap";
import { authApi, endpoints } from "../../configs/Apis";
import { useNavigate } from "react-router-dom";
import moment from "moment"
import { FaVideo } from "react-icons/fa";
import { MdMenu } from "react-icons/md";
import Pagination from "../../utils/Pagination"

const ConfirmedAppointment = () => {
    const [confirmedAppointment, setConfirmedAppointment] = useState([]);
    const [current_user,] = useContext(UserContext);
    const [totalPages, setTotalPages] = useState('1');
    const [selectedPage, setSelectedPage] = useState('1');

    const nav = useNavigate();
    // const [selectedBookingId, setSelectedBookingId] = useState("");
    // const [selectedProfilePatientName, setSelectedProfilePatientName] = useState("");
    const [loading, setLoading] = useState(false);

    const loadConfirmedAppointment = async () => {
        try {
            let e = endpoints['booking-user-view-page']
            e += "?pageNumber=0"
            console.log(e)
            let res = await authApi().post(e, {
                "userId": current_user?.userId,
                "bookingStatusId": "2"
            })
            console.log(res.data.content)
            setConfirmedAppointment(res.data.content)
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.log(error)
        }
    }

    const loadConfirmedAppointmentPage = async (pageNumber) => {
        try {
            setLoading(true);
            let e = endpoints['booking-user-view-page']
            e += `?pageNumber=${pageNumber - 1}`
            console.log(e)

            let res = await authApi().post(e, {
                "userId": current_user?.userId,
                "bookingStatusId": "2"
            })
            setConfirmedAppointment(res.data.content)
            setTotalPages(res.data.totalPages);
            console.log(res.data.totalPages);
            console.log(e);
            setLoading(false);
            console.log(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadConfirmedAppointment()
    }, [])

    const handleMeetingClick = (roomID) => {
        const url = `/zego/?roomID=${roomID}`;
        window.open(url, "_blank");
    };

    const viewBookingDetail = (evt, bookingId) => {
        evt.preventDefault();
        nav(`/appointmentdetail?bookingId=${bookingId}`)
    }

    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
    const handlePageChange = (pageNumber) => {
        // TODO: Xử lý sự kiện khi người dùng chuyển trang
        setSelectedPage(pageNumber);
        loadConfirmedAppointmentPage(pageNumber);
        console.log(`Chuyển đến trang ${pageNumber}`);
    };

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
                            <th>Chi tiết</th>
                            <th>Meeting</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(confirmedAppointment).map((ca, index) => {
                            const timeBegin = new Date(ca.scheduleId.timeSlotId?.timeBegin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            const timeEnd = new Date(ca.scheduleId.timeSlotId?.timeEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            return <>
                                <tr key={index}>
                                    <td>{ca.bookingId}</td>
                                    <td>{ca.profilePatientId.name}</td>
                                    <td>{moment(ca.scheduleId.date).format('DD-MM-YYYY')}</td>
                                    <td>{timeBegin} - {timeEnd}</td>
                                    <td><Badge bg="success">{ca.statusId.statusValue}</Badge></td>
                                    <td><Button variant="primary" onClick={(e) => viewBookingDetail(e, ca.bookingId)}><MdMenu /></Button></td>
                                    <td><Button variant="primary" onClick={() => handleMeetingClick(ca.linkVideoCall)}><FaVideo /></Button></td>
                                </tr>
                            </>
                        })}
                    </tbody>
                </Table>
                <Pagination pages={pages}
                    selectedPage={selectedPage}
                    handlePageChange={handlePageChange} />
            </div>
        </div>
    </>
}

export default ConfirmedAppointment;