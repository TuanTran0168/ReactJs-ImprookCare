import { useContext, useEffect, useState } from "react";
import { authApi, endpoints } from "../../configs/Apis";
import { UserContext } from "../../App";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import moment from "moment";
import Pagination from "../../utils/Pagination"

const ReminderList = () => {
    const [current_user,] = useContext(UserContext)
    const [reminderList, setReminderList] = useState([])
    const [totalPages, setTotalPages] = useState('1');
    const [selectedPage, setSelectedPage] = useState('1');
    const [showModal, setShowModal] = useState(false);
    const [medicineName, setMedicineName] = useState('');
    const [email, setEmail] = useState('');
    const [medicineTime, setMedicineTime] = useState();
    const currentDate = new Date();
    const currentFormattedDate = currentDate.toISOString().split('T')[0];
    const currentTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const getReminderList = async () => {
        try {
            let res = await authApi().get(endpoints['load-medical-schedule'](current_user?.userId))
            console.log(res.data.content)
            setReminderList(res.data.content)
        } catch (error) {
            console.log(error)
        }
    }

    const getReminderListPage = async (pageNumber) => {
        try {
            let e = `${endpoints['load-medical-schedule'](current_user?.userId)}`;
            console.log(pageNumber)
            if (pageNumber !== null && !isNaN(pageNumber)) {
                e += `?pageNumber=${pageNumber - 1}&`
            }
            else {
                e += `?`
            }
            let res = await authApi().get(e)
            console.log(res.data.content)
            setReminderList(res.data.content)
            setTotalPages(res.data.totalPages)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getReminderList()
    }, [])

    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
    const handlePageChange = (pageNumber) => {
        // TODO: Xử lý sự kiện khi người dùng chuyển trang
        setSelectedPage(pageNumber);
        getReminderListPage(pageNumber);
        console.log(`Chuyển đến trang ${pageNumber}`);
    };

    const updateMedicalSchedule = async () => {
        try {

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
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
                                            <td><Button variant="primary"><FaEdit /></Button></td>
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
                                            <Form.Control value={medicineName} onChange={(e) => setMedicineName(e.target.value)} type="text" placeholder="Tên thuốc" required />
                                        </div>
                                        <div className="Profile_Phonenumber">
                                            <Form.Label style={{ width: "30%" }}>Thời gian uống</Form.Label>
                                            <Form.Control type="Time" defaultValue={currentTime} onChange={(e) => setMedicineTime(e.target.value)} />
                                        </div>
                                        <div className="Profile_Email">
                                            <Form.Label style={{ width: "30%" }}>Ngày bắt đầu</Form.Label>
                                            <Form.Control type="Date" id="dateInput" defaultValue={currentFormattedDate} />
                                        </div>
                                        <div className="Profile_Email">
                                            <Form.Label style={{ width: "30%" }}>Email</Form.Label>
                                            <Form.Control type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                                        </div>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
                                    <Button variant="primary" onClick={() => updateMedicalSchedule()}>Lưu</Button>
                                </Modal.Footer>
                            </Modal>
                        )}
                        <Pagination pages={pages}
                            selectedPage={selectedPage}
                            handlePageChange={handlePageChange} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReminderList;