import { useContext, useEffect, useState } from "react";
import "./CustomSchedule.css";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import Apis, { authApi, endpoints } from "../../configs/Apis";
import { toast } from "react-toastify";
import 'react-calendar/dist/Calendar.css';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import DateTimePicker from 'react-datetime-picker';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const CustomSchedule = () => {
    const [current_user,] = useContext(UserContext);
    const nav = useNavigate();
    const [minDate, setMinDate] = useState('');
    const [profileDoctorByUserId, setProfileDoctorByUserId] = useState([]);
    const [selectedProfileDoctorId, setSeletedProfileDoctorId] = useState();
    const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [timeSlotId, setTimeSlotId] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        setEvents([])
        setLoading(true)
        const today = new Date().toISOString().split("T")[0];
        setMinDate(today);
        const loadAll = async () => {
            try {
                let res = await Apis.get(endpoints['load-profile-doctor-by-userId'](current_user?.userId));
                setProfileDoctorByUserId(res.data);
                if (res.data.length === 0) {
                    toast.info("Vui lòng tạo hồ sơ trước khi đăng ký lịch khám!");
                    nav('/profiledoctor');
                }
                if (res.data[0] !== undefined) {
                    setSeletedProfileDoctorId(res.data[0].profileDoctorId)
                }
                console.log(res.data);
                let ses = await authApi().get(endpoints['load-custom-timeslot'](res.data[0].profileDoctorId))
                console.log(ses.data)
                const newEvents = ses.data.map((result) => ({
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
        console.log(value, timeBegin, timeEnd, formattedTime)
    }, [selectedProfileDoctorId]);

    const profileDoctorChange = (e) => {
        setSeletedProfileDoctorId(e.target.value);
        setSelectedTimeSlots([]);
    }

    console.log(selectedTimeSlots);

    const [value, setValue] = useState(new Date());

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    const hours = String(value.getHours()).padStart(2, "0");
    const minutes = String(value.getMinutes()).padStart(2, "0");
    const seconds = String(value.getSeconds()).padStart(2, "0");

    const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    const [timeBegin, setTimeBegin] = useState(null);

    const onTimeBeginChange = (newValue) => {
        setTimeBegin(newValue);
    };

    const [timeEnd, setTimeEnd] = useState(new Date());

    const onTimeEndChange = (newValue) => {
        setTimeEnd(newValue);
    };

    const [note, setNote] = useState('')

    const localizer = momentLocalizer(moment)

    const formats = {
        timeGutterFormat: 'HH:mm', // Định dạng cho thời gian trong bảng điều khiển thời gian (time column)
        eventTimeRangeFormat: ({ start, end }) => {
            const startTime = moment(start).format('HH:mm'); // Định dạng thời gian bắt đầu
            const endTime = moment(end).format('HH:mm'); // Định dạng thời gian kết thúc
            return `${startTime} - ${endTime}`;
        },
    };

    const [events, setEvents] = useState([]);

    const [showModal, setShowModal] = useState(false)

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
                let res = await authApi().post(endpoints['add-timeslot'], {
                    "timeBegin": moment(timeBegin).format("YYYY-MM-DD HH:mm:ss"),
                    "timeEnd": moment(timeEnd).format("YYYY-MM-DD HH:mm:ss"),
                    "note": note,
                    "profileDoctorId": selectedProfileDoctorId
                })
                console.log(res.data)
            }
            setShowModal(false)
            setNote('')
            setSelectedEvent(null);
        }
    }

    return <>
        <div className="Custom_Schedule_Wrapper">
            <div className="Custom_Schedule">
                {/* <div className="Custom_Schedule_Left">
                    <div className="Custom_Schedule_Left_Content">
                        <DoctorMenu />
                    </div>
                </div> */}
                <div className="Custom_Schedule_Right">
                    <div className="Custom_Schedule_Right_Content">
                        <h2 className="text-center">Đăng ký lịch khám tùy chỉnh</h2>
                        <div className="Custom_Schedule_Profile_Option">
                            <Form.Label style={{ width: "30%" }}>Chọn hồ sơ</Form.Label>
                            <select className="value" defaultValue={selectedProfileDoctorId} onChange={(e) => profileDoctorChange(e)} onFocus={(e) => profileDoctorChange(e)}>
                                {Object.values(profileDoctorByUserId).map(pd => <option key={pd.profileDoctorId} value={pd.profileDoctorId}>{pd.name}</option>)}
                            </select>
                        </div>
                        <div>
                            {/* <Calendar onChange={onChange} value={value} /> */}
                            {/* <DndProvider backend={HTML5Backend}> */}
                            <Calendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: 500 }}
                                formats={formats}
                                defaultView="day"
                                views={["month", "week", "day", "agenda"]}
                                selectable={true}
                                onSelectSlot={handleSelectSlot}
                                onSelectEvent={handleSelectEvent}
                            />
                            {/* </DndProvider> */}
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
                                            <Modal.Title>{selectedEvent ? 'Chỉnh sửa lịch khám' : 'Đăng ký lịch khám'}</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body className="Custom_Schedule_Option">
                                            <div className="Custom_Schedule_Profile_Option">
                                                <Form.Label style={{ width: "30%" }}>Chọn hồ sơ</Form.Label>
                                                <select className="value" defaultValue={selectedProfileDoctorId} onChange={(e) => profileDoctorChange(e)} onFocus={(e) => profileDoctorChange(e)}>
                                                    {Object.values(profileDoctorByUserId).map(pd => <option key={pd.profileDoctorId} value={pd.profileDoctorId}>{pd.name}</option>)}
                                                </select>
                                            </div>
                                            <div className="Custom_Schedule_Profile_Option">
                                                <Form.Label style={{ width: "30%" }}>Nội dung</Form.Label>
                                                <Form.Control as="textarea" aria-label="With textarea" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nhập nội dung ghi chú..." />
                                            </div>
                                            <div className="Custom_Schedule_Profile_Option">
                                                <Form.Label style={{ width: "23%" }}>Bắt đầu</Form.Label>
                                                <DateTimePicker onChange={onTimeBeginChange} value={timeBegin} clearIcon={null} />
                                            </div>
                                            <div className="Custom_Schedule_Profile_Option">
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
            </div>
        </div >
    </>
}

export default CustomSchedule;