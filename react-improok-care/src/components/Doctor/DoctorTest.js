import { useContext, useEffect, useState } from "react";
import "./DoctorTest.css";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import Apis, { authApi, endpoints } from "../../configs/Apis";
import { toast } from "react-toastify";
import Spinner from "../../layout/Spinner";
import DoctorMenu from "../../layout/DoctorLayout/DoctorMenu";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const DoctorTest = () => {
    const [current_user,] = useContext(UserContext);
    const nav = useNavigate();
    const [minDate, setMinDate] = useState('');
    const [timeDistance, setTimeDistance] = useState([]);
    const [timeSlot, setTimeSlot] = useState([]);
    const [profileDoctorByUserId, setProfileDoctorByUserId] = useState([]);
    const [selectedProfileDoctorId, setSeletedProfileDoctorId] = useState();
    const [selectedTimeDistanceId, setSelectedTimeDistanceId] = useState('1');
    const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
    const [timeSlotCheck, setTimeSlotCheck] = useState([]);
    const [checkSchedule, setCheckSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedTime, setSelectedTime] = useState(null);
    const [value, setValue] = useState(dayjs('2022-04-17T15:30'));

    const handleTimeChange = (time) => {
        setSelectedTime(time);
    };

    // const dateInput = document.getElementById('dateInput');
    // const selectedDate = dateInput.value; // Lấy giá trị ngày từ trường input

    // const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setMinDate(today);
    }, []);

    useEffect(() => {
        setLoading(true);
        const loadTimeDistance = async () => {
            try {
                let res = await Apis.get(endpoints['time-distance']);
                setTimeDistance(res.data);
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        }

        const loadTimeSlot = async () => {
            try {
                let res = await Apis.get(endpoints['time-slot'](selectedTimeDistanceId));
                setTimeSlot(res.data);
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        }

        loadTimeDistance();
        loadTimeSlot();
        setLoading(false);
    }, [selectedTimeDistanceId, current_user?.userId])

    useEffect(() => {
        const loadProfileDoctorByUserId = async () => {
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
            } catch (error) {
                console.log(error);
            }
        }
        loadProfileDoctorByUserId();
    }, [])

    // useEffect(() => {
    //     const scheduledCheck = async () => {
    //         try {
    //             const dateInput = document.getElementById('dateInput');
    //             const selectedDate = dateInput.value; // Lấy giá trị ngày từ trường input

    //             const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
    //             const registeredSlots = [];
    //             for (let i = 0; i < timeSlot.length; i++) {
    //                 const timeSlotId = timeSlot[i];

    //                 let res = await Apis.post(endpoints['check-scheduled'], {
    //                     "profileDoctorId": current_user.userId,
    //                     "date": formattedDate,
    //                     "timeSlotId": timeSlotId
    //                 });

    //                 if (res.data === "Lịch chữa bệnh đã đăng ký!") {
    //                     registeredSlots.push({
    //                         profileDoctorId: current_user.userId,
    //                         date: formattedDate,
    //                         timeSlotId: timeSlotId,
    //                     });
    //                 }
    //                 setCheckSchedule(registeredSlots);
    //                 console.log(registeredSlots);
    //             }
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    //     scheduledCheck();
    // }, [selectedProfileDoctorId, selectedTimeDistanceId])

    const scheduleCheck = (evt, timeSlotId) => {
        evt.preventDefault();

        const process = async () => {
            try {
                const dateInput = document.getElementById('dateInput');
                const selectedDate = dateInput.value; // Lấy giá trị ngày từ trường input

                const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
                console.log(selectedProfileDoctorId, formattedDate, timeSlotId)
                let res = await Apis.post(endpoints['check-scheduled'], {
                    "profileDoctorId": selectedProfileDoctorId,
                    "date": formattedDate,
                    "timeSlotId": timeSlotId
                });
                if (res.data === "Lịch chữa bệnh chưa đăng ký!") {
                    const isSelected = selectedTimeSlots.includes(timeSlotId);

                    if (isSelected) {
                        setSelectedTimeSlots(selectedTimeSlots.filter(id => id !== timeSlotId));
                    } else {
                        setSelectedTimeSlots([...selectedTimeSlots, timeSlotId]);
                    }
                }
                else {
                    toast(res.data)
                }
                setCheckSchedule(res.data);
                console.log(res.data);
            } catch (error) {
                console.log(error);
                toast.error("Có lỗi xảy ra!")
            }
        }
        process();
    }

    const timeDistanceChange = (e) => {
        setSelectedTimeDistanceId(e.target.value);
        setSelectedTimeSlots([]);
    }

    const profileDoctorChange = (e) => {
        setSeletedProfileDoctorId(e.target.value);
        setSelectedTimeSlots([]);
    }

    const scheduleDateChange = () => {
        setSelectedTimeSlots([]);
    }
    // const timeSlotClickCheck = (timeSlotId) => {
    //     const isSelected = selectedTimeSlots.includes(timeSlotId);

    //     if (isSelected) {
    //         setSelectedTimeSlots(selectedTimeSlots.filter(id => id !== timeSlotId));
    //     } else {
    //         setSelectedTimeSlots([...selectedTimeSlots, timeSlotId]);
    //     }
    // }

    const addSchedule = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                setLoading(true);
                const dateInput = document.getElementById('dateInput');
                const selectedDate = dateInput.value; // Lấy giá trị ngày từ trường input

                const formattedDate = new Date(selectedDate).toISOString().split('T')[0]; // Định dạng lại ngày thành "yyyy-MM-dd"

                if (selectedTimeSlots.length === 0) {
                    toast.warning("Vui lòng chọn ít nhất một khung giờ trước khi lưu.");
                    setLoading(false);
                    return;
                }

                for (let i = 0; i < selectedTimeSlots.length; i++) {

                    const timeSlotId = selectedTimeSlots[i];
                    let res = await authApi().post(endpoints['add-schedule'], {
                        "profileDoctorId": selectedProfileDoctorId,
                        "date": formattedDate,
                        "timeSlotId": timeSlotId
                    });
                    console.log(res.data);
                }
                toast.success("Tạo lịch khám thành công!")
                setLoading(false);

            } catch (error) {
                console.log(error);
                toast.error("Có lỗi xảy ra!")
            }
        }
        process();
    }

    console.log(selectedTimeSlots);
    // console.log(current_user.userId);

    return <>
        <div className="Schedule_Wrapper">
            <div className="Schedule">
                <div className="Schedule_Left">
                    <div className="Schedule_Left_Content">
                        <DoctorMenu />
                    </div>
                </div>
                {/* <button onClick={scheduleCheck}>Xem</button> */}
                <div className="Schedule_Right">
                    <div className="Schedule_Right_Content">
                        <h2 className="text-center">Đăng ký lịch khám bệnh</h2>
                        <div className="Schedule_Option">
                            <div className="Schedule_Date_Option">
                                <Form.Label style={{ width: "30%" }}>Chọn ngày</Form.Label>
                                <input type="date" defaultValue={minDate} onChange={() => scheduleDateChange()} id="dateInput" min={minDate} />
                            </div>
                            <div className="Schedule_Profile_Option">
                                <Form.Label style={{ width: "30%" }}>Chọn hồ sơ</Form.Label>
                                <select className="value" defaultValue={selectedProfileDoctorId} onChange={(e) => profileDoctorChange(e)} onFocus={(e) => profileDoctorChange(e)}>
                                    {Object.values(profileDoctorByUserId).map(pd => <option key={pd.profileDoctorId} value={pd.profileDoctorId}>{pd.name}</option>)}
                                </select>
                            </div>
                            <div className="Schedule_Distance_Option">
                                <Form.Label className="label" style={{ width: "30%" }}>Chọn giãn cách</Form.Label>
                                <select className="value" defaultValue={selectedTimeDistanceId} onChange={timeDistanceChange} onFocus={timeDistanceChange}>
                                    {Object.values(timeDistance).map(td => <option key={td.timeDistanceId} value={td.timeDistanceId}>{td.timeDistanceValue}</option>)}
                                </select>
                            </div>
                            <div className="Schedule_Distance_Option">
                                <Form.Label className="label" style={{ width: "30%" }}>Giờ bắt đầu</Form.Label>
                                {/* <select className="value" defaultValue={selectedTimeDistanceId} onChange={timeDistanceChange} onFocus={timeDistanceChange}>
                                    {Object.values(timeDistance).map(td => <option key={td.timeDistanceId} value={td.timeDistanceId}>{td.timeDistanceValue}</option>)}
                                </select> */}
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['TimePicker', 'TimePicker']}>
                                        <TimePicker
                                            label="Uncontrolled picker"
                                            defaultValue={dayjs('2022-04-17T15:30')}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </div>
                            <div className="Schedule_Distance_Option">
                                <Form.Label className="label" style={{ width: "30%" }}>Giờ kết thúc</Form.Label>
                                {/* <select className="value" defaultValue={selectedTimeDistanceId} onChange={timeDistanceChange} onFocus={timeDistanceChange}>
                                    {Object.values(timeDistance).map(td => <option key={td.timeDistanceId} value={td.timeDistanceId}>{td.timeDistanceValue}</option>)}
                                </select> */}
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['TimePicker', 'TimePicker']}>
                                        <TimePicker
                                            label="Uncontrolled picker"
                                            defaultValue={dayjs('2022-04-17T15:30')}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </div>
                        </div>
                        <div className="Schedule_Timeslot">
                            <h4 className="text-center">Danh sách lịch khám đã đăng ký</h4>
                            <div className="TimeSlot_Option">
                                {loading === true ? <Spinner /> :
                                    <>
                                        {Object.values(timeSlot).map(ts => {
                                            const timeBegin = new Date(ts.timeBegin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                            const timeEnd = new Date(ts.timeEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                            const isSelected = selectedTimeSlots.includes(ts.timeSlotId);
                                            return (
                                                <span key={ts.timeSlotId} value={ts.timeSlotId}
                                                    style={{ marginRight: '10px', background: isSelected ? 'lightblue' : 'white' }}
                                                    onClick={(e) => scheduleCheck(e, ts.timeSlotId)}>
                                                    {timeBegin} - {timeEnd}
                                                </span>
                                            );
                                        })}
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="Create_Butt">
                        <button className="Create_Schedule_Butt" onClick={addSchedule}>Tạo lịch khám</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default DoctorTest;