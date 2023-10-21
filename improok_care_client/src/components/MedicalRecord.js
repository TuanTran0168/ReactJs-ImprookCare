import { useContext, useEffect, useState } from "react";
import { Badge, Button, Form, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { MyUserContext } from "../App";
import "../styles/MedicalRecords.css";
import Apis, { authApi, endpoints } from "../configs/Apis";
import profile404 from "../assests/images/profile.png"
import printer from "../assests/images/printer.png"
import profileicon from "../assests/images/profile-icon.png"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast } from "react-toastify";

const MedicalRecord = () => {
    const [current_user, dispatch] = useContext(MyUserContext);
    const nav = useNavigate();
    const logout = () => {
        dispatch({
            "type": "logout"
        })
        nav("/")
    }

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

    // const [requestBody, setRequestBody] = useState({
    //     "amount": "10000",
    //     "orderInfor": "Tuan Tran rich kid VN pay",
    //     "returnUrl": "http://localhost:3000/medicalrecord"
    // })
    // let tempTotal = 0;
    const loadProfilePatient = async () => {
        try {
            let res = await authApi().get(endpoints['load-profile-patient'](current_user.userId))
            setProfilePatient(res.data);
            console.log(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadProfilePatient();
    }, [current_user.userId])

    const profilePatientChange = (e) => {
        const selectedId = e.target.value;
        setSelectedProfilePatientId(selectedId);
    };

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
                let res = await authApi().get(endpoints['prescription-detail-by-prescription-id'](pl.prescriptionId))
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
        console.log("pp" + pp.profilePatientId)
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
        // TODO: Xử lý sự kiện khi người dùng chuyển trang
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
                // console.log(requestBody)
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

    const servicePayment = (evt, servicePrice, profilePatientName, prescriptionId) => {
        evt.preventDefault();

        const process = async () => {
            try {
                setLoading(true);
                console.log(servicePrice);
                // console.log(requestBody)
                let res = await Apis.post(endpoints['vnpay-payment'], {
                    "amount": servicePrice,
                    "orderInfor": "1:-" + prescriptionId + "-Service Payment: " + profilePatientName + " đã thanh toán tiền khám cho đơn thuốc " + prescriptionId + " - ",
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

    // useEffect(() => {
    //     loadPrescription();
    //     loadPrescriptionPage();
    // }, [])

    return <>
        <div class="MedicalRecords_Wrapper">
            <div class="MedicalRecords">
                <div class="MedicalRecords_Left">
                    <div class="MedicalRecords_Left_Content">
                        <ul>
                            <li><Link to="/personalpage">Thông tin cá nhân</Link></li>
                            {/* <li><Link to="/changepassword">Đổi mật khẩu</Link></li> */}
                            <li><Link to="/appointment">Lịch khám</Link></li>
                            <li><Link to="/medicalrecord">Lịch sử khám</Link></li>
                            <li><Link to="/profile">Hồ sơ</Link></li>
                            <li><Link to="/message">Tin nhắn</Link></li>
                            <li onClick={logout}>Đăng xuất</li>
                        </ul>
                    </div>
                </div>
                <div class="MedicalRecords_Middle">
                    <div class="MedicalRecords_Middle_Header">
                        <h3>Lịch sử khám</h3>
                    </div>
                    <div class="MedicalRecords_Middle_Content">
                        <div class="MedicalRecords_Middle_Container">
                            <div class="MedicalRecords_Middle_Info">
                                <input type="text" placeholder="Nhập chuẩn đoán, triệu chứng..."></input>
                                <div class="MedicalRecords_List">
                                    {profilePatient.length === 0 ? <>
                                        <div class="MedicalRecords_List_404">
                                            <img src={printer} alt="404" width={'20%'} />
                                            <span>Không tìm thấy kết quả</span>
                                        </div>
                                    </> : <>
                                        <div class="MedicalRecords_List_Info">
                                            <ul>
                                                {Object.values(profilePatient).map(pp => {
                                                    return <>
                                                        <div class="MedicalRecords_List_Detail" value={selectedProfile} onClick={(e) => viewPrescription(e, pp)}>
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
                <div class="MedicalRecords_Right">
                    <>
                        <section>
                            <div class="MedicalRecords_Right_Header"><h3 className="text-center text-success mb-4">Danh sách đơn thuốc</h3></div>
                            <div class="MedicalRecords_Right_Content">
                                {profilePatient === null ? <>
                                    <div class="MedicalRecords_Null">
                                        <h5 className="mb-4">Chọn đơn thuốc cần xem</h5>
                                        <img src={profile404} alt="Not found" width={'20%'} />
                                    </div>
                                </> :
                                    <>
                                        <div>
                                            {prescriptionList.length === 0 ? <>
                                                <div>
                                                    <span>Không tìm thấy đơn thuốc</span>
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
                                                                    class="Prescription_Item"
                                                                    onClick={(e) => loadPrescriptionDetail(e, pl)}
                                                                >
                                                                    <Typography>Đơn thuốc: {pl.prescriptionId}</Typography>
                                                                    <Typography>Chuẩn đoán: {pl.diagnosis}</Typography>
                                                                    {(pl.medicinePaymentStatusId.medicinePaymentStatusId === 2 && pl.servicePaymentStatusId.servicePaymentStatusId === 2) ?
                                                                        <>
                                                                            <Typography><Badge bg="success">Đã thanh toán</Badge></Typography>
                                                                        </> : <>
                                                                            <Typography><Badge bg="danger">Chưa thanh toán</Badge></Typography>
                                                                        </>}

                                                                </AccordionSummary>
                                                                <AccordionDetails class="Prescription_Detail">
                                                                    <div class="Prescription_Detail_Inner">
                                                                        <h4 className="text-center mb-3 mt-3">ĐƠN THUỐC {pl.prescriptionId}</h4>
                                                                        <div class="Prescription_Infomation">
                                                                            <div class="Diagonsis_Symptoms">
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
                                                                            <div class="Service_Price">
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
                                                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                    {pl.medicinePaymentStatusId.medicinePaymentStatusId === 1 ? <span><strong>Tiền thuốc: </strong><Badge bg="danger"> Chưa thanh toán</Badge></span> : <span><strong>Tiền thuốc: </strong><Badge bg="success"> Đã thanh toán</Badge></span>}
                                                                                    {pl.servicePaymentStatusId.servicePaymentStatusId === 1 ? <span><strong>Tiền khám: </strong><Badge bg="danger"> Chưa thanh toán</Badge></span> : <span><strong>Tiền khám: </strong><Badge bg="success"> Đã thanh toán</Badge></span>}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <Table striped bordered hover>
                                                                            <thead>
                                                                                <tr>
                                                                                    <th>#</th>
                                                                                    <th>Tên thuốc</th>
                                                                                    <th>Hướng dẫn sử dụng</th>
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
                                                                                    tempTotal += presd.quantity * presd.unitPrice
                                                                                    return <>
                                                                                        <tr key={presd.prescriptionDetailId}>
                                                                                            <td>{presd.prescriptionDetailId}</td>
                                                                                            <td>{presd.medicineName}</td>
                                                                                            <td>{presd.usageInstruction}</td>
                                                                                            <td>{presd.quantity}</td>
                                                                                            <td>{presd.unitPrice} VNĐ</td>
                                                                                            <td>
                                                                                                {presd.quantity * presd.unitPrice} VNĐ
                                                                                            </td>
                                                                                        </tr>
                                                                                    </>
                                                                                    // { tempTotal += presd.quantity * presd.unitPrice } {/* Cập nhật giá trị tempTotal */ }
                                                                                })}
                                                                            </tbody>
                                                                        </Table>
                                                                        <div class="Total_Prescription">
                                                                            <span><strong>Tổng tiền: </strong></span>
                                                                            <span>{tempTotal} VNĐ</span>
                                                                        </div>
                                                                        <div class="Payment_Button">
                                                                            {pl.servicePaymentStatusId.servicePaymentStatusId === 1 ? <Button variant="primary" onClick={(e) => servicePayment(e, pl.servicePrice, pl.bookingId.profilePatientId.name, pl.prescriptionId)}>Thanh toán tiền khám</Button> : <Button variant="secondary" style={{ cursor: "not-allowed" }}>Thanh toán tiền khám</Button>}
                                                                            {pl.medicinePaymentStatusId.medicinePaymentStatusId === 1 ? <Button variant="warning" onClick={(e) => prescriptionPayment(e, tempTotal, pl.bookingId.profilePatientId.name, pl.prescriptionId)}>Thanh toán tiền thuốc</Button> : <Button variant="secondary" style={{ cursor: "not-allowed" }}>Thanh toán tiền thuốc</Button>}
                                                                        </div>
                                                                    </div>
                                                                </AccordionDetails>
                                                            </Accordion>
                                                        </>
                                                    })}
                                                    <div className="Page_Nav">
                                                        {prescriptionPages.map((page) => (
                                                            <button id={`${page}`} key={page} onClick={() => handlePrescriptionPageChange(page)}
                                                                className={page === selectedPage ? 'active' : ''}>
                                                                {page}
                                                            </button>
                                                        ))}
                                                    </div>
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

export default MedicalRecord;