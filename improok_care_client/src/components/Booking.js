import { useEffect, useState } from "react";
import "../styles/Booking.css"
import Apis, { endpoints } from "../configs/Apis";
import googleplay from "../assests/images/googleplay.svg"
import appstore from "../assests/images/appstore.svg"
import maledoctor from "../assests/images/male-doctor.png"
import femaledoctor from "../assests/images/female-doctor.png"
import profileicon from "../assests/images/profile-icon.png"
import { TiTickOutline } from "react-icons/ti";
import { FcSearch } from "react-icons/fc";
import { Link } from "react-router-dom";
import doctorprofile from "../assests/images/doctor-profile-icon.png"

const Booking = () => {
    const [specialty, setSpecialty] = useState([]);
    const [imageClick, setImageClick] = useState(true);
    const [listDoctor, setListDoctor] = useState([]);

    const checkImageClick = () => {
        setImageClick(!imageClick);
    }

    // useEffect(() => {
    //     const loadProfileDoctorById = async () => {
    //         try {
    //             let res = await Apis.get(endpoints['specialty']);
    //             setSpecialty(res.data);
    //             console.log(res.data);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }

    //     loadProfileDoctorById();
    // }, [])

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
    }, [])


    return <>
        <div class="Booking_Wrapper">
            <div class="Booking_Content_1">
                <div>
                    <div class="Booking_Content_1_Header">
                        <h3>Đặt khám bác sĩ</h3>
                        <h5>Đặt khám với hơn 500 bác sĩ đã kết nối chính thức với IMPROOKCARE để có số thứ tự và khung giờ khám trước</h5>
                    </div>
                    <div class="Booking_Content_1_Content">
                        <input type="text" placeholder="Nhập tên bác sĩ...." />
                        <button><FcSearch /></button>
                    </div>
                </div>
            </div>
            <div class="Booking_Content">
                <div class="Booking_Content_2">
                    <div class="Booking_Content_2_Header">
                        <h4>Đặt khám bác sĩ</h4>
                    </div>
                    <div class="Booking_Content_2_Content">
                        <div class="Doctor_List">
                            {Object.values(listDoctor).map(ld => {
                                let url = `/doctor/${ld.profileDoctorId}`
                                return <>
                                    <div class="Doctor_Item">
                                        <img src={ld.userId?.avatar === null ? doctorprofile : ld.userId?.avatar} style={{ width: '30%' }} alt="404" />
                                        <span style={{ fontSize: '1.2rem' }}><strong>{ld.name}</strong></span>
                                        <span>{ld.specialtyId.specialtyName}</span>
                                        <button class="Booking_Now"><Link to={url} style={{ color: 'white' }}>Đặt khám ngay</Link></button>
                                    </div>
                                </>
                            })}
                        </div>
                    </div>
                </div>
                <div class="Booking_Content_3">
                    <div class="Booking_Content_3_Header">
                        <h3>Đa dạng chuyên khoa khám bệnh</h3>
                        <h5>Đặt khám dễ dàng và tiện lợi hơn với đầy đủ các chuyên khoa</h5>
                    </div>
                    <div class="Booking_Content_3_Content">
                        <div class="Specialty_List">
                            {Object.values(specialty).map(s => {
                                return <>
                                    <div class="Specialty_Item">
                                        <img src={s.avatar} alt="404" />
                                        <span>{s.specialtyName}</span>
                                    </div>

                                </>
                            })}
                        </div>
                    </div>
                </div>
                <div class="Booking_Content_4">
                    <div class="Booking_Content_4_Header">
                        <h3>An tâm tìm và đặt bác sĩ</h3>
                        <h5>Hơn 500 bác sĩ liên kết chính thức với I'MPROOKCARE</h5>
                    </div>
                    <div class="Booking_Content_4_Content">
                        <div class="Booking_Content_4_LeftContent">
                            {imageClick === true ? <img src={femaledoctor} alt="doctor" style={{ width: '100%' }} /> : <img src={maledoctor} alt="doctor" style={{ width: '100%' }} />}
                        </div>
                        <div class="Booking_Content_4_RightContent">
                            <div >
                                <div class="Separate"></div>
                                <div onClick={checkImageClick}>
                                    <h5 style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Đội ngũ bác sĩ</h5>
                                    <h6 style={{ fontWeight: '400' }}>Tất cả các bác sĩ đều liên kết chính thức với IMPROOKCARE.</h6>
                                </div>
                            </div>
                            <hr />
                            <div>
                                <div class="Separate"></div>
                                <div onClick={checkImageClick}>
                                    <h5 style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Đặt khám dễ dàng, nhanh chóng, chủ động</h5>
                                    <h6 style={{ fontWeight: '400' }}>Chỉ với 1 phút, bạn có thể đặt khám thành công với bác sĩ.</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="Booking_Content_5">
                <div>
                    <div class="Booking_Content_5_Left">
                        <h3>Tải ứng dụng IMPROOKCARE</h3>
                        <ul>
                            <li>
                                <TiTickOutline />
                                <span>Đặt khám bác sĩ</span>
                            </li>
                            <li>
                                <TiTickOutline />
                                <span>Tiện lợi - Nhanh chóng - Dễ dàng</span>
                            </li>
                        </ul>
                        <div>
                            <Link to="/" style={{ marginRight: '1rem' }}><img src={googleplay} alt="GooglePlay" /></Link>
                            <Link to="/"><img src={appstore} alt="AppStore" /></Link>
                        </div>
                    </div>
                    <div class="Booking_Content_5_Right">
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Booking;