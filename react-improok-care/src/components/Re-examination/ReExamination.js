import './ReExamination.css'
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import DateTimePicker from 'react-datetime-picker';
import { Button, Form, Modal } from 'react-bootstrap'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import moment from 'moment'
import { useState } from 'react';
import { authApi, endpoints } from '../../configs/Apis';
import { useContext } from 'react';
import { BookingManagementContext } from '../../App';
import { useEffect } from 'react';

const ReExamination = () => {
    const [booking,] = useContext(BookingManagementContext);
    const localizer = momentLocalizer(moment)
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [timeBegin, setTimeBegin] = useState(null);
    const [timeEnd, setTimeEnd] = useState(new Date());
    const [minDate, setMinDate] = useState('');

    const [timeSlotId, setTimeSlotId] = useState(null);
    const [loading, setLoading] = useState(false);

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [note, setNote] = useState('');

    useEffect(() => {
        setEvents([])
        setLoading(true)
        const today = new Date().toISOString().split("T")[0];
        setMinDate(today);
        const loadAll = async () => {
            try {
                let res = await authApi().get(endpoints['load-custom-timeslot'](booking.profileDoctorId))
                console.log(res.data)
                const newEvents = res.data.map((result) => ({
                    id: result.timeSlotId,
                    title: result.note,
                    start: new Date(result.timeBegin),
                    end: new Date(result.timeEnd),
                }));
                setEvents(newEvents);
                console.log(events)
            } catch (error) {
                console.log(error);
            }
        }
        loadAll()
        setLoading(false)
    }, []);

    const formats = {
        timeGutterFormat: 'HH:mm',
        eventTimeRangeFormat: ({ start, end }) => {
            const startTime = moment(start).format('HH:mm');
            const endTime = moment(end).format('HH:mm');
            return `${startTime} - ${endTime}`;
        },
    };

    const handleSelectSlot = (slotInfo) => {
        setShowModal(true)
        setTimeBegin(moment(slotInfo.start).toDate())
        setTimeEnd(moment(slotInfo.start).add(1, 'hours').toDate())
        setSelectedEvent(null)
        console.log(slotInfo.start)
        console.log(slotInfo.slots)
    }

    const handleSelectEvent = (event) => {
        setShowModal(true)
        setSelectedEvent(event)
        setNote(event.title)
        setTimeBegin(event.start)
        setTimeEnd(event.end)
        setTimeSlotId(event.id)
    }

    const saveEvent = async () => {
        if (note && timeBegin) {
            if (selectedEvent) {
                const updatedEvent = {
                    ...selectedEvent,
                    title: note,
                    start: timeBegin,
                    end: timeEnd
                };
                const updatedEvents = events.map((event) =>
                    event === selectedEvent ? updatedEvent : event
                );
                setEvents(updatedEvents);
                console.log(timeSlotId, timeBegin, timeEnd, note)
                let res = await authApi().post(endpoints['edit-timeslot'], {
                    "timeSlotId": timeSlotId,
                    "timeBegin": moment(timeBegin).format("YYYY-MM-DD HH:mm:ss"),
                    "timeEnd": moment(timeEnd).format("YYYY-MM-DD HH:mm:ss"),
                    "note": note
                })
                console.log(res.data)
            }
            else {
                const newEvent = {
                    title: note,
                    start: timeBegin,
                    end: timeEnd
                }
                console.log(newEvent)
                console.log()
                setEvents([...events, newEvent])
                console.log(timeBegin, timeEnd)
                console.log(moment(timeBegin).format("YYYY-MM-DD HH:mm:ss"), moment(timeEnd).format("YYYY-MM-DD HH:mm:ss"))
                let res = await authApi().post(endpoints['create-re-examination'], {
                    "timeBegin": moment(timeBegin).format("YYYY-MM-DD HH:mm:ss"),
                    "timeEnd": moment(timeEnd).format("YYYY-MM-DD HH:mm:ss"),
                    "note": note,
                    "profileDoctorId": booking.profileDoctorId,
                    "profilePatientId": booking.profilePatientId
                })
                console.log(res.data)
            }
            setShowModal(false)
            setNote('')
            setSelectedEvent(null);
        }
    }

    const onTimeBeginChange = (newValue) => {
        setTimeBegin(newValue);
    };

    const onTimeEndChange = (newValue) => {
        setTimeEnd(newValue);
    };


    return (<>
        <div className="re-examination-wrapper">
            <div className="re-examination">
                <h3 className="text-center">ĐĂNG KÝ TÁI KHÁM</h3>
                <div className="re-examination-header">
                    <div>
                        <Form.Label style={{ width: "50%" }}>Bệnh nhân</Form.Label>
                        <Form.Control type="text" value={booking.profilePatientName} disabled />
                    </div>
                    <div>
                        <Form.Label style={{ width: "50%" }}>Bác sĩ</Form.Label>
                        <Form.Control type="text" value={booking.profileDoctorName} disabled />
                    </div>
                </div>
                <div className="re-examination-body">
                    <DndProvider backend={HTML5Backend}>
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 500 }}
                            formats={formats}
                            defaultView="day"
                            views={["month", "week", "day"]}
                            selectable={true}
                            onSelectSlot={handleSelectSlot}
                            onSelectEvent={handleSelectEvent}
                        />
                    </DndProvider>
                    {showModal && (
                        <div
                            className="modal show"
                            style={{ display: 'block', backgroundColor: 'rgba(0.0.0.0.5)', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, zIndex: 9999 }}
                        >
                            <Modal.Dialog>
                                <Modal.Header closeButton onHide={() => {
                                    setShowModal(false)
                                    setSelectedEvent(null)
                                    setNote('')
                                }}>
                                    <Modal.Title>{selectedEvent ? 'Chỉnh sửa tái khám' : 'Đăng ký tái khám'}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body className="reexamination_bar">
                                    <div className="reexamination_bar_option">
                                        <Form.Label style={{ width: "30%" }}>Nội dung</Form.Label>
                                        <Form.Control as="textarea" aria-label="With textarea" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nhập nội dung ghi chú..." />
                                    </div>
                                    <div className="reexamination_bar_option">
                                        <Form.Label style={{ width: "23%" }}>Bắt đầu</Form.Label>
                                        <DateTimePicker onChange={onTimeBeginChange} value={timeBegin} clearIcon={null} />
                                    </div>
                                    <div className="reexamination_bar_option">
                                        <Form.Label style={{ width: "23%" }}>Kết thúc</Form.Label>
                                        <DateTimePicker onChange={onTimeEndChange} value={timeEnd} clearIcon={null} />
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
                                    <Button variant="primary" onClick={saveEvent}>Lưu</Button>
                                </Modal.Footer>
                            </Modal.Dialog>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </>)
}

export default ReExamination;