import { useEffect, useState } from "react";
import { Badge, Button, Table } from "react-bootstrap";
import Apis, { authApi, endpoints } from "../../configs/Apis";
// import ModalNotification from "../../layout/Modal";
import moment from "moment"
import Swal from "sweetalert2";
import Pagination from "../../utils/Pagination"

const NewBooking = (props) => {
    const [newBooking, setNewBooking] = useState([]);
    // const [showModal, setShowModal] = useState(false);
    // const [title, setTitle] = useState('');
    // const [bookingId, setBookingId] = useState(null);
    // const [bookingAction, setBookingAction] = useState(null);
    const [totalPages, setTotalPages] = useState('1');
    const [selectedPage, setSelectedPage] = useState('1');
    const [loading, setLoading] = useState(false)

    const acceptBooking = (bookingId) => {
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
                if (res.status === 200) {
                    let link = `http://localhost:3000/zego/?roomID=${res.data.linkVideoCall}`
                    let mes = await Apis.post(endpoints['send-custom-email'], {
                        "mailTo": "2051052125thai@ou.edu.vn",
                        "mailSubject": "Xác nhận lịch khám",
                        "mailContent": "Lịch khám của quý khách đã được xác nhận! Vui lòng đến trước giờ khám bệnh 15’. Đây là liên kết meeting: " + link
                    })
                    console.log(mes.data);
                }
                else {
                    Swal.fire(
                        'Thất bại', res.data, 'error'
                    );
                }
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        process();
    }

    const denyBooking = (bookingId) => {
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
                    let mes = await Apis.post(endpoints['send-custom-email'], {
                        "mailTo": "2051050549tuan@ou.edu.vn",
                        "mailSubject": "Từ chối lịch khám",
                        "mailContent": "Lịch khám của quý khách đã bị từ chối do chưa phù hợp. Mong quý khách thông cảm!"
                    })
                    console.log(mes.data);
                }
                else {
                    Swal.fire(
                        'Thất bại', res.data, 'error'
                    );
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
            setTotalPages(res.data.totalPages)
        } catch (error) {
            console.log(error)
        }
    }

    const loadNewBookingPage = async (pageNumber) => {
        try {
            let res = await authApi().post(endpoints['booking-doctor-view-page'], {
                "profileDoctorId": props.profileDoctorId,
                "bookingStatusId": "1",
                "pageNumber": pageNumber - 1
            })
            console.log(res.data.content)
            setNewBooking(res.data.content)
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadNewBooking()
        // loadWaitingBooking();
    }, [props.profileDoctorId])

    // const handleShowModal = (bookingId, modalTitle, action) => {
    //     setBookingAction(action);
    //     setBookingId(bookingId);
    //     setTitle(modalTitle);
    //     setShowModal(true);
    // };

    const handleShowModal = (title, buttText, cfmText, action, bookingId, name, price) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success mr-2',
                cancelButton: 'btn btn-danger',
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons.fire({
            title: title,
            text: "Bạn sẽ không thể hoàn tác tác vụ này!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: buttText,
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                action(bookingId)
                swalWithBootstrapButtons.fire(
                    'Thành công', cfmText, 'success'
                );
                if (buttText === "Từ chối") {
                    cancelBooking(bookingId)
                    refund(bookingId, name, price)
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
            }
        });
    };

    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
    const handlePageChange = (pageNumber) => {
        // TODO: Xử lý sự kiện khi người dùng chuyển trang
        setSelectedPage(pageNumber);
        loadNewBookingPage(pageNumber);
        console.log(`Chuyển đến trang ${pageNumber}`);
    };

    const cancelBooking = async (bookingId) => {
        try {
            const requestBody = bookingId.toString()
            let res = await authApi().post(endpoints['cancel-booking'], requestBody, {
                headers: {
                    'Content-Type': 'text/plain'
                }
            })
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const refund = async (bookingId, name, price) => {
        try {
            setLoading(true);
            // let bookingId = q.get('bookingId')
            let uri = "Bệnh nhân " + name + " đã được hoàn tiền thành công "
            let encoded = encodeURIComponent(uri)
            let res = await Apis.post(endpoints['vnpay-payment'], {
                "amount": price,
                "orderInfor": encoded,
                "returnUrl": `http://localhost:3000/refund/?bookingId=${bookingId}`
            });
            window.location.href = res.data;
            setLoading(false);
            console.log(res.data);
        } catch (error) {
            Swal.fire(
                'Thất bại', "Có lỗi xảy ra!", 'error'
            );
            console.log(error);
        }
    }

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
                                    <td>{moment(nb[2]).format('DD-MM-YYYY')}</td>
                                    <td>{timeBegin} - {timeEnd}</td>
                                    <td><Badge bg="warning">{nb[5]}</Badge></td>
                                    <td>
                                        <Button style={{ marginRight: '.5rem' }} variant="success"
                                            // onClick={(evt) => { acceptBooking(evt, nb[0]); setShowModal(true) }}
                                            // onClick={() => handleShowModal(nb[0], 'Bạn có chắc muốn xác nhận lịch khám?', "acceptBooking")}
                                            onClick={() => handleShowModal("Bạn có chắc chắc muốn xác nhận lịch khám?", "Xác nhận", "Xác nhận thành công lịch khám", acceptBooking, nb[0])}
                                        >Xác nhận</Button>
                                        <Button variant="danger"
                                            // onClick={(evt) => denyBooking(evt, nb[0])}
                                            // onClick={() => handleShowModal(nb[0], 'Bạn có chắc muốn từ chối lịch khám?', "denyBooking")}
                                            onClick={() => handleShowModal("Bạn có chắc chắc muốn từ chối lịch khám?", "Từ chối", "Từ chối thành công lịch khám", denyBooking, nb[0], nb[6], nb[11].bookingPrice)}
                                        >Từ chối</Button>
                                    </td>
                                </tr>
                            </>
                        })}
                    </tbody>
                </Table>
                {/* <ModalNotification showModal={showModal}
                    setShowModal={setShowModal}
                    title={title}
                    // acceptBooking={() => acceptBooking(bookingId)}
                    // denyBooking={() => denyBooking(bookingId)}
                    bookingAction={bookingAction === "acceptBooking" ? () => acceptBooking(bookingId) : bookingAction === 'denyBooking' ? () => denyBooking(bookingId) : null} /> */}
                <Pagination pages={pages}
                    selectedPage={selectedPage}
                    handlePageChange={handlePageChange} />
            </div>
        </div>
    </>
}

export default NewBooking;