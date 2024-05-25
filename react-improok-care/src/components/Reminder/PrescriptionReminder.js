import { useContext, useEffect, useState } from "react";
import { Button, Form, Table, Modal, Badge } from "react-bootstrap";
import { UserContext } from "../../App";
import { authApi, endpoints } from "../../configs/Apis";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import reminder from "../../assets/images/reminder.png"
import moment from "moment";
import Swal from "sweetalert2";
import Pagination from "../../utils/Pagination";

const PrescriptionReminder = () => {
    const [current_user,] = useContext(UserContext)
    const [profilePatient, setProfilePatient] = useState([])
    const [selectedProfilePatient, setSelectedProfilePatient] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false);
    const [totalPrescriptionPages, setTotalPrescriptionPages] = useState('1');
    const [prescriptionList, setPrescriptionList] = useState([]);
    const [prescriptionDetail, setPrescriptionDetail] = useState([]);
    const [medicalReminder, setMedicalReminder] = useState([])
    const [medicineName, setMedicineName] = useState('');
    const [email, setEmail] = useState('');
    const [medicineTime, setMedicineTime] = useState([]);
    const [startDate, setStartDate] = useState([]);
    const [selectedPage, setSelectedPage] = useState('1');

    const currentDate = new Date();
    const currentFormattedDate = currentDate.toISOString().split('T')[0];
    // const currentTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const loadProfilePatient = async () => {
        try {
            let e = endpoints['load-profile-patient'](current_user?.userId)
            let res = await authApi().get(e)
            setProfilePatient(res.data.content);
            setSelectedProfilePatient(res.data.content[0].profilePatientId)
            console.log(res.data.content);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadProfilePatient()
    }, [])

    const viewPrescription = async () => {
        try {
            setLoading(true);
            let e = endpoints['search-prescriptions'];
            console.log(selectedProfilePatient)
            if (selectedProfilePatient !== null) {
                e = `${e}?profilePatientId=${selectedProfilePatient}`
            }
            // let url = `/users/${pageNumber}`
            let res = await authApi().get(e);
            setPrescriptionList(res.data.content);
            setTotalPrescriptionPages(res.data.totalPages);
            console.log(res.data.content)
            console.log(e);
            // navigate(url);
            setLoading(false);
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const viewPrescriptionPage = async (pageNumber) => {
        // setSelectedProfilePatientId(pp.profilePatientId)
        try {
            setLoading(true);
            let e = `${endpoints['search-prescriptions']}?profilePatientId=${selectedProfilePatient}`;
            // let pageNumber = document.getElementsByClassName("active").id;
            console.log(pageNumber)
            if (pageNumber !== null && !isNaN(pageNumber)) {
                e += `&pageNumber=${pageNumber - 1}`
            }
            else {
                e += `?`
            }
            // let url = `/users/${pageNumber}`
            let res = await authApi().get(e);
            setPrescriptionList(res.data.content);
            setTotalPrescriptionPages(res.data.totalPages);
            console.log(e);
            // navigate(url);
            setLoading(false);
            console.log(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    const prescriptionPages = Array.from({ length: totalPrescriptionPages }, (_, index) => index + 1);
    const handlePrescriptionPageChange = (pageNumber) => {
        setSelectedPage(pageNumber);
        viewPrescriptionPage(pageNumber);
        console.log(`Chuyển đến trang ${pageNumber}`);
    };

    useEffect(() => {
        if (selectedProfilePatient)
            viewPrescription()
    }, [selectedProfilePatient])

    const loadPrescriptionDetail = async (pl) => {
        try {
            setLoading(true);
            let res = await authApi().get(endpoints['prescription-detail-reminder'](pl.prescriptionId))
            setPrescriptionDetail(res.data)
            console.log(res.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    const loadMedicalReminder = async (pl) => {
        try {
            let res = await authApi().get(endpoints['medical-reminder'](pl.prescriptionId))
            setMedicalReminder(res.data);
            console.log(res.data);
            setShowModal(true)
        } catch (error) {
            console.log(error);
        }
    }

    // const addMedicalSchedule = async () => {
    //     try {
    //         const medicalReminderData = [];
    //         Object.values(medicalReminder).forEach((mr, index) => {
    //             const startDates = startDate[index] || currentFormattedDate;
    //             // console.log(medicineTime)
    //             const reminder = new Date(mr.timeReminderId.timeReminderValue)
    //             // const year = reminder.getFullYear();
    //             // const month = String(reminder.getMonth() + 1).padStart(2, '0');
    //             // const day = String(reminder.getDate()).padStart(2, '0');
    //             const hours = String(reminder.getHours()).padStart(2, '0');
    //             const minutes = String(reminder.getMinutes()).padStart(2, '0');
    //             // const seconds = String(reminder.getSeconds()).padStart(2, '0');
    //             const formattedDate = `${hours}:${minutes}`;
    //             const reminderTime = medicineTime[index] || formattedDate

    //             const data = {
    //                 medicalReminderId: mr.medicalReminderId,
    //                 customTime: `${startDates} ${reminderTime}:00`,
    //                 startDate: startDates,
    //                 medicineName: mr.prescriptionDetailId.medicineId.medicineName,
    //                 email: mr.prescriptionDetailId.prescriptionId.bookingId.profilePatientId.email
    //             };
    //             medicalReminderData.push(data);
    //         });
    //         console.log(medicalReminderData)
    //         // medicalReminderData.forEach(async (m) => {
    //         //     let res = await authApi().post(endpoints['add-medical-schedule'], {
    //         //         medicalReminderId: m.medicalReminderId,
    //         //         startDate: m.startDate,
    //         //         customTime: m.customTime
    //         //     });
    //         //     console.log(res.data)
    //         // });
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const addMedicalSchedule = async () => {
        try {
            let medicalReminderData = [];
            Object.values(medicalReminder).forEach((mr, index) => {
                const startDates = startDate[index] || currentFormattedDate;
                // console.log(medicineTime)
                const reminder = new Date(mr.timeReminderId.timeReminderValue)
                const hours = String(reminder.getHours()).padStart(2, '0');
                const minutes = String(reminder.getMinutes()).padStart(2, '0');
                const formattedDate = `${hours}:${minutes}`;
                const reminderTime = medicineTime[index] || formattedDate

                const data = {
                    medicalReminderId: mr.medicalReminderId.toString(),
                    customTime: `${startDates} ${reminderTime}:00`,
                    startDate: startDates,
                    medicineName: mr.prescriptionDetailId.medicineId.medicineName,
                    email: mr.prescriptionDetailId.prescriptionId.bookingId.profilePatientId.email,
                    userId: current_user?.userId.toString()
                };
                medicalReminderData.push(data);
            });
            console.log(medicalReminderData)
            let res = await authApi().post(endpoints['add-list-medical-schedule'], medicalReminderData);
            console.log(res.data)
            medicalReminderData = [];
            setShowModal(false)
            Swal.fire(
                'Thành công', "Tạo nhắc uống thuốc thành công!", 'success'
            );
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className="prescription-reminder-wrapper">
                <div className="prescription-reminder">
                    <div>
                        <h5>Chọn hồ sơ</h5>
                        <div>
                            <Form.Select className="test-choice-select" value={selectedProfilePatient} name="testChoice" onChange={(e) => setSelectedProfilePatient(e.target.value)}>
                                {Object.values(profilePatient).map(pp => <option key={pp.profilePatientId} value={pp.profilePatientId}>{pp.name}</option>)}
                            </Form.Select>
                        </div>
                    </div>
                    <div>
                        <h5>Danh sách đơn thuốc</h5>
                        <div>
                            {prescriptionList.length === 0 ? <>
                                <div className="Appointment_Null">
                                    <h5 className="mb-4">Không tìm thấy đơn thuốc</h5>
                                    <img src={reminder} alt="Not found" width={'20%'} />
                                </div>
                            </> :
                                <>
                                    {Object.values(prescriptionList).map(pl => {
                                        return <>
                                            <Accordion>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                    aria-controls="panel1a-content"
                                                    id="panel1a-header"
                                                    className="Prescription_Item"
                                                    onClick={() => loadPrescriptionDetail(pl)}>
                                                    <Typography sx={{ width: '33%', flexShrink: 0 }}>Bác sĩ: {pl.bookingId.scheduleId.profileDoctorId.name}</Typography>
                                                    <Typography sx={{ fontSize: '18' }}><Badge bg="primary">{pl.diagnosis}</Badge></Typography>
                                                </AccordionSummary>
                                                <AccordionDetails className="Prescription_Detail">
                                                    <div className="Prescription_Detail_Inner">
                                                        <h4 className="text-center mb-3 mt-3">Đơn thuốc</h4>
                                                        <div className="Prescription_Infomation">
                                                            <div className="Diagonsis_Symptoms">
                                                                <div>
                                                                    <span><strong>Bác sĩ: </strong></span>
                                                                    <span>{pl.bookingId.scheduleId.profileDoctorId.name}</span>
                                                                </div>
                                                                <div>
                                                                    <span><strong>Triệu chứng: </strong></span>
                                                                    <span>{pl.symptoms}</span>
                                                                </div>
                                                                <div>
                                                                    <span><strong>Tiền khám: </strong></span>
                                                                    <span>{pl.servicePrice} VNĐ</span>
                                                                </div>
                                                            </div>
                                                            <div className="Service_Price">
                                                                <div>
                                                                    <span><strong>Bệnh nhân: </strong></span>
                                                                    <span>{pl.bookingId.profilePatientId.name}</span>
                                                                </div>
                                                                <div>
                                                                    <span><strong>Chuẩn đoán: </strong></span>
                                                                    <span>{pl.diagnosis}</span>
                                                                </div>
                                                                <div>
                                                                    <span><strong>Ngày khám: </strong></span>
                                                                    <span>{moment(pl.prescriptionDate).format('DD-MM-YYYY')}</span>
                                                                </div>
                                                            </div>
                                                        </div>
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
                                                                })}
                                                            </tbody>
                                                        </Table>
                                                        <div className="Payment_Button">
                                                            <Button variant="primary" onClick={() => loadMedicalReminder(pl)}>Tạo lịch nhắc</Button>
                                                        </div>
                                                    </div>
                                                </AccordionDetails>
                                            </Accordion>
                                        </>
                                    })}
                                    <Pagination pages={prescriptionPages}
                                        selectedPage={selectedPage}
                                        handlePageChange={handlePrescriptionPageChange} />
                                    {showModal && (
                                        <Modal fullscreen={true} show={showModal} onHide={() => setShowModal(false)}
                                            style={{ display: 'block', backgroundColor: 'rgba(0.0.0.0.5)', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, zIndex: 9999 }}
                                        >
                                            <Modal.Header closeButton>
                                                <Modal.Title>Nhắc uống thuốc</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <div className="Profile_Right_Content">
                                                    {Object.values(medicalReminder).map((mr, index) => {
                                                        const reminder = new Date(mr.timeReminderId.timeReminderValue)
                                                        const reminderTime = reminder.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                                        return (
                                                            <>
                                                                <div className="Profile_Name">
                                                                    <Form.Label style={{ width: "30%" }}>Tên thuốc</Form.Label>
                                                                    <Form.Control value={mr.prescriptionDetailId.medicineId.medicineName} placeholder="Tên thuốc" disabled />
                                                                </div>
                                                                <div className="Profile_Phonenumber">
                                                                    <Form.Label style={{ width: "30%" }}>Thời gian uống</Form.Label>
                                                                    <Form.Control type="Time" defaultValue={reminderTime}
                                                                        onChange={(e) => {
                                                                            const updateMedicineTime = [...medicineTime];
                                                                            updateMedicineTime[index] = e.target.value;
                                                                            setMedicineTime(updateMedicineTime)
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="Profile_Email">
                                                                    <Form.Label style={{ width: "30%" }}>Ngày bắt đầu</Form.Label>
                                                                    <Form.Control type="Date" id="doB"
                                                                        defaultValue={startDate[index] || currentFormattedDate}
                                                                        onChange={(e) => {
                                                                            const updatedStartDates = [...startDate];
                                                                            updatedStartDates[index] = e.target.value;
                                                                            setStartDate(updatedStartDates);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="Profile_Email">
                                                                    <Form.Label style={{ width: "30%" }}>Email</Form.Label>
                                                                    <Form.Control type="text" defaultValue={mr.prescriptionDetailId.prescriptionId.bookingId.profilePatientId.email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" disabled />
                                                                </div>
                                                            </>
                                                        )
                                                    })}
                                                </div>
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
                                                <Button variant="primary" onClick={() => addMedicalSchedule()}>Lưu</Button>
                                            </Modal.Footer>
                                        </Modal>
                                    )}
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PrescriptionReminder;