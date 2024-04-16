import { useEffect, useState } from "react";
import "./Booking.css"
import Apis, { endpoints } from "../../configs/Apis";
import googleplay from "../../assets/images/googleplay.svg"
import appstore from "../../assets/images/appstore.svg"
import maledoctor from "../../assets/images/male-doctor.png"
import femaledoctor from "../../assets/images/female-doctor.png"
import profileicon from "../../assets/images/profile-icon.png"
import { TiTick } from "react-icons/ti";
import { FcSearch } from "react-icons/fc";
import { Link } from "react-router-dom";
import doctorprofile from "../../assets/images/doctor-profile-icon.png"
import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css';

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

    return <>
        <div className="Booking_Wrapper">
            <div className="Booking_Content_1">
                <div>
                    <div className="Booking_Content_1_Header">
                        <h3>Đặt khám bác sĩ</h3>
                        <h5>Đặt khám với hơn 500 bác sĩ đã kết nối chính thức với I'MPROOK CARE để có số thứ tự và khung giờ khám trước</h5>
                    </div>
                    <div className="Booking_Content_1_Content">
                        <input type="text" placeholder="Nhập tên bác sĩ,..." />
                        <button><FcSearch /></button>
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
                                centerMode={true}
                            >
                                {Object.values(listDoctor).map(ld => {
                                    let url = `/doctor/${ld.profileDoctorId}`
                                    return (
                                        <div className="card">
                                            <div className="image-container"><img src={ld.userId?.avatar === null ? doctorprofile : ld.userId?.avatar} alt="404" /></div>
                                            <span style={{ fontSize: '1.2rem' }}><strong>{ld.name}</strong></span>
                                            <span>{ld.specialtyId.specialtyName}</span>
                                            <button className="Booking_Now"><Link to={url} style={{ color: 'white' }}>Đặt khám ngay</Link></button>
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
                                        <img src="https://scontent.fsgn2-3.fna.fbcdn.net/v/t39.30808-6/308833424_3412840289039678_7588527159202436779_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeESeSkjjFrwi0j5G00D1nD2TXPvQH1oHStNc-9AfWgdK4S_Ru-9Y_OIPx-wimFYB2lnSevQgzJOC_Y-F8CJc9HO&_nc_ohc=bGOGlAnIkYYAX_U28sZ&_nc_ht=scontent.fsgn2-3.fna&oh=00_AfBvju079OsOeRgTfSSO55Ltq6hgS6S4we8Z7pLwrfmCFw&oe=65F8924D" alt="404" />
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
                            {imageClick === true ? <img src={femaledoctor} alt="doctor" style={{ width: '100%' }} /> : <img src={maledoctor} alt="doctor" style={{ width: '100%' }} />}
                        </div>
                        <div className="Booking_Content_4_RightContent">
                            <div>
                                <div className="Separate"></div>
                                <div onClick={checkImageClick} style={{ padding: '1.5rem' }}>
                                    <h5 style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Đội ngũ bác sĩ</h5>
                                    <h6 style={{ fontWeight: '400' }}>Tất cả các bác sĩ đều liên kết chính thức với I'MPROOK CARE.</h6>
                                </div>
                            </div>
                            <hr />
                            <div>
                                <div className="Separate"></div>
                                <div onClick={checkImageClick} style={{ padding: '1.5rem' }}>
                                    <h5 style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Đặt khám dễ dàng, nhanh chóng, chủ động</h5>
                                    <h6 style={{ fontWeight: '400' }}>Chỉ với 1 phút, bạn có thể đặt khám thành công với bác sĩ.</h6>
                                </div>
                            </div>
                            <hr />
                            <div>
                                <div className="Separate"></div>
                                <div onClick={checkImageClick} style={{ padding: '1.5rem' }}>
                                    <h5 style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Đặt khám dễ dàng, nhanh chóng, chủ động</h5>
                                    <h6 style={{ fontWeight: '400' }}>Chỉ với 1 phút, bạn có thể đặt khám thành công với bác sĩ.</h6>
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