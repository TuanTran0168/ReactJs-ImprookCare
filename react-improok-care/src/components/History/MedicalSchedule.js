import { useContext, useEffect, useState } from "react";
import { authApi, endpoints } from "../../configs/Apis";
import { UserContext } from "../../App";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import moment from "moment";
import { FaTrashCan } from "react-icons/fa6";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

const MedicalSchedule = () => {
    const [current_user,] = useContext(UserContext)
    const [reminderList, setReminderList] = useState([])
    const [reminderDetail, setReminderDetail] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [medicineName, setMedicineName] = useState('');
    const [email, setEmail] = useState('');
    const [medicineTime, setMedicineTime] = useState();
    const currentDate = new Date();
    const currentTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    console.log(currentDate, currentTime)

    const { prescriptionId } = useParams()
    // const [q] = useSearchParams()

    const getReminderList = async () => {
        try {
            // let prescriptionId = q.get("prescription")
            console.log(prescriptionId)
            let res = await authApi().get(endpoints['medical-schedule'](prescriptionId))
            setReminderList(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getReminderListDetail = async (medicalScheduleId) => {
        try {
            let res = await authApi().get(endpoints['load-medical-schedule-detail'](medicalScheduleId))
            setReminderDetail(res.data)
            console.log(res.data)
            setShowModal(true)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (prescriptionId)
            getReminderList()
    }, [prescriptionId])

    const updateMedicalSchedule = async () => {
        try {
            const dateInput = document.getElementById('dateInput');
            const selectedDate = dateInput.value;
            const remindDate = new Date(selectedDate).toISOString().split('T')[0];
            console.log(remindDate)
            // console.log(remindDate + " " + medicineTime + ":00")
            const customTime = `${remindDate} ${medicineTime ? medicineTime : new Date(reminderDetail.customTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}:00`;
            console.log(customTime)
            let res = await authApi().post(endpoints['update-medical-schedule'], {
                "medicalScheduleId": reminderDetail.medicalScheduleId,
                "customTime": customTime,
                "startDate": remindDate,
                "medicineName": medicineName === "" ? reminderDetail.medicineName : medicineName,
                "email": email === "" ? reminderDetail.email : email
            })
            console.log(res.data)
            Swal.fire(
                'Thành công', "Sửa nhắc uống thuốc thành công!", 'success'
            );
            getReminderList()
            setShowModal(false)
        } catch (error) {
            console.log(error)
        }
    }

    // const deleteMedicalSchedule = async (medicalScheduleId) => {
    //     try {
    //         let res = await authApi().delete(endpoints['delete-medical-schedule-prescription-id'](medicalScheduleId))
    //         console.log(res.data)
    //         getReminderList()
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // const handleShowModal = (medicalScheduleId, medicalReminderId) => {
    //     const swalWithBootstrapButtons = Swal.mixin({
    //         customClass: {
    //             confirmButton: 'btn btn-success mr-2',
    //             cancelButton: 'btn btn-danger',
    //         },
    //         buttonsStyling: false
    //     });

    //     swalWithBootstrapButtons.fire({
    //         title: "Xóa nhắc uống thuốc",
    //         text: "Bạn sẽ không thể hoàn tác tác vụ này!",
    //         icon: 'question',
    //         showCancelButton: true,
    //         confirmButtonText: "Xóa",
    //         cancelButtonText: 'Hủy',
    //     }).then((result) => {
    //         if (result.isConfirmed && medicalReminderId === null) {
    //             // deleteMedicalSchedule(medicalScheduleId)
    //             swalWithBootstrapButtons.fire(
    //                 'Thành công', "Xóa nhắc uống thuốc thành công!", 'success'
    //             );
    //         } else if (result.isConfirmed && medicalReminderId !== null) {
    //         }
    //         else if (result.dismiss === Swal.DismissReason.cancel) {
    //         }
    //     });
    // };

    return (<>
        <div className="reminder-list-wrapper">
            <div className="reminder-list">
                <div className="reminder-list-header">
                    <h3 className="text-center mb-4">Danh sách nhắc uống thuốc</h3>
                </div>
                <div className="reminder-list-content">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Tên thuốc</th>
                                <th>Thời gian uống</th>
                                <th>Ngày bắt đầu</th>
                                <th>Email</th>
                                <th>Chỉnh sửa</th>
                                {/* <th>Xóa</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(reminderList).map(rl => {
                                const timeBegin = new Date(rl.customTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                return <>
                                    <tr key={rl.medicalScheduleId}>
                                        <td>{rl.medicineName}</td>
                                        <td>{timeBegin}</td>
                                        <td>{moment(rl.startDate).format('DD-MM-YYYY')}</td>
                                        <td>{rl.email}</td>
                                        <td><Button variant="primary" onClick={() => getReminderListDetail(rl.medicalScheduleId)}><FaEdit /></Button></td>
                                        {/* <td><Button variant="primary"
                                            onClick={() => handleShowModal(rl.medicalScheduleId, rl.medicalReminderId)}
                                        ><FaTrashCan /></Button></td> */}
                                    </tr>
                                </>
                            })}
                        </tbody>
                    </Table>
                    {showModal && (
                        <Modal fullscreen={true} show={showModal} onHide={() => setShowModal(false)}
                            style={{ display: 'block', backgroundColor: 'rgba(0.0.0.0.5)', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, zIndex: 9999 }}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Sửa nhắc uống thuốc</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="Profile_Right_Content">
                                    <div className="Profile_Name">
                                        <Form.Label style={{ width: "30%" }}>Tên thuốc</Form.Label>
                                        <Form.Control defaultValue={reminderDetail.medicineName} onChange={(e) => setMedicineName(e.target.value)} type="text" placeholder="Tên thuốc" required />
                                    </div>
                                    <div className="Profile_Phonenumber">
                                        <Form.Label style={{ width: "30%" }}>Thời gian uống</Form.Label>
                                        <Form.Control type="Time" defaultValue={new Date(reminderDetail.customTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} onChange={(e) => setMedicineTime(e.target.value)} />
                                    </div>
                                    <div className="Profile_Email">
                                        <Form.Label style={{ width: "30%" }}>Ngày bắt đầu</Form.Label>
                                        <Form.Control type="Date" id="dateInput" defaultValue={reminderDetail.startDate} />
                                    </div>
                                    <div className="Profile_Email">
                                        <Form.Label style={{ width: "30%" }}>Email</Form.Label>
                                        <Form.Control type="text" defaultValue={reminderDetail.email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
                                <Button variant="primary" onClick={() => updateMedicalSchedule()}>Lưu</Button>
                            </Modal.Footer>
                        </Modal>
                    )}
                </div>
            </div>
        </div>
    </>)
}

export default MedicalSchedule;