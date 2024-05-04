import { useContext, useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { UserContext } from "../../App";
import { authApi, endpoints } from "../../configs/Apis";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import reminder from "../../assets/images/reminder.png"

const PrescriptionReminder = () => {
    const [current_user,] = useContext(UserContext)
    const [profilePatient, setProfilePatient] = useState([])
    const [selectedProfilePatient, setSelectedProfilePatient] = useState('')

    const [loading, setLoading] = useState(false);

    const [prescription, setPrescription] = useState([]);

    const [totalPrescriptionPages, setTotalPrescriptionPages] = useState('1');
    const [prescriptionList, setPrescriptionList] = useState([]);
    const [prescriptionDetail, setPrescriptionDetail] = useState([]);


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
            // let pageNumber = document.getElementsByClassName("active").id;
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

    useEffect(() => {
        viewPrescription()
    }, [selectedProfilePatient])

    // const profilePatientChange = (e) => {
    //     const selectedId = e.target.value;
    //     setSelectedProfilePatient(selectedId);
    // };

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
                                                    <Typography>Đơn thuốc: {pl.prescriptionId}</Typography>
                                                    <Typography>Chuẩn đoán: {pl.diagnosis}</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails className="Prescription_Detail">
                                                    <div className="Prescription_Detail_Inner">
                                                        <h4 className="text-center mb-3 mt-3">ĐƠN THUỐC {pl.prescriptionId}</h4>
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
                                                                    <span>{pl.prescriptionDate}</span>
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
                                                            <Button variant="primary">Tạo lịch nhắc</Button>
                                                        </div>
                                                    </div>
                                                </AccordionDetails>
                                            </Accordion>
                                        </>
                                    })}
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