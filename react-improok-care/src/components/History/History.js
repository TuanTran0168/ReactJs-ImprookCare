import { useContext, useEffect, useState } from "react";
import { Badge, Button, Table } from "react-bootstrap";
import { UserContext } from "../../App";
import "./History.css";
import Apis, { authApi, endpoints } from "../../configs/Apis";
import profile404 from "../../assets/images/profile.png"
import printer from "../../assets/images/printer.png"
import profileicon from "../../assets/images/profile-icon.png"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast } from "react-toastify";
import reminder from "../../assets/images/reminder.png";
import Pagination from "../../utils/Pagination";
import moment from "moment"

const History = () => {
    const [current_user,] = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [prescription, setPrescription] = useState([]);
    const [profilePatient, setProfilePatient] = useState([]);
    const [selectedProfilePatientId, setSelectedProfilePatientId] = useState('');
    const [selectedProfile, setSelectedProfile] = useState();
    const [selectedPage, setSelectedPage] = useState('1');
    const [totalPrescriptionPages, setTotalPrescriptionPages] = useState('1');
    const [prescriptionList, setPrescriptionList] = useState([]);
    const [prescriptionDetail, setPrescriptionDetail] = useState([]);
    const [total, setTotal] = useState(null);

    const loadProfilePatient = async () => {
        try {
            let e = endpoints['load-profile-patient'](current_user?.userId)
            let res = await authApi().get(e)
            setProfilePatient(res.data.content);
            console.log(res.data.content);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadProfilePatient();
    }, [current_user?.userId])

    // const loadPrescriptionByProfilePatientId = async () => {
    //     try {
    //         setLoading(true);
    //         console.log(selectedProfilePatientId)
    //         let res = await authApi().get(endpoints['search-prescriptions'](selectedProfilePatientId))
    //         setPrescription(res.data);
    //         setLoading(false);
    //         console.log("Đây là userInfo");
    //         console.log(res.data);
    //         console.log(prescription);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // useEffect(() => {
    //     loadPrescriptionByProfilePatientId()
    // }, [selectedProfilePatientId])

    const loadPrescription = async () => {
        try {
            setLoading(true);
            let res = await authApi().get(endpoints['search-prescriptions'])
            setPrescriptionList(res.data.content);
            setTotalPrescriptionPages(res.data.totalPages);
            setLoading(false);
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const loadPrescriptionPage = async (pageNumber) => {
        // setSelectedProfilePatientId(pp.profilePatientId)
        try {
            setLoading(true);
            let e = `${endpoints['search-prescriptions']}?profilePatientId=${selectedProfile}`;
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

    const loadPrescriptionDetail = (evt, pl) => {
        evt.preventDefault();
        const process = async () => {
            try {
                setLoading(true);
                // let res = await authApi().get(endpoints['prescription-detail-by-prescription-id'](pl.prescriptionId))
                let res = await authApi().get(endpoints['prescription-detail-reminder'](pl.prescriptionId))
                setPrescriptionDetail(res.data)
                console.log(res.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
        process();
    }

    const viewPrescription = (evt, pp) => {
        evt.preventDefault();
        console.log(pp.profilePatientId)
        setSelectedProfile(pp.profilePatientId);
        // console.log(selectedProfile);

        const process = async () => {
            try {
                setLoading(true);
                let e = endpoints['search-prescriptions'];
                // let pageNumber = document.getElementsByClassName("active").id;
                console.log(pp.profilePatientId)
                if (pp.profilePatientId !== null) {
                    e = `${e}?profilePatientId=${pp.profilePatientId}`
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
        process();
    }

    const prescriptionPages = Array.from({ length: totalPrescriptionPages }, (_, index) => index + 1);
    const handlePrescriptionPageChange = (pageNumber) => {
        setSelectedPage(pageNumber);
        loadPrescriptionPage(pageNumber);
        console.log(`Chuyển đến trang ${pageNumber}`);
    };

    const prescriptionPayment = (evt, tempTotal, profilePatientName, prescriptionId) => {
        evt.preventDefault();

        const process = async () => {
            try {
                setLoading(true);
                console.log(tempTotal);
                let res = await Apis.post(endpoints['vnpay-payment'], {
                    "amount": tempTotal,
                    "orderInfor": "2:-" + prescriptionId + "-Medicine Payment: " + profilePatientName + " đã thanh toán tiền thuốc cho đơn thuốc " + prescriptionId + " - ",
                    "returnUrl": "http://localhost:3000/paymentResult"
                });
                window.location.href = res.data;
                // toast.success(res.data);
                setLoading(false);
                console.log(res.data);
            } catch (error) {
                toast.error(error);
                console.log(error);
            }
        }
        process();
    }

    useEffect(() => {
        loadPrescription();
    }, [])

    return <>
        <div className="History_Wrapper">
            <div className="History">
                {/* <div className="History_Left">
                    <div className="History_Left_Content">
                        <UserMenu />
                    </div>
                </div> */}
                <div className="History_Middle">
                    <div className="History_Middle_Header">
                        <h3>Lịch sử đơn thuốc</h3>
                    </div>
                    <div className="History_Middle_Content">
                        <div className="History_Middle_Container">
                            <div className="History_Middle_Info">
                                <input type="text" placeholder="Nhập tên hồ sơ cần tìm..."></input>
                                <div className="History_List">
                                    {profilePatient.length === 0 ? <>
                                        <div className="History_List_404">
                                            <img src={printer} alt="404" width={'20%'} />
                                            <span>Không tìm thấy kết quả</span>
                                        </div>
                                    </> : <>
                                        <div className="History_List_Info">
                                            <ul>
                                                {Object.values(profilePatient).map(pp => {
                                                    return <>
                                                        <div className="History_List_Detail" value={selectedProfile} onClick={(e) => viewPrescription(e, pp)}>
                                                            <img src={profileicon} alt="profileicon" width={'20%'} />
                                                            <li key={pp.profilePatientId} value={pp.profilePatientId}>{pp.name}</li>
                                                        </div>
                                                    </>
                                                })}
                                            </ul>
                                        </div>
                                    </>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="History_Right">
                    <>
                        <section>
                            <div className="History_Right_Header"><h3 className="text-center mb-4">Thông tin đơn thuốc</h3></div>
                            <div className="History_Right_Content">
                                {profilePatient === null ? <>
                                    <div className="History_Null">
                                        <h5 className="mb-4">Chọn đơn thuốc cần xem</h5>
                                        <img src={profile404} alt="Not found" width={'20%'} />
                                    </div>
                                </> :
                                    <>
                                        <div>
                                            {prescriptionList.length === 0 ? <>
                                                <div className="Appointment_Null">
                                                    <h5 className="mb-4">Không tìm thấy đơn thuốc</h5>
                                                    <img src={reminder} alt="Not found" width={'20%'} />
                                                </div>
                                            </> :
                                                <>
                                                    {Object.values(prescriptionList).map(pl => {
                                                        let tempTotal = 0;
                                                        return <>
                                                            <Accordion>
                                                                <AccordionSummary
                                                                    expandIcon={<ExpandMoreIcon />}
                                                                    aria-controls="panel1a-content"
                                                                    id="panel1a-header"
                                                                    className="Prescription_Item"
                                                                    onClick={(e) => loadPrescriptionDetail(e, pl)}>
                                                                    <Typography sx={{ width: '33%', flexShrink: 0 }}>Bác sĩ: {pl.bookingId.scheduleId.profileDoctorId.name}</Typography>
                                                                    <Typography><Badge bg="primary">{pl.diagnosis}</Badge></Typography>
                                                                    {/* {(pl.medicinePaymentStatusId.medicinePaymentStatusId === 2 && pl.servicePaymentStatusId.servicePaymentStatusId === 2) ?
                                                                        <>
                                                                            <Typography><Badge bg="success">Đã thanh toán</Badge></Typography>
                                                                        </> : <>
                                                                            <Typography><Badge bg="danger">Chưa thanh toán</Badge></Typography>
                                                                        </>} */}
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
                                                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                    {pl.medicinePaymentStatusId.medicinePaymentStatusId === 1 ? <span><strong>Tiền thuốc: </strong><Badge bg="danger"> Chưa thanh toán</Badge></span> : <span><strong>Tiền thuốc: </strong><Badge bg="success"> Đã thanh toán</Badge></span>}
                                                                                    {/* {pl.servicePaymentStatusId.servicePaymentStatusId === 1 ? <span><strong>Tiền khám: </strong><Badge bg="danger"> Chưa thanh toán</Badge></span> : <span><strong>Tiền khám: </strong><Badge bg="success"> Đã thanh toán</Badge></span>} */}
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
                                                                                {/* {Object.values(prescriptionDetail).forEach((presd) => {
                                                                                    tempTotal += presd.quantity * presd.unitPrice;
                                                                                })} */}
                                                                                {Object.values(prescriptionDetail).map(presd => {
                                                                                    tempTotal += presd.prescriptionDetail.quantity * presd.prescriptionDetail.unitPrice
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
                                                                        <div className="Total_Prescription">
                                                                            <span><strong>Tổng tiền: </strong></span>
                                                                            <span>{tempTotal} VNĐ</span>
                                                                        </div>
                                                                        <div className="Payment_Button">
                                                                            {pl.medicinePaymentStatusId.medicinePaymentStatusId === 1 ? <Button variant="warning" onClick={(e) => prescriptionPayment(e, tempTotal, pl.bookingId.profilePatientId.name, pl.prescriptionId)}>Thanh toán tiền thuốc</Button> : <Button variant="secondary" style={{ cursor: "not-allowed" }}>Thanh toán tiền thuốc</Button>}
                                                                        </div>
                                                                    </div>
                                                                </AccordionDetails>
                                                            </Accordion>
                                                        </>
                                                    })}
                                                    <Pagination pages={prescriptionPages}
                                                        selectedPage={selectedPage}
                                                        handlePageChange={handlePrescriptionPageChange} />
                                                </>
                                            }
                                        </div>
                                    </>}
                            </div>
                        </section>
                    </>
                </div>
            </div>
        </div >
    </>
}

export default History;