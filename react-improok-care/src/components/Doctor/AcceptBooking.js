import { useContext, useEffect, useState } from "react";
import { UserContext, BookingManagementContext } from "../../App";
import { Badge, Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import cookie from "react-cookies"
import Apis, { authApi, endpoints } from "../../configs/Apis";
import moment from "moment";

const AcceptBooking = (props) => {
    const [allowBooking, setAllowBooking] = useState([]);
    const [current_user,] = useContext(UserContext);
    const [booking, dispatchBooking] = useContext(BookingManagementContext)
    const [bookingInfo, setBookingInfo] = useState({
        bookingId: null,
        profilePatientName: null,
        profileDoctorName: null,
        bookingPrice: null
    })
    const [profileDoctor, setProfileDoctor] = useState();
    const [selectedBookingId, setSelectedBookingId] = useState("");
    const [selectedProfilePatientName, setSelectedProfilePatientName] = useState("");
    const [loading, setLoading] = useState(false);

    const removePres = () => {
        cookie.remove("pres");
    }

    const loadAllowBooking = async () => {
        try {
            let res = await authApi().post(endpoints['booking-doctor-view-page'], {
                "profileDoctorId": props.profileDoctorId,
                "bookingStatusId": "2",
                "pageNumber": "0"
            })
            console.log(res.data.content)
            setAllowBooking(res.data.content)
        } catch (error) {
            console.log(error)
        }
    }

    const handleCreatePrescription = (e, bookingId, profilePatientName, profilePatientId, profileDoctorId) => {
        setSelectedBookingId(bookingId);
        setSelectedProfilePatientName(profilePatientName);
        loadDoctorById();
        console.log(bookingId)
        console.log(profilePatientName)
        console.log(selectedBookingId);
        console.log(selectedProfilePatientName);
        const updatedBookingInfo = {
            bookingId: bookingId,
            profilePatientId: profilePatientId,
            profileDoctorId: profileDoctorId,
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

    useEffect(() => {
        loadAllowBooking()
    }, [props.profileDoctorId])

    const loadDoctorById = async () => {
        try {
            setLoading(true);
            console.log(props.profileDoctorId)
            let res = await Apis.get(endpoints['load-profile-doctor-by-Id'](props.profileDoctorId))
            setProfileDoctor(res.data);
            setLoading(false);
            console.log("Đây là userInfo");
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleMeetingClick = (roomID) => {
        const url = `/zego/?roomID=${roomID}`;
        window.open(url, "_blank");
    };

    useEffect(() => {
        loadDoctorById()
    }, [props.profileDoctorId])

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
                            <th>Meeting</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(allowBooking).map((ab, index) => {
                            const timeBegin = new Date(ab[3]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            const timeEnd = new Date(ab[4]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            const name = ab[6];
                            return <>
                                <tr key={index}>
                                    <td>{ab[0]}</td>
                                    <td>{name}</td>
                                    <td>{moment(ab[2]).format('DD-MM-YYYY')}</td>
                                    <td>{timeBegin} - {timeEnd}</td>
                                    <td><Badge bg="success">{ab[5]}</Badge></td>
                                    {/* <td><Button variant="primary" onClick={(e) => handleCreatePrescription(e, bl[0], bl[6])}>
                                                    <Link to={`/prescription/?bookingId=${bl[0]}&&profilePatientName=${bl[6]}&&profileDoctorName=${profileDoctor.name}&&bookingPrice=${profileDoctor.bookingPrice}`}>Tạo đơn thuốc</Link></Button></td> */}
                                    <td><Button variant="primary" onClick={(e) => handleCreatePrescription(e, ab[0], ab[6], ab[10].profilePatientId, ab[11].profileDoctorId)}><Link to='/doctor/examination/prescription' class="toPrescription" onClick={() => removePres()}>Đơn thuốc</Link></Button></td>
                                    {/* <td><Button variant="primary"><Link to={`/zego/?roomID=${ab[9]}`} class="toPrescription">Meeting</Link></Button></td> */}
                                    <td><Button variant="primary" onClick={() => handleMeetingClick(ab[9])}>Meeting</Button></td>
                                </tr>
                            </>
                        })}
                    </tbody>
                </Table>
            </div>
        </div>
    </>
}

export default AcceptBooking;