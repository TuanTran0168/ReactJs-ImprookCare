import { useParams } from "react-router-dom";
import Apis, { authApi, endpoints } from "../../configs/Apis";
import { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { Autocomplete, Stack, TextField } from "@mui/material";
import cookie from "react-cookies"

const UpdatePrescription = () => {
    const { bookingId } = useParams();
    const [pres, setPres] = useState([])
    const [medicineList, setMedicineList] = useState([])
    const [prescription, setPrescription] = useState([])

    const [presList, setPresList] = useState([])

    useEffect(() => {
        const loadPrescriptionDetailByBooking = async () => {
            try {
                console.log(bookingId)
                let res = await authApi().post(endpoints['prescription-by-booking'](bookingId))
                console.log(res.data)
                setPrescription(res.data)
                let res1 = await authApi().get(endpoints['prescription-detail-by-prescription-id'](res.data.prescriptionId))
                console.log(res1.data)
                const updatedPres = res1.data.map(item => ({
                    medicineId: item.medicineId.medicineId,
                    medicineName: item.medicineName,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    usageInstruction: item.usageInstruction
                }));
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
            usageInstruction
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

    return (
        <>
            <div className="Prescription_Right">
                <div className="Prescription_Right_Header">
                    <h3 className="text-center mb-4">THÔNG TIN ĐƠN THUỐC</h3>
                </div>
                <div className="Prescription_Right_Body_1">
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
                        <Form.Control type="Text" value={prescription?.symptoms} disabled />
                    </div>
                    <div className="Diagnosis">
                        <Form.Label style={{ width: "40%" }}>Chuẩn đoán</Form.Label>
                        <Form.Control type="Text" value={prescription?.diagnosis} disabled />
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
                                            return <>
                                                <tr key={p.prescriptionDetailId}>
                                                    <td style={{ width: "4%" }}>{p.medicineId}</td>
                                                    <td style={{ width: "18%" }}>{p.medicineName}</td>
                                                    {/* <td style={{ width: "10%" }}>
                                                        <Form.Control
                                                            type="number"
                                                            value={p.quantity}
                                                            onChange={e => {
                                                                const medicineId = p.medicineId;
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
                                                    </td> */}
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
                                                            <span><input className="Remember_Check" type="checkbox" /> Sáng</span>
                                                            <span><input className="Remember_Check" type="checkbox" /> Trưa</span>
                                                            <span><input className="Remember_Check" type="checkbox" /> Chiều</span>
                                                            <span><input className="Remember_Check" type="checkbox" /> Tối</span>
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UpdatePrescription;