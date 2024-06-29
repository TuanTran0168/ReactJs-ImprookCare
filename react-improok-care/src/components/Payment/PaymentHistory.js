import "./PaymentHistory.css"
import printer from "../../assets/images/printer.png"
import profileicon from "../../assets/images/profile-icon.png"
import profile404 from "../../assets/images/profile.png"
import paymentcard from "../../assets/images/payment-card.png"
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { authApi, endpoints } from "../../configs/Apis";
import { Badge, Button, Modal, Table } from "react-bootstrap";
import success from "../../assets/images/success.png"
import { MdMenu } from "react-icons/md"
import moment from "moment"

const PaymentHistory = () => {
    const [current_user,] = useContext(UserContext);
    const [profilePatient, setProfilePatient] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState();
    const [paymentList, setPaymentList] = useState([])
    const [showModal, setShowModal] = useState(false)

    const [paymentDetail, setPaymentDetail] = useState([])

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

    const viewPaymentList = async (pp) => {
        try {
            setSelectedProfile(pp.profilePatientId);
            let res = await authApi().get(endpoints['load-payment-history'](pp.profilePatientId))
            setPaymentList(res.data.content)
            console.log(res.data.content)
        } catch (error) {
            console.log(error)
        }
    }

    const viewPaymentDetail = async (pl) => {
        try {
            let res = await authApi().get(endpoints['payment-detail'](pl.paymentHistoryId))
            console.log(res.data)
            setPaymentDetail(res.data)
            setShowModal(true)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className="payment_history_wrapper">
                <div className="payment_history">
                    <div className="payment_history_middle">
                        <div className="payment_history_middle_header">
                            <h3>Lịch sử thanh toán</h3>
                        </div>
                        <div className="payment_history_middle_content">
                            <div className="payment_history_middle_container">
                                <div className="payment_history_middle_info">
                                    <input type="text" placeholder="Nhập tên hồ sơ cần tìm..."></input>
                                    <div className="payment_history_list">
                                        {profilePatient.length === 0 ? <>
                                            <div className="payment_history_list_404">
                                                <img src={printer} alt="404" width={'20%'} />
                                                <span>Không tìm thấy kết quả</span>
                                            </div>
                                        </> : <>
                                            <div className="payment_history_list_info">
                                                <ul>
                                                    {Object.values(profilePatient).map(pp => {
                                                        return <>
                                                            <div className="payment_history_list_detail" value={selectedProfile} onClick={() => viewPaymentList(pp)}>
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
                    <div className="payment_history_right">
                        <>
                            <section>
                                <div className="payment_history_right_header"><h3 className="text-center mb-4">Thông tin thanh toán</h3></div>
                                <div className="payment_history_right_content">
                                    {profilePatient === null ? <>
                                        <div className="payment_history_null">
                                            <h5 className="mb-4">Chọn thanh toán cần xem</h5>
                                            <img src={profile404} alt="Not found" width={'20%'} />
                                        </div>
                                    </> :
                                        <>
                                            <div>
                                                <div>
                                                    {paymentList.length === 0 ? <>
                                                        <div className="Appointment_Null">
                                                            <h5 className="mb-4">Không tìm thấy thanh toán</h5>
                                                            <img src={paymentcard} alt="Not found" width={'20%'} />
                                                        </div>
                                                    </> :
                                                        <>
                                                            <Table striped bordered hover>
                                                                <thead>
                                                                    <tr>
                                                                        <th>Bác sĩ</th>
                                                                        <th>Bệnh nhân</th>
                                                                        <th>Khung giờ</th>
                                                                        {/* <th>Chuyên khoa</th> */}
                                                                        <th>Tình trạng</th>
                                                                        <th>Chi tiết</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {Object.values(paymentList).map(pl => {
                                                                        const timeBegin = new Date(pl.bookingId.scheduleId.timeSlotId?.timeBegin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                                                        const timeEnd = new Date(pl.bookingId.scheduleId.timeSlotId?.timeEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                                                        return <>
                                                                            <tr key={pl.paymentHistoryId}>
                                                                                <td>{pl.bookingId.scheduleId.profileDoctorId.name}</td>
                                                                                <td>{pl.bookingId.profilePatientId.name}</td>
                                                                                <td>{timeBegin} - {timeEnd}</td>
                                                                                {/* <td>{pl.bookingId.scheduleId.profileDoctorId.specialtyId.specialtyName}</td> */}
                                                                                <td>{pl.vnpTransactionstatus === "00" ? <Badge bg="success">Thành công</Badge> : <Badge bg="danger">Thất bại</Badge>}</td>
                                                                                <td><Button variant="primary" onClick={() => viewPaymentDetail(pl)}><MdMenu /></Button></td>
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
                                                                        <Modal.Title>Thông tin thanh toán</Modal.Title>
                                                                    </Modal.Header>
                                                                    <Modal.Body>
                                                                        <div className="payment_detail_wrapper">
                                                                            <div className="payment_detail_header">
                                                                                <h3 className="text-muted">KẾT QUẢ THANH TOÁN</h3>
                                                                                <div className="payment_detail_image">
                                                                                    <img src={success} alt="success" width={"20%"} />
                                                                                </div>
                                                                            </div>
                                                                            <div className="payment_detail_content">
                                                                                <div className="form-group">
                                                                                    <label>Mã giao dịch thanh toán:</label>
                                                                                    <label>{paymentDetail.vnpTxnref}</label>
                                                                                </div>
                                                                                <div className="form-group">
                                                                                    <label>Số tiền:</label>
                                                                                    <label>{paymentDetail.vnpAmount} VNĐ</label>
                                                                                </div>
                                                                                <div className="form-group">
                                                                                    <label>Mô tả giao dịch:</label>
                                                                                    <label style={{ whiteSpace: 'normal' }}>{paymentDetail.vnpOrderinfo}</label>
                                                                                </div>
                                                                                <div className="form-group">
                                                                                    <label>Mã lỗi thanh toán:</label>
                                                                                    <label>{paymentDetail.vnpResponsecode}</label>
                                                                                </div>
                                                                                <div className="form-group">
                                                                                    <label>Mã giao dịch tại CTT VNPAY-QR:</label>
                                                                                    <label>{paymentDetail.vnpTransactionno}</label>
                                                                                </div>
                                                                                <div className="form-group">
                                                                                    <label>Mã ngân hàng thanh toán:</label>
                                                                                    <label>{paymentDetail.vnpBankcode}</label>
                                                                                </div>
                                                                                <div className="form-group">
                                                                                    <label>Thời gian thanh toán:</label>
                                                                                    {/* <label>{paymentDetail.vnpPaydate}</label> */}
                                                                                    <label>{moment(paymentDetail.vnpPaydate, "YYYYMMDDHHmmss").format("DD-MM-YYYY HH:mm:ss")}</label>
                                                                                </div>
                                                                                <div className="form-group">
                                                                                    <label>Tình trạng giao dịch:</label>
                                                                                    <label>
                                                                                        {paymentDetail
                                                                                            ? paymentDetail.vnpTransactionstatus === "00"
                                                                                                ? <Badge bg="success">Thành công</Badge>
                                                                                                : <Badge bg="warning">Không thành công</Badge>
                                                                                            : <Badge bg="danger">Invalid Signature</Badge>}
                                                                                    </label>
                                                                                </div>
                                                                            </div>
                                                                            <p>&nbsp;</p>
                                                                            <footer className="footer">
                                                                                <p>&copy; IMPROOK_CARE 2024</p>
                                                                            </footer>
                                                                        </div>
                                                                    </Modal.Body>
                                                                    <Modal.Footer>
                                                                        <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
                                                                    </Modal.Footer>
                                                                </Modal>
                                                            )}
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        </>}
                                </div>
                            </section>
                        </>
                    </div >
                </div >
            </div >
        </>
    )
}

export default PaymentHistory;