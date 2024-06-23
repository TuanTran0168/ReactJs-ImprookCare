import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { Badge, Button, Table } from "react-bootstrap";
import { authApi, endpoints } from "../../configs/Apis";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { MdMenu } from "react-icons/md";
import Pagination from "../../utils/Pagination"

const DeniedAppointment = () => {
    const [deniedAppointment, setDeniedAppointment] = useState([]);
    const [current_user,] = useContext(UserContext);
    const [totalPages, setTotalPages] = useState('1');
    const [selectedPage, setSelectedPage] = useState('1');

    const nav = useNavigate();
    // const [selectedBookingId, setSelectedBookingId] = useState("");
    // const [selectedProfilePatientName, setSelectedProfilePatientName] = useState("");
    const [loading, setLoading] = useState(false);

    const loadDeniedAppointment = async () => {
        try {
            let e = endpoints['booking-user-view-page']
            e += "?pageNumber=0"
            console.log(e)
            let res = await authApi().post(e, {
                "userId": current_user?.userId,
                "bookingStatusId": "3"
            })
            console.log(res.data.content)
            setDeniedAppointment(res.data.content)
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.log(error)
        }
    }

    const loadDeniedAppointmentPage = async (pageNumber) => {
        try {
            setLoading(true);
            let e = endpoints['booking-user-view-page']
            e += `?pageNumber=${pageNumber - 1}`
            console.log(e)

            let res = await authApi().post(e, {
                "userId": current_user?.userId,
                "bookingStatusId": "3"
            })
            setDeniedAppointment(res.data.content)
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
        loadDeniedAppointment()
    }, [])

    const viewBookingDetail = (evt, bookingId) => {
        evt.preventDefault();
        nav(`/appointmentdetail?bookingId=${bookingId}`)
    }

    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
    const handlePageChange = (pageNumber) => {
        // TODO: Xử lý sự kiện khi người dùng chuyển trang
        setSelectedPage(pageNumber);
        loadDeniedAppointmentPage(pageNumber);
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
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(deniedAppointment).map((da, index) => {
                            const timeBegin = new Date(da.scheduleId.timeSlotId?.timeBegin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            const timeEnd = new Date(da.scheduleId.timeSlotId?.timeEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            return <>
                                <tr key={index}>
                                    <td>{da.bookingId}</td>
                                    <td>{da.profilePatientId.name}</td>
                                    <td>{moment(da.scheduleId.date).format('DD-MM-YYYY')}</td>
                                    <td>{timeBegin} - {timeEnd}</td>
                                    <td><Badge bg="danger">{da.statusId.statusValue}</Badge></td>
                                    <td><Button variant="primary" onClick={(e) => viewBookingDetail(e, da.bookingId)}><MdMenu /></Button></td>
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

export default DeniedAppointment;