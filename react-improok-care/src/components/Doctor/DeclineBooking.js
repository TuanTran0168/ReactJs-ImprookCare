import { useEffect, useState } from "react";
import { Badge, Table } from "react-bootstrap";
import { authApi, endpoints } from "../../configs/Apis";
import moment from "moment"

const DeclineBooking = (props) => {
    const [declineBooking, setDeclineBooking] = useState([]);
    const loadDeclineBooking = async () => {
        try {
            let res = await authApi().post(endpoints['booking-doctor-view-page'], {

                "profileDoctorId": props.profileDoctorId,
                "bookingStatusId": "3",
                "pageNumber": "0"
            })
            console.log(res.data.content)
            setDeclineBooking(res.data.content)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadDeclineBooking()
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
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(declineBooking).map((db, index) => {
                            const timeBegin = new Date(db[3]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            const timeEnd = new Date(db[4]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            return <>
                                <tr key={index}>
                                    <td>{db[0]}</td>
                                    <td>{db[6]}</td>
                                    <td>{moment(db[2]).format('DD-MM-YYYY')}</td>
                                    <td>{timeBegin} - {timeEnd}</td>
                                    <td><Badge bg="danger">Đã {db[5]}</Badge></td>
                                </tr>
                            </>
                        })}
                    </tbody>
                </Table>
            </div>
        </div>
    </>
}

export default DeclineBooking;