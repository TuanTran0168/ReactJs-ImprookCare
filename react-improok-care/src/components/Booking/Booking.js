import { useContext, useEffect, useState } from "react";
import "./Booking.css"
import Apis, { endpoints } from "../../configs/Apis";
import googleplay from "../../assets/images/googleplay.svg"
import appstore from "../../assets/images/appstore.svg"
import maledoctor from "../../assets/images/male_banner.png"
import femaledoctor from "../../assets/images/medical-app.png"
import { TiTick } from "react-icons/ti";
import { FcSearch } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import doctorprofile from "../../assets/images/doctor-profile-icon.png"
import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css';
import { UserContext, WebSocketContext } from "../../App";
import { reConnectNotification } from "../../utils/WebSocket";
import cookie from "react-cookies";

const Booking = () => {
    const [current_user,] = useContext(UserContext)
    const [webSocket,] = useContext(WebSocketContext);
    const [specialty, setSpecialty] = useState([]);
    const [imageClick, setImageClick] = useState(true);
    const [listDoctor, setListDoctor] = useState([]);

    const checkImageClick = () => {
        setImageClick(!imageClick);
    }

    const [searchKw, setSearchKw] = useState('');

    const nav = useNavigate()

    useEffect(() => {
        const loadSpecialty = async () => {
            try {
                let res = await Apis.get(endpoints['specialty']);
                setSpecialty(res.data);
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        }

        const loadProfileDoctor = async () => {
            try {
                let res = await Apis.get(endpoints['load-profile-doctor']);
                setListDoctor(res.data);
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        loadProfileDoctor();
        loadSpecialty();
        console.log("Kết nối booking", cookie.load("socket"));
        let client = cookie.load("socket")
        console.log("Client", client?.connected);
        if (current_user && client) {
            cookie.remove("socket");
            reConnectNotification(false, current_user?.userId);
        }
    }, [])

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 4
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    const search = (evt) => {
        evt.preventDefault();
        nav(`/search?q=${searchKw}`)
    }

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            search(event);
        }
    };

    return <>
        <div className="Booking_Wrapper">
            <div className="Booking_Content_1">
                <div>
                    <div className="Booking_Content_1_Header">
                        <h3>Đặt khám bác sĩ</h3>
                        <h5>Đặt khám với hơn 500 bác sĩ đã kết nối chính thức với I'MPROOK CARE để có số thứ tự và khung giờ khám trước</h5>
                    </div>
                    <div className="Booking_Content_1_Content">
                        <input type="text" placeholder="Tìm theo bác sĩ, chuyên khoa, triệu chứng,.." value={searchKw} onChange={(e) => setSearchKw(e.target.value)} onKeyDown={(event) => handleKeyPress(event)} />
                        <button onClick={search}><FcSearch /></button>
                    </div>
                </div>
            </div>
            <div className="Booking_Content">
                <div className="Booking_Content_2">
                    <div className="Booking_Content_2_Header">
                        <h3>Đặt khám bác sĩ</h3>
                    </div>
                    <div className="Booking_Content_2_Content">
                        <div className="Doctor_List">
                            <Carousel
                                responsive={responsive}
                                sliderClass="Doctor_Carousel"
                                itemClass="custom-item"
                                centerMode={true}>
                                {Object.values(listDoctor).map(ld => {
                                    let url = `/doctor/${ld.profileDoctorId}`
                                    return (
                                        <div className="card">
                                            <div className="image-container"><img src={ld.userId?.avatar === null ? doctorprofile : ld.userId?.avatar} alt="404" /></div>
                                            <span style={{ fontSize: '1.2rem' }}><strong>{ld.name}</strong></span>
                                            <span>{ld.specialtyId.specialtyName}</span>
                                            <button className="Booking_Now"><Link to={url} style={{ color: 'white' }}>Đặt khám</Link></button>
                                        </div>
                                    )
                                })}
                            </Carousel>
                        </div>
                    </div>
                </div>
                <div className="Booking_Content_3">
                    <div className="Booking_Content_3_Header">
                        <h3>Đa dạng chuyên khoa khám bệnh</h3>
                        <h5>Đặt khám dễ dàng và tiện lợi hơn với đầy đủ các chuyên khoa</h5>
                    </div>
                    <div className="Booking_Content_3_Content">
                        <div className="Specialty_List">
                            {Object.values(specialty).map(s => {
                                return <>
                                    <div className="Specialty_Item">
                                        <img src={s.avatar} alt="404" />
                                        <span>{s.specialtyName}</span>
                                    </div>
                                </>
                            })}
                        </div>
                    </div>
                </div>
                <div className="Booking_Content_4">
                    <div className="Booking_Content_4_Header">
                        <h3>An tâm tìm và đặt bác sĩ</h3>
                        <h5>Hơn 500 bác sĩ liên kết chính thức với I'MPROOK CARE</h5>
                    </div>
                    <div className="Booking_Content_4_Content">
                        <div className="Booking_Content_4_LeftContent">
                            {imageClick === true ? <img src={femaledoctor} alt="doctor" style={{ width: '60%' }} /> : <img src={maledoctor} alt="doctor" style={{ width: '60%' }} />}
                        </div>
                        <div className="Booking_Content_4_RightContent">
                            <div>
                                <div className="Separate"></div>
                                <div onClick={checkImageClick} style={{ padding: '1.5rem' }}>
                                    <h5 style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Đội ngũ bác sĩ</h5>
                                    <h6 style={{ fontWeight: '400' }}>Tất cả các bác sĩ đều liên kết chính thức với I'MPROOK CARE. Đảm bảo lịch hẹn của bạn sẽ được tiếp nhận</h6>
                                </div>
                            </div>
                            <hr />
                            <div>
                                <div className="Separate"></div>
                                <div onClick={checkImageClick} style={{ padding: '1.5rem' }}>
                                    <h5 style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Đặt khám dễ dàng, nhanh chóng, chủ động</h5>
                                    <h6 style={{ fontWeight: '400' }}>Chỉ với 1 phút, bạn có thể đặt khám thành công với bác sĩ. Phiếu khám của bạn sẽ bao gồm thời gian dự kiến</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="Booking_Content_5">
                <div>
                    <div className="Booking_Content_5_Left">
                        <h3>Tải ứng dụng I'MPROOK CARE</h3>
                        <ul>
                            <li>
                                <TiTick />
                                <span>Đặt khám bác sĩ</span>
                            </li>
                            <li>
                                <TiTick />
                                <span>Tiện lợi - Nhanh chóng - Dễ dàng</span>
                            </li>
                        </ul>
                        <div>
                            <Link to="/" style={{ marginRight: '1rem' }}><img src={googleplay} alt="GooglePlay" /></Link>
                            <Link to="/"><img src={appstore} alt="AppStore" /></Link>
                        </div>
                    </div>
                    <div className="Booking_Content_5_Right">
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Booking;