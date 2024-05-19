import './PrescriptionHistory.css'
import reminder from "../../assets/images/reminder.png"
import { useContext, useEffect, useState } from "react";
import { BookingManagementContext } from "../../App";
import { authApi, endpoints } from '../../configs/Apis';
import { Button, Modal, Table } from 'react-bootstrap';

const PrescriptionHistory = () => {
    const [booking,] = useContext(BookingManagementContext);

    const [listPrescription, setListPrescription] = useState([]);
    const [prescriptionDetail, setPrescriptionDetail] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

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

    const loadPrescriptionDetail = (evt, lp) => {
        evt.preventDefault();
        const process = async () => {
            try {
                setShowModal(true);
                setLoading(true);
                // let res = await authApi().get(endpoints['prescription-detail-by-prescription-id'](pl.prescriptionId))
                let res = await authApi().get(endpoints['prescription-detail-reminder'](lp.prescriptionId))
                setPrescriptionDetail(res.data)
                console.log(res.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
        process();
    }

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
                                                    <td><Button variant="primary" onClick={(e) => loadPrescriptionDetail(e, lp)}>Chi tiết</Button></td>
                                                </tr>
                                            </>
                                        })}
                                    </tbody>
                                </Table>
                                {showModal && (
                                    <Modal fullscreen={true} show={showModal} onHide={() => { setShowModal(false) }}
                                        style={{ display: 'block', backgroundColor: 'rgba(0.0.0.0.5)', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, zIndex: 9999 }}
                                    >
                                        <Modal.Header closeButton>
                                            <Modal.Title>Thông tin đơn thuốc</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Table striped bordered hover>
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Tên thuốc</th>
                                                        <th>Chỉ định</th>
                                                        <th>Số lượng</th>
                                                        <th>Đơn giá</th>
                                                        <th>Thành tiền</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Object.values(prescriptionDetail).map(presd => {
                                                        // let tempTotal = 0;
                                                        // tempTotal += presd.prescriptionDetail.quantity * presd.prescriptionDetail.unitPrice
                                                        const timeReminderNames = presd.timeReminders.map(timeReminder => timeReminder.timeReminderId.timeReminderName);
                                                        return <>
                                                            <tr key={presd.prescriptionDetail.prescriptionDetailId}>
                                                                <td>{presd.prescriptionDetail.prescriptionDetailId}</td>
                                                                <td>{presd.prescriptionDetail.medicineName}</td>
                                                                <td>
                                                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'center' }}>
                                                                        <span>
                                                                            <input className="Remember_Check" type="checkbox" checked={timeReminderNames.includes('Sáng')} />
                                                                            Sáng
                                                                        </span>
                                                                        <span>
                                                                            <input className="Remember_Check" type="checkbox" checked={timeReminderNames.includes('Trưa')} />
                                                                            Trưa
                                                                        </span>
                                                                        <span>
                                                                            <input className="Remember_Check" type="checkbox" checked={timeReminderNames.includes('Chiều')} />
                                                                            Chiều
                                                                        </span>
                                                                        <span>
                                                                            <input className="Remember_Check" type="checkbox" checked={timeReminderNames.includes('Tối')} />
                                                                            Tối
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td>{presd.prescriptionDetail.quantity}</td>
                                                                <td>{presd.prescriptionDetail.unitPrice} VNĐ</td>
                                                                <td>{presd.prescriptionDetail.quantity * presd.prescriptionDetail.unitPrice} VNĐ</td>
                                                            </tr>
                                                        </>
                                                        // { tempTotal += presd.quantity * presd.unitPrice } {/* Cập nhật giá trị tempTotal */ }
                                                    })}
                                                </tbody>
                                            </Table>
                                            {/* <div className="Total_Prescription">
                                                <span><strong>Tổng tiền: </strong></span>
                                                <span>{tempTotal} VNĐ</span>
                                            </div> */}
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
                                        </Modal.Footer>
                                    </Modal>
                                )}
                            </div>
                        </>}
                </div>
            </div>
        </>
    )
}

export default PrescriptionHistory;