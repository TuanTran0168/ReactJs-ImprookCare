import { useParams } from "react-router-dom";
import Apis, { authApi, endpoints } from "../../configs/Apis";
import { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { Autocomplete, Stack, TextField } from "@mui/material";
import cookie from "react-cookies"
import Swal from "sweetalert2";

const UpdatePrescription = () => {
    const { bookingId } = useParams();
    const [pres, setPres] = useState([])
    const [medicineList, setMedicineList] = useState([])
    const [prescription, setPrescription] = useState([])
    const [loading, setLoading] = useState(false)
    const [diagnosis, setDiagnosis] = useState('')
    const [symptom, setSymptom] = useState('')
    const [notes, setNotes] = useState('')

    useEffect(() => {
        const loadPrescriptionDetailByBooking = async () => {
            try {
                console.log(bookingId)
                let res = await authApi().post(endpoints['prescription-by-booking'](bookingId))
                console.log(res.data)
                setPrescription(res.data)
                let res1 = await authApi().get(endpoints['prescription-detail-reminder'](res.data.prescriptionId))
                console.log(res1.data)
                const updatedPres = res1.data.map((item) => ({
                    medicineId: item.prescriptionDetail.medicineId.medicineId,
                    medicineName: item.prescriptionDetail.medicineId.medicineName,
                    quantity: item.prescriptionDetail.quantity,
                    unitPrice: item.prescriptionDetail.unitPrice,
                    usageInstruction: item.prescriptionDetail.usageInstruction,
                    medicalReminderDTO: item.timeReminders.reduce((acc, reminder) => {
                        const { timeReminderId } = reminder.timeReminderId;
                        return {
                            ...acc,
                            [timeReminderId]: {
                                timeReminderId
                            }
                        };
                    }, {})
                }));
                console.log(updatedPres)
                setPres(updatedPres);
            } catch (error) {
                console.log(error)
            }
        }
        loadPrescriptionDetailByBooking()
    }, [bookingId])

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

    const addMedicine = (selectedMedicine) => {
        const { medicineId, medicineName, unitPrice, usageInstruction } = selectedMedicine;
        const existingMedicine = pres.find(p => (p.medicineId === medicineId));
        if (existingMedicine) {
            const updatedPres = pres.map(p => {
                if (p.medicineId === medicineId) {
                    return {
                        ...p,
                        quantity: p.quantity + 1
                    };
                }
                return p;
            });
            setPres(updatedPres);
            return;
        }

        const newMedicine = {
            medicineId,
            medicineName,
            quantity: 1,
            unitPrice,
            usageInstruction,
            medicalReminderDTO: []
        };
        setPres(prevPres => [...prevPres, newMedicine]);
    };

    const handleMedicineSelect = (value) => {
        console.log(value);
        const selectedMedicine = Object.values(medicineList).find((ml) => ml === value);
        if (selectedMedicine) {
            addMedicine(selectedMedicine);
        }
        console.log(pres);
    };

    const removeMedicine = (medicineId) => {
        const updatedPres = pres.filter(p => p.medicineId !== medicineId);
        setPres(updatedPres);
        console.log(updatedPres)
    };

    const handleReminderChange = (medicineId, time) => {
        const updatedPres = pres.map(p => {
            if (p.medicineId === medicineId) {
                const updatedMedicalReminderDTO = { ...p.medicalReminderDTO };
                if (updatedMedicalReminderDTO[time]) {
                    delete updatedMedicalReminderDTO[time];
                } else {
                    updatedMedicalReminderDTO[time] = {
                        timeReminderId: time,
                    };
                }
                return {
                    ...p,
                    medicalReminderDTO: updatedMedicalReminderDTO
                };
            }
            return p;
        });
        setPres(updatedPres);
    };

    const updatePrescription = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                setLoading(true);
                const prescriptionDetailObject = pres.reduce((acc, item, index) => {
                    return {
                        ...acc,
                        [index]: item
                    };
                }, {});
                const request = {
                    updatePrescriptionDTO: {
                        "prescriptionId": prescription?.prescriptionId,
                        "diagnosis": diagnosis !== "" ? diagnosis : prescription?.diagnosis,
                        "symptom": symptom !== "" ? symptom : prescription?.symptoms,
                        "servicePrice": prescription?.bookingId?.scheduleId.profileDoctorId.bookingPrice,
                        "bookingId": prescription?.bookingId?.bookingId,
                        "notes": notes !== "" ? notes : prescription?.notes
                    },
                    prescriptionDetailDTO: prescriptionDetailObject
                };
                const hasEmptyMedicalReminder = Object.values(prescriptionDetailObject).some(detail => {
                    return Object.keys(detail.medicalReminderDTO).length === 0;
                });

                if (hasEmptyMedicalReminder) {
                    Swal.fire(
                        'Thất bại', "Cần chỉ định thời gian uống cho tất cả thuốc", 'error'
                    );
                    return;
                } else {
                    console.log(request)
                    let res = await authApi().post(endpoints['update-prescription'], request);
                    console.log(res.data);
                    Swal.fire(
                        'Thành công', "Cập nhật đơn thuốc thành công!", 'success'
                    );
                    setLoading(false);
                }
            } catch (error) {
                console.log(error);
                Swal.fire(
                    'Thất bại', "Có lỗi xảy ra!", 'error'
                );
            }
        }
        process();
    }

    return (
        <>
            <div className="Prescription_Right">
                <div className="Prescription_Right_Header">
                    <h3 className="text-center mb-4">THÔNG TIN ĐƠN THUỐC</h3>
                </div>
                <div className="Prescription_Right_Body_1">
                    <div className="Prescription_Info_1">
                        <div className="Patient_Name">
                            <Form.Label style={{ width: "40%" }}>Bệnh nhân</Form.Label>
                            <Form.Control type="text" value={prescription?.bookingId?.profilePatientId.name} disabled />
                        </div>
                        <div className="Doctor_Name">
                            <Form.Label style={{ width: "40%" }}>Bác sĩ</Form.Label>
                            <Form.Control type="text" value={prescription?.bookingId?.scheduleId.profileDoctorId.name} disabled />
                        </div>
                        <div className="Create_Date">
                            <Form.Label style={{ width: "40%" }}>Ngày lập</Form.Label>
                            <Form.Control type="date" value={prescription?.createdDate?.substring(0, 10)} disabled />
                        </div>
                        <div className="Booking_Price">
                            <Form.Label style={{ width: "40%" }}>Phí khám</Form.Label>
                            <Form.Control type="Text" value={prescription?.bookingId?.scheduleId.profileDoctorId.bookingPrice} disabled />
                        </div>
                        <div className="Symptom">
                            <Form.Label style={{ width: "40%" }}>Triệu chứng</Form.Label>
                            <Form.Control type="Text" defaultValue={prescription?.symptoms} onChange={(e) => setSymptom(e.target.value)} placeholder="Nhập triệu chứng..." required />
                        </div>
                        <div className="Diagnosis">
                            <Form.Label style={{ width: "40%" }}>Chuẩn đoán</Form.Label>
                            <Form.Control type="Text" defaultValue={prescription?.diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Nhập chẩn đoán..." required />
                        </div>
                    </div>
                    <div className="Notes">
                        <Form.Label style={{ width: "40%" }}>Ghi chú</Form.Label>
                        <Form.Control as="textarea" aria-label="With textarea" defaultValue={prescription?.notes} onChange={(e) => setNotes(e.target.value)} placeholder="Nhập ghi chú..." required />
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
                                    onChange={(event, value) => {
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
                                            const timeReminderNames = Object.values(p.medicalReminderDTO).map(obj => obj.timeReminderId);
                                            console.log(p.medicalReminderDTO)
                                            console.log(timeReminderNames)

                                            return <>
                                                <tr key={p.prescriptionDetailId}>
                                                    <td style={{ width: "4%" }}>{p.medicineId}</td>
                                                    <td style={{ width: "18%" }}>{p.medicineName}</td>
                                                    <td style={{ width: "10%" }}>
                                                        <Form.Control
                                                            type="number"
                                                            value={p.quantity}
                                                            onChange={e => {
                                                                // const medicineId = p.medicineId;
                                                                p.quantity = parseInt(e.target.value);
                                                                setPres([...pres]);
                                                                cookie.save("pres", pres);
                                                                console.log(pres);
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
                                                                    [p.medicineId]: {
                                                                        ...pres[p.medicineId],
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
                                                            <span>
                                                                <input
                                                                    className="Remember_Check"
                                                                    type="checkbox"
                                                                    checked={timeReminderNames.includes(1)}
                                                                    onChange={() => handleReminderChange(p.medicineId, 1)}
                                                                />
                                                                Sáng
                                                            </span>
                                                            <span>
                                                                <input
                                                                    className="Remember_Check"
                                                                    type="checkbox"
                                                                    checked={timeReminderNames.includes(2)}
                                                                    onChange={() => handleReminderChange(p.medicineId, 2)}
                                                                />
                                                                Trưa
                                                            </span>
                                                            <span>
                                                                <input
                                                                    className="Remember_Check"
                                                                    type="checkbox"
                                                                    checked={timeReminderNames.includes(3)}
                                                                    onChange={() => handleReminderChange(p.medicineId, 3)}
                                                                />
                                                                Chiều
                                                            </span>
                                                            <span>
                                                                <input
                                                                    className="Remember_Check"
                                                                    type="checkbox"
                                                                    checked={timeReminderNames.includes(4)}
                                                                    onChange={() => handleReminderChange(p.medicineId, 4)}
                                                                />
                                                                Tối
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td style={{ width: '9%' }}>
                                                        <Button variant="danger" onClick={() => removeMedicine(p.medicineId)}>Xóa</Button>
                                                    </td>
                                                </tr>
                                            </>
                                        })}
                                    </>}
                                </tbody>
                            </Table>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {(pres === null || Object.keys(pres).length === 0) ? <Button variant="secondary" style={{ cursor: "not-allowed" }}>Lưu đơn thuốc</Button> : <Button variant="info" onClick={(e) => updatePrescription(e)}>Lưu đơn thuốc</Button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UpdatePrescription;