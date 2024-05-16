import { useEffect, useState } from "react";
import { Badge, Button, Form, Modal, Table } from "react-bootstrap";
import Apis, { authApi, endpoints } from "../../configs/Apis";
import { Autocomplete, Stack, TextField } from "@mui/material";
import cookie from "react-cookies"
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { FaEdit } from "react-icons/fa";
import { IoArrowBackCircle } from "react-icons/io5";

const CompleteBooking = (props) => {
    const [completeBooking, setCompleteBooking] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const [pres, setPres] = useState([])

    const [prescription, setPrescription] = useState([])
    const [medicineList, setMedicineList] = useState([])

    const nav = useNavigate()

    const loadCompleteBooking = async () => {
        try {
            let res = await authApi().post(endpoints['booking-doctor-view-page'], {
                "profileDoctorId": props.profileDoctorId,
                "bookingStatusId": "4",
                "pageNumber": "0"
            })
            console.log(res.data.content)
            setCompleteBooking(res.data.content)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadCompleteBooking()
    }, [props.profileDoctorId])

    const addMedicine = (selectedMedicine) => {
        let pres = cookie.load("pres") || null;
        if (pres === null) {
            pres = {};
        }
        const medicineId = selectedMedicine.medicineId;
        const medicineName = selectedMedicine.medicineName;
        if (medicineId in pres) {
            pres[medicineId].quantity += 1;
        } else {
            pres[medicineId] = {
                medicineId,
                medicineName,
                quantity: 1,
                unitPrice: selectedMedicine.unitPrice,
                usageInstruction: selectedMedicine.usageInstruction,
                medicalReminderDTO: {},
            };
        }
        cookie.save("pres", pres);
        console.log(pres);
        setPres(pres);
    };

    const handleMedicineSelect = (value) => {
        console.log(value);
        const selectedMedicine = Object.values(medicineList).find((ml) => ml === value);
        if (selectedMedicine) {
            addMedicine(selectedMedicine);
        }
        console.log(pres);
    };

    const deleteMedicine = (medicine) => {
        let pres = cookie.load("pres") || null;
        if (pres !== null) {
            if (medicine.medicineId in pres) {
                delete pres[medicine.medicineId];
                cookie.save("pres", pres);
                setPres(pres)
            }
        }
    }

    const loadMedicine = async () => {
        try {
            let res = await Apis.get(endpoints['medicines'])
            setMedicineList(res.data);
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        loadMedicine();
    }, [])

    const handleEditPrescription = (bookingId) => {
        const url = `/doctor/updateprescription/${bookingId}`;
        nav(url);
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
                            <th>Tái khám</th>
                            <th>Sửa đơn thuốc</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(completeBooking).map((cb, index) => {
                            const timeBegin = new Date(cb[3]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            const timeEnd = new Date(cb[4]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            return <>
                                <tr key={index}>
                                    <td>{cb[0]}</td>
                                    <td>{cb[6]}</td>
                                    <td>{moment(cb[2]).format('DD-MM-YYYY')}</td>
                                    <td>{timeBegin} - {timeEnd}</td>
                                    <td><Badge bg="warning">{cb[5]}</Badge></td>
                                    <td><Button variant="primary"><IoArrowBackCircle /></Button></td>
                                    <td><Button variant="primary" onClick={() => handleEditPrescription(cb[0])}><FaEdit /></Button></td>
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
                            <div className="Prescription_Right">
                                <div className="Prescription_Right_Body_1">
                                    <div className="Patient_Name">
                                        <Form.Label style={{ width: "40%" }}>Bệnh nhân</Form.Label>
                                        <Form.Control type="text" value={prescription.bookingId.profilePatientId.name} disabled />
                                    </div>
                                    <div className="Doctor_Name">
                                        <Form.Label style={{ width: "40%" }}>Bác sĩ</Form.Label>
                                        <Form.Control type="text" value={prescription.bookingId.scheduleId.profileDoctorId.name} disabled />
                                    </div>
                                    <div className="Create_Date">
                                        <Form.Label style={{ width: "40%" }}>Ngày lập</Form.Label>
                                        <Form.Control type="date" value={prescription.createdDate.substring(0, 10)} disabled />
                                    </div>
                                    <div className="Booking_Price">
                                        <Form.Label style={{ width: "40%" }}>Phí khám</Form.Label>
                                        <Form.Control type="Text" value={prescription.bookingId.scheduleId.profileDoctorId.bookingPrice} disabled />
                                    </div>
                                    <div className="Symptom">
                                        <Form.Label style={{ width: "40%" }}>Triệu chứng</Form.Label>
                                        <Form.Control type="Text" value={prescription.symptoms} disabled />
                                    </div>
                                    <div className="Diagnosis">
                                        <Form.Label style={{ width: "40%" }}>Chuẩn đoán</Form.Label>
                                        <Form.Control type="Text" value={prescription.diagnosis} disabled />
                                    </div>
                                </div>
                                <div className="Prescription_Right_Body_2">
                                    <div>
                                        <div className="Prescription_Detail_Header">
                                            <h4 className="mt-4">Chi tiết đơn thuốc</h4>
                                        </div>
                                        <div className="Prescription_Detail_Search_Medicine">
                                            <Stack spacing={2} sx={{ width: 300 }}>
                                                <Autocomplete
                                                    freeSolo
                                                    id="free-solo-2-demo"
                                                    disableClearable
                                                    options={Object.values(medicineList)}
                                                    getOptionLabel={(ml) => ml.medicineName}
                                                    getOptionSelected={(ml, value) => ml.medicineName === value}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Tìm thuốc"
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                type: 'search',
                                                            }}
                                                        />
                                                    )}
                                                    onChange={(value) => {
                                                        if (value !== null) {
                                                            handleMedicineSelect(value);
                                                        }
                                                    }}
                                                />
                                            </Stack>
                                        </div>
                                        <div className="Prescription_Detail_Medicine_Choice">
                                            <Table striped bordered hover>
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Tên thuốc</th>
                                                        <th>Số lượng</th>
                                                        <th>Đơn giá</th>
                                                        <th>Cách dùng</th>
                                                        <th>Chỉ định</th>
                                                        <th>Thao tác</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(pres === null || Object.keys(pres).length === 0) ? <>
                                                        <span>Chưa có thuốc nào được chọn</span>
                                                    </> : <>
                                                        {Object.values(pres).map(p => {
                                                            return <>
                                                                <tr key={p.prescriptionDetailId}>
                                                                    <td style={{ width: "4%" }}>{p.medicineId.medicineId}</td>
                                                                    <td style={{ width: "18%" }}>{p.medicineName}</td>
                                                                    <td style={{ width: "10%" }}>
                                                                        <Form.Control
                                                                            type="number"
                                                                            value={p.quantity}
                                                                            onChange={e => {
                                                                                const medicineId = p.medicineId.medicineId;
                                                                                const updatedPres = {
                                                                                    ...pres,
                                                                                    [medicineId]: {
                                                                                        ...pres[medicineId],
                                                                                        quantity: parseInt(e.target.value),
                                                                                    },
                                                                                };
                                                                                setPres(updatedPres);
                                                                                cookie.save("pres", updatedPres)
                                                                                console.log(updatedPres);
                                                                            }}
                                                                            min="0"
                                                                            max="50"
                                                                        />
                                                                    </td>
                                                                    <td style={{ width: "12%" }}>{p.unitPrice} VNĐ</td>
                                                                    <td style={{ width: "20%" }}>
                                                                        <Form.Control
                                                                            type="text"
                                                                            defaultValue={p.usageInstruction}
                                                                            onChange={e => {
                                                                                const newPres = {
                                                                                    ...pres,
                                                                                    [p.medicineId.medicineId]: {
                                                                                        ...pres[p.medicineId.medicineId],
                                                                                        usageInstruction: e.target.value
                                                                                    }
                                                                                };
                                                                                setPres(newPres);
                                                                            }}
                                                                            required
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'center' }}>
                                                                            <span><input className="Remember_Check" type="checkbox" /> Sáng</span>
                                                                            <span><input className="Remember_Check" type="checkbox" /> Trưa</span>
                                                                            <span><input className="Remember_Check" type="checkbox" /> Chiều</span>
                                                                            <span><input className="Remember_Check" type="checkbox" /> Tối</span>
                                                                        </div>
                                                                    </td>
                                                                    <td style={{ width: '9%' }}>
                                                                        <Button variant="danger" onClick={() => deleteMedicine(p.medicineId.medicineId)}>Xóa</Button>
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        })}
                                                    </>}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
                            <Button variant="primary">Cập nhật</Button>
                        </Modal.Footer>
                    </Modal>
                )}
            </div>
        </div>
    </>
}

export default CompleteBooking;