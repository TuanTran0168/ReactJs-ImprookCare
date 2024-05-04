import './PrescriptionHistory.css'
import reminder from "../../assets/images/reminder.png"
import { useContext, useEffect, useState } from "react";
import { BookingManagementContext } from "../../App";
import { authApi, endpoints } from '../../configs/Apis';
import { Button, Table } from 'react-bootstrap';

const PrescriptionHistory = () => {
    const [booking,] = useContext(BookingManagementContext);

    const [listPrescription, setListPrescription] = useState([]);

    useEffect(() => {
        const loadPrescriptionHistory = async () => {
            try {
                console.log(booking.profilePatientId)
                let e = endpoints['search-prescriptions']
                e += `?profilePatientId=${booking.profilePatientId}`
                let res = await authApi().get(e)
                console.log(res.data.content)
                setListPrescription(res.data.content)
            } catch (error) {
                console.log(error)
            }
        }
        loadPrescriptionHistory()
    }, [])

    return (
        <>
            <div className='prescription_history_wrapper'>
                <div>
                    {listPrescription.length === 0 ?
                        <>
                            <div className="prescription_history_null">
                                <h5 className="mb-4">Bệnh nhân này chưa có đơn thuốc nào</h5>
                                <img src={reminder} alt="Not found" width={'20%'} />
                            </div>
                        </> :
                        <>
                            <div>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Tên bệnh nhân</th>
                                            <th>Triệu chứng</th>
                                            <th>Chẩn đoán</th>
                                            <th>Chuyên khoa</th>
                                            <th>Bác sĩ</th>
                                            <th>Ngày khám</th>
                                            <th>Khung giờ</th>
                                            <th>Chi tiết</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.values(listPrescription).map(lp => {
                                            const timeBegin = new Date(lp.bookingId.scheduleId.timeSlotId.timeBegin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                            const timeEnd = new Date(lp.bookingId.scheduleId.timeSlotId.timeEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                            return <>
                                                <tr key={lp.prescriptionId}>
                                                    <td>{lp.prescriptionId}</td>
                                                    <td>{lp.bookingId.profilePatientId.name}</td>
                                                    <td>{lp.symptoms}</td>
                                                    <td>{lp.diagnosis}</td>
                                                    <td>{lp.bookingId.scheduleId.profileDoctorId.specialtyId.specialtyName}</td>
                                                    <td>{lp.bookingId.scheduleId.profileDoctorId.name}</td>
                                                    <td>{lp.bookingId.scheduleId.date}</td>
                                                    <td>{timeBegin} - {timeEnd}</td>
                                                    <td><Button variant="primary">Chi tiết</Button></td>
                                                </tr>
                                            </>
                                        })}
                                    </tbody>
                                </Table>
                            </div>
                        </>}
                </div>
            </div>
        </>
    )
}

export default PrescriptionHistory;