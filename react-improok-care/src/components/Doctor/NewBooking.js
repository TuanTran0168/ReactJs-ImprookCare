import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import Apis, { authApi, endpoints } from "../../configs/Apis";
import ModalNotification from "../../layout/Modal";

const NewBooking = (props) => {
    const [newBooking, setNewBooking] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [bookingId, setBookingId] = useState(null);
    const [bookingAction, setBookingAction] = useState(null);

    const acceptBooking = (bookingId) => {
        // evt.preventDefault();
        const process = async () => {
            try {
                const requestBody = bookingId.toString()
                let res = await authApi().post(endpoints['accept-booking'], requestBody, {
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                })
                loadNewBooking();
                console.log(requestBody)
                if (res.data === "Xác nhận thành công lịch đặt khám!") {
                    toast.success(res.data);
                    let mes = await Apis.post(endpoints['send-custom-email'], {
                        "mailTo": "2051052125thai@ou.edu.vn",
                        "mailSubject": "Xác nhận lịch khám",
                        "mailContent": "Lịch khám của quý khách đã được xác nhận! Vui lòng đến trước giờ khám bệnh 15’"
                    })
                    console.log(mes.data);
                }
                else {
                    toast.error(res.data);
                }
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        process();
    }

    const denyBooking = (bookingId) => {
        // evt.preventDefault();

        const process = async () => {
            try {
                const requestBody = bookingId.toString()
                let res = await authApi().post(endpoints['deny-booking'], requestBody, {
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                })
                loadNewBooking();
                if (res.data === "Từ chối thành công lịch đặt khám!") {
                    toast.success(res.data);
                    let mes = await Apis.post(endpoints['send-custom-email'], {
                        "mailTo": "2051050549tuan@ou.edu.vn",
                        "mailSubject": "Từ chối lịch khám",
                        "mailContent": "Lịch khám của quý khách đã bị từ chối do chưa phù hợp. Mong quý khách thông cảm!"
                    })
                    console.log(mes.data);
                }
                else {
                    toast.error(res.data);
                }
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        process();
    }

    const loadNewBooking = async () => {
        try {
            let res = await authApi().post(endpoints['booking-doctor-view-page'], {
                "profileDoctorId": props.profileDoctorId,
                "bookingStatusId": "1",
                "pageNumber": "0"
            })
            console.log(res.data.content)
            setNewBooking(res.data.content)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        loadNewBooking()
        // loadWaitingBooking();
    }, [props.profileDoctorId])

    const handleShowModal = (bookingId, modalTitle, action) => {
        setBookingAction(action);
        setBookingId(bookingId);
        setTitle(modalTitle);
        setShowModal(true);
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
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(newBooking).map((nb, index) => {
                            const timeBegin = new Date(nb[3]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            const timeEnd = new Date(nb[4]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            return <>
                                <tr key={index}>
                                    <td>{nb[0]}</td>
                                    <td>{nb[6]}</td>
                                    <td>{nb[2]}</td>
                                    <td>{timeBegin} - {timeEnd}</td>
                                    <td>{nb[5]}</td>
                                    <td>
                                        <Button style={{ marginRight: '.5rem' }} variant="success"
                                            // onClick={(evt) => { acceptBooking(evt, nb[0]); setShowModal(true) }}
                                            onClick={() => handleShowModal(nb[0], 'Bạn có chắc muốn xác nhận lịch khám?', "acceptBooking")}
                                        >Xác nhận</Button>
                                        <Button variant="danger"
                                            // onClick={(evt) => denyBooking(evt, nb[0])}
                                            onClick={() => handleShowModal(nb[0], 'Bạn có chắc muốn từ chối lịch khám?', "denyBooking")}
                                        >Từ chối</Button>
                                    </td>
                                </tr>
                            </>
                        })}
                    </tbody>
                </Table>
                <ModalNotification showModal={showModal}
                    setShowModal={setShowModal}
                    title={title}
                    // acceptBooking={() => acceptBooking(bookingId)}
                    // denyBooking={() => denyBooking(bookingId)}
                    bookingAction={bookingAction === "acceptBooking" ? () => acceptBooking(bookingId) : bookingAction === 'denyBooking' ? () => denyBooking(bookingId) : null} />
            </div>
        </div>
    </>
}

export default NewBooking;