import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookingManagementContext, UserContext } from "../../App";
import "./Prescription.css";
import { Button, Form, Table } from "react-bootstrap";
import cookie from "react-cookies"
import Apis, { authApi, endpoints } from "../../configs/Apis";
import { toast } from "react-toastify";
import { Autocomplete, Stack, TextField } from "@mui/material";

const Prescription = () => {
    const [current_user, dispatch] = useContext(UserContext);
    const [booking, dispatchBooking] = useContext(BookingManagementContext);

    const [bookingId, setBookingId] = useState(booking.bookingId);
    const [profilePatientName, setProfilePatientName] = useState(booking.profilePatientName);
    const [profileDoctorName, setProfileDoctorName] = useState(booking.profileDoctorName);
    const [bookingPrice, setBookingPrice] = useState(booking.bookingPrice);

    const [medicineList, setMedicineList] = useState([]);
    const [totalMedicinePages, setTotalMedicinePages] = useState('1');

    const [medicineCategories, setMedicineCategories] = useState([]);

    const [searchCategory, setSearchCategory] = useState(null);
    const [searchMedicineName, setSearchMedicineName] = useState(null);
    const [searchFromPrice, setSearchFromPrice] = useState(null);
    const [searchToPrice, setSearchToPrice] = useState(null);

    const [diagnosis, setDiagnosis] = useState('')
    const [symptom, setSymptom] = useState('')
    const [usageInstruction, setUsageInstruction] = useState(null);

    const [pres, setPres] = useState(cookie.load("pres") || null)

    const [loading, setLoading] = useState(false);

    const [selectedPage, setSelectedPage] = useState('1');

    // const pres = cookie.load("pres") || null

    // const { bookingId, profilePatientName, profileDoctorName, bookingPrice } = useContext(BookingManagementContext)
    const nav = useNavigate();

    const currentDate = new Date();
    const currentFormattedDate = currentDate.toISOString().split('T')[0];

    // const { selectedBookingId, selectedProfilePatientName } = useParams();

    // const [q] = useSearchParams();

    // const paramA = q.get('bookingId');
    // const paramB = q.get('profilePatientName');
    // const paramC = q.get('profileDoctorName');
    // const paramD = q.get('bookingPrice')

    // useEffect(() => {
    //     if (bookingId === null)
    //         setBookingId(booking.bookingId);
    //     if (profilePatientName === null)
    //         setProfilePatientName(booking.profilePatientName);
    //     if (profileDoctorName === null)
    //         setProfileDoctorName(booking.profileDoctorName);
    //     if (bookingPrice === null)
    //         setBookingPrice(booking.bookingPrice);
    // }, [])

    useEffect(() => {
        const loadMedicineCategories = async () => {
            try {
                let res = await Apis.get(endpoints['medicine-categories'])
                setMedicineCategories(res.data);
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        loadMedicineCategories();
    }, [])

    const loadMedicine = async () => {
        try {
            setLoading(true);
            let res = await Apis.get(endpoints['medicines'])
            setMedicineList(res.data);
            setLoading(false);
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const loadMedicinePage = async (pageNumber) => {
        try {
            setLoading(true);
            let e = `${endpoints['search-medicines']}`;
            // let pageNumber = document.getElementsByClassName("active").id;
            console.log(pageNumber)
            if (pageNumber !== null && !isNaN(pageNumber)) {
                e += `?pageNumber=${pageNumber - 1}&`
            }
            else {
                e += `?`
            }
            let medicineName = searchMedicineName;
            let fromPrice = searchFromPrice;
            let toPrice = searchToPrice;
            let categoryId = searchCategory;
            if (medicineName !== null)
                e += `medicineName=${medicineName}&`
            if (fromPrice !== null)
                e += `fromPrice=${fromPrice}&`
            if (toPrice !== null)
                e += `toPrice=${toPrice}&`
            if (categoryId !== null && categoryId !== "TẤT CẢ DANH MỤC")
                e += `categoryId=${categoryId}`
            // let url = `/users/${pageNumber}`
            console.log(e);
            let res = await Apis.get(e);
            setMedicineList(res.data.content);
            // setUrlUser(e);
            setTotalMedicinePages(res.data.totalPages);
            console.log(res.data.totalPages);
            console.log(e);
            // navigate(url);
            setLoading(false);
            console.log(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadMedicine();
    }, [])

    // const addMedicine = (medicineList) => {
    //     let pres = cookie.load("pres") || null
    //     if (pres === null)
    //         pres = {}

    //     if (medicineList.medicineId in pres) {
    //         pres[medicineList.medicineId]["quantity"] += 1
    //     }
    //     else {
    //         pres[medicineList.medicineId] = {
    //             "medicineId": medicineList.medicineId,
    //             "medicineName": medicineList.medicineName,
    //             "quantity": 1,
    //             "unitPrice": medicineList.unitPrice,
    //             "usageInstruction": medicineList.usageInstruction
    //         }
    //     }
    //     cookie.save("pres", pres)
    //     console.log(pres);
    //     setPres(pres);
    // }

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

    useEffect(() => {
        setPres(cookie.load("pres") || null);
    }, []);

    const deleteMedicine = (medicine) => {
        let pres = cookie.load("pres") || null;

        if (pres !== null) {
            if (medicine.medicineId in pres) {
                delete pres[medicine.medicineId];
                cookie.save("pres", pres);
                setPres(pres)
            }
        }

        // if (medicine.medicineId in pres) {
        //     setPres(current => {
        //         delete current[medicine.medicineId];
        //         cookie.save("pres", current);
        //         return current;
        //     })
        // }
    }

    // const removePres = () => {
    //     cookie.remove("pres");
    // }

    // const medicinePages = Array.from({ length: totalMedicinePages }, (_, index) => index + 1);
    // const handleMedicinePageChange = (pageNumber) => {
    //     // TODO: Xử lý sự kiện khi người dùng chuyển trang
    //     setSelectedPage(pageNumber);
    //     loadMedicinePage(pageNumber);
    //     console.log(`Chuyển đến trang ${pageNumber}`);
    // };

    // useEffect(() => {
    //     const handlePageShow = (event) => {
    //         if (event.persisted) {
    //             console.log('Người dùng đã nhấn nút "Go Back"');
    //             cookie.remove("pres");
    //             // Xóa dữ liệu của trang hiện tại
    //             // Xử lý logic tại đây khi người dùng nhấn nút "Go Back"
    //         }
    //     };

    //     window.addEventListener('pageshow', handlePageShow);

    //     return () => {
    //         window.removeEventListener('pageshow', handlePageShow);
    //     };
    // }, []);

    const addPrescription = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                setLoading(true);
                const request = {
                    addPrescriptionDTO: {
                        "diagnosis": diagnosis,
                        "symptom": symptom,
                        "servicePrice": bookingPrice,
                        "bookingId": bookingId
                    },
                    prescriptionDetailDTO: pres
                };
                let res = await authApi().post(endpoints['add-prescription'], request);
                console.log(res.data);
                toast.success(res.data);
                setLoading(false);
                cookie.remove("pres");
                setDiagnosis('');
                setSymptom('');
                setPres([]);
            } catch (error) {
                console.log(error);
                toast.error("Có lỗi xảy ra!")
            }
        }
        process();
    }

    if (bookingId === null)
        nav('/bookingmanagement');

    // const handleReminderChange = (medicineId, time) => {
    //     const updatedPres = {
    //         ...pres,
    //         [medicineId]: {
    //             ...pres[medicineId],
    //             medicalReminderDTO: {
    //                 ...pres[medicineId].medicalReminderDTO,
    //                 [time]: {
    //                     timeReminderId: time
    //                 }
    //             }
    //         }
    //     };
    //     setPres(updatedPres);
    //     cookie.save("pres", updatedPres);
    //     console.log(updatedPres);
    // };

    const handleReminderChange = (medicineId, time) => {
        const updatedPres = { ...pres };

        if (updatedPres[medicineId]?.medicalReminderDTO?.[time]) {
            delete updatedPres[medicineId].medicalReminderDTO[time]
        } else {
            updatedPres[medicineId].medicalReminderDTO[time] = {
                timeReminderId: time
            };
        }

        setPres(updatedPres);
        cookie.save('pres', updatedPres);
        console.log(updatedPres);
    };

    return <>
        <div className="Prescription_Wrapper">
            <div className="Prescription">
                {/* <div className="Prescription_Left">
                    <div className="Prescription_Left_Content">
                        <DoctorMenu />
                    </div>
                </div> */}
                <div className="Prescription_Right">
                    <div className="Prescription_Right_Header">
                        <h3 className="text-center mb-4">THÔNG TIN ĐƠN THUỐC</h3>
                    </div>
                    <div className="Prescription_Right_Body_1">
                        <div className="Patient_Name">
                            <Form.Label style={{ width: "40%" }}>Bệnh nhân</Form.Label>
                            <Form.Control type="text" value={profilePatientName} disabled />
                        </div>
                        <div className="Doctor_Name">
                            <Form.Label style={{ width: "40%" }}>Bác sĩ</Form.Label>
                            <Form.Control type="text" value={profileDoctorName} disabled />
                        </div>
                        <div className="Create_Date">
                            <Form.Label style={{ width: "40%" }}>Ngày lập</Form.Label>
                            <Form.Control type="date" value={currentFormattedDate} disabled />
                        </div>
                        <div className="Booking_Price">
                            <Form.Label style={{ width: "40%" }}>Phí khám</Form.Label>
                            <Form.Control type="Text" value={bookingPrice.toLocaleString('vi-VN') + ' VNĐ'} disabled />
                        </div>
                        <div className="Symptom">
                            <Form.Label style={{ width: "40%" }}>Triệu chứng</Form.Label>
                            <Form.Control type="Text" defaultValue={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Nhập triệu chứng..." required />
                        </div>
                        <div className="Diagnosis">
                            <Form.Label style={{ width: "40%" }}>Chuẩn đoán</Form.Label>
                            <Form.Control type="Text" defaultValue={symptom} onChange={(e) => setSymptom(e.target.value)} placeholder="Nhập chuẩn đoán..." required />
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
                                                    <tr key={p.medicineId}>
                                                        <td style={{ width: "4%" }}>{p.medicineId}</td>
                                                        <td style={{ width: "18%" }}>{p.medicineName}</td>
                                                        <td style={{ width: "10%" }}>
                                                            <Form.Control
                                                                type="number"
                                                                value={pres[p.medicineId].quantity}
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
                                                        </td>
                                                        <td style={{ width: "12%" }}>{p.unitPrice} VNĐ</td>
                                                        <td style={{ width: "20%" }}>
                                                            {/* <Form.Control type="text" defaultValue={usageInstructions} onChange={(e) => setUsageInstructions(e.target.value)} required /> */}
                                                            <Form.Control
                                                                type="text"
                                                                defaultValue={pres[p.medicineId]["usageInstruction"]}
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
                                                        {/* <td>
                                                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'center' }}>
                                                                <span><input className="Remember_Check" type="checkbox" onChange={() => handleReminderChange(p.medicineId, 1)} checked={pres[p.medicineId]['medicalReminderDTO'][1]} /> Sáng</span>
                                                                <span><input className="Remember_Check" type="checkbox" onChange={() => handleReminderChange(p.medicineId, 2)} checked={pres[p.medicineId]['medicalReminderDTO'][2]} /> Trưa</span>
                                                                <span><input className="Remember_Check" type="checkbox" onChange={() => handleReminderChange(p.medicineId, 3)} checked={pres[p.medicineId]['medicalReminderDTO'][3]} /> Chiều</span>
                                                                <span><input className="Remember_Check" type="checkbox" onChange={() => handleReminderChange(p.medicineId, 4)} checked={pres[p.medicineId]['medicalReminderDTO'][4]} /> Tối</span>
                                                            </div>
                                                        </td> */}
                                                        <td>
                                                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'center' }}>
                                                                <span><input className="Remember_Check" type="checkbox" onChange={() => handleReminderChange(p.medicineId, 1)} checked={pres[p.medicineId]?.medicalReminderDTO?.[1]?.timeReminderId === 1} /> Sáng</span>
                                                                <span><input className="Remember_Check" type="checkbox" onChange={() => handleReminderChange(p.medicineId, 2)} checked={pres[p.medicineId]?.medicalReminderDTO?.[2]?.timeReminderId === 2} /> Trưa</span>
                                                                <span><input className="Remember_Check" type="checkbox" onChange={() => handleReminderChange(p.medicineId, 3)} checked={pres[p.medicineId]?.medicalReminderDTO?.[3]?.timeReminderId === 3} /> Chiều</span>
                                                                <span><input className="Remember_Check" type="checkbox" onChange={() => handleReminderChange(p.medicineId, 4)} checked={pres[p.medicineId]?.medicalReminderDTO?.[4]?.timeReminderId === 4} /> Tối</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ width: '9%' }}>
                                                            <Button variant="danger" onClick={() => deleteMedicine(p)}>Xóa</Button>
                                                        </td>
                                                    </tr>
                                                </>
                                            })}
                                        </>}
                                    </tbody>
                                </Table>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {(pres === null || Object.keys(pres).length === 0) ? <Button variant="secondary" style={{ cursor: "not-allowed" }}>Lưu đơn thuốc</Button> : <Button variant="info" onClick={(e) => addPrescription(e)}>Lưu đơn thuốc</Button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    </>
}

export default Prescription;