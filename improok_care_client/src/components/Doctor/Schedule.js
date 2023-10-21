import { useContext, useEffect, useState } from "react";
import "../../styles/Schedule.css";
import { MyUserContext } from "../../App";
import { useNavigate, Link } from "react-router-dom";
import { Form } from "react-bootstrap";
import Apis, { authApi, endpoints } from "../../configs/Apis";
import { toast } from "react-toastify";
import MySpinner from "../../layout/MySpinner";

const Schedule = () => {
    const [current_user, dispatch] = useContext(MyUserContext);
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

    // const dateInput = document.getElementById('dateInput');
    // const selectedDate = dateInput.value; // Lấy giá trị ngày từ trường input

    // const formattedDate = new Date(selectedDate).toISOString().split('T')[0];

    const logout = () => {
        dispatch({
            "type": "logout"
        })
        nav("/")
    }

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
    }, [selectedTimeDistanceId, current_user.userId])



    useEffect(() => {
        const loadProfileDoctorByUserId = async () => {
            try {
                let res = await Apis.get(endpoints['load-profile-doctor-by-userId'](current_user.userId));
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
                    // toast(res.data)
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
        <div class="Schedule_Wrapper">
            <div class="Schedule">
                <div class="Schedule_Left">
                    <div class="Schedule_Left_Content">
                        <ul>
                            <li><Link to="/doctor">Thông tin cá nhân</Link></li>
                            {/* <li><Link to="/changepassword">Đổi mật khẩu</Link></li> */}
                            <li><Link to="/schedule">Đăng ký lịch khám</Link></li>
                            <li><Link to="/bookingmanagement">Lịch hẹn</Link></li>
                            <li><Link to="/profiledoctor">Hồ sơ</Link></li>
                            <li><Link to="/doctormessage">Tin nhắn</Link></li>
                            <li onClick={logout}>Đăng xuất</li>
                        </ul>
                    </div>
                </div>
                {/* <button onClick={scheduleCheck}>Xem</button> */}
                <div class="Schedule_Right">
                    <div class="Schedule_Right_Content">
                        <h3 className="text-center text-primary">ĐĂNG KÝ LỊCH KHÁM BỆNH</h3>
                        <div class="Schedule_Option">
                            <div class="Schedule_Date_Option">
                                <Form.Label style={{ width: "30%" }}>Chọn ngày</Form.Label>
                                <input type="date" style={{ width: "60%" }} defaultValue={minDate} onChange={() => scheduleDateChange()} id="dateInput" min={minDate} />
                            </div>
                            <div class="Schedule_Profile_Option">
                                <Form.Label style={{ width: "30%" }}>Chọn hồ sơ</Form.Label>
                                <select class="value" defaultValue={selectedProfileDoctorId} onChange={(e) => profileDoctorChange(e)} onFocus={(e) => profileDoctorChange(e)}>
                                    {Object.values(profileDoctorByUserId).map(pd => <option key={pd.profileDoctorId} value={pd.profileDoctorId}>{pd.name}</option>)}
                                </select>
                            </div>
                            <div class="Schedule_Distance_Option">
                                <Form.Label class="label" style={{ width: "40%" }}>Chọn giãn cách</Form.Label>
                                <select class="value" defaultValue={selectedTimeDistanceId} onChange={timeDistanceChange} onFocus={timeDistanceChange}>
                                    {Object.values(timeDistance).map(td => <option key={td.timeDistanceId} value={td.timeDistanceId}>{td.timeDistanceValue}</option>)}
                                </select>
                            </div>
                        </div>
                        <div class="Schedule_Timeslot">
                            <div class="TimeSlot_Option">
                                {loading === true ? <MySpinner /> :
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
                    <div class="Create_Butt">
                        <button class="Create_Schedule_Butt" onClick={addSchedule}>Tạo lịch khám</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Schedule;