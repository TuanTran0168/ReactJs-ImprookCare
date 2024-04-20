import { FcSearch } from "react-icons/fc";
import "./Home.css"
import { Link, useNavigate } from "react-router-dom";
import { FaBriefcaseMedical, FaEye, FaHandshake, FaHeartbeat, FaHospital, FaStethoscope } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { AiFillSecurityScan } from "react-icons/ai";
import { MdPayments } from "react-icons/md";
import googleplay from "../../assets/images/googleplay.svg"
import appstore from "../../assets/images/appstore.svg"
import doctor from "../../assets/images/stethoscope.png"
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import React, { useEffect, useState } from "react";
import Apis, { endpoints } from "../../configs/Apis";
import doctorprofile from "../../assets/images/doctor-profile-icon.png"

const Home = () => {
    const [searchKw, setSearchKw] = useState('');

    const nav = useNavigate();

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

    const [listDoctor, setListDoctor] = useState([]);
    const [listSpecialty, setListSpecialty] = useState([]);
    useEffect(() => {
        const loadProfileDoctor = async () => {
            try {
                let res = await Apis.get(endpoints['load-profile-doctor']);
                setListDoctor(res.data);
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        const loadSpecialty = async () => {
            try {
                let res = await Apis.get(endpoints['specialty']);
                setListSpecialty(res.data);
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        loadProfileDoctor();
        loadSpecialty();
    }, [])

    const search = (evt) => {
        evt.preventDefault();
        nav(`/search?q=${searchKw}`)
    }

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            search(event)
        }
    };

    return (
        <>
            <div className="Home_Wrapper">
                <div className="Home_Header">
                    <div>
                        <div className="Home_Content_1_Header">
                            <h3>Đặt khám bác sĩ</h3>
                            <h5>Đặt khám với hơn 500 bác sĩ đã kết nối chính thức với I'MPROOK CARE để có số thứ tự và khung giờ khám trước</h5>
                        </div>
                        <div className="Home_Content_1_Content">
                            <input type="text" placeholder="Tìm theo bác sĩ, chuyên khoa, triệu chứng,.." value={searchKw} onChange={(e) => setSearchKw(e.target.value)} onKeyDown={(event) => handleKeyPress(event)} />
                            <button onClick={search}><FcSearch /></button>
                        </div>
                    </div>
                </div>
                <div className="Home_Content">
                    <div className="Home_Service">
                        <div className="Home_Service_Cont">
                            <h3>Dịch vụ</h3>
                            <div className="Split_Bar"></div>
                        </div>
                        <Carousel
                            responsive={responsive}
                            sliderClass="Service_Carousel"
                            itemClass="custom-item"
                            centerMode={true}>
                            <div className="card">
                                <img src={doctor} alt="Doctor" style={{ width: "40%" }} />
                                <span>Đặt khám bác sĩ</span>
                            </div>
                            <div className="card">
                                <img src={doctor} alt="Doctor" style={{ width: "40%" }} />
                                <span>Tư vấn khám bệnh</span>
                            </div>
                            <div className="card">
                                <img src={doctor} alt="Doctor" style={{ width: "40%" }} />
                                <span>Đặt lịch xét nghiệm</span>
                            </div>
                            <div className="card">
                                <img src={doctor} alt="Doctor" style={{ width: "40%" }} />
                                <span>Gói khám sức khỏe</span>
                            </div>
                            <div className="card">
                                <img src={doctor} alt="Doctor" style={{ width: "40%" }} />
                                <span>Y tế tại nhà</span>
                            </div>
                            <div className="card">
                                <img src={doctor} alt="Doctor" style={{ width: "40%" }} />
                                <span>Thanh toán viện phí</span>
                            </div>
                        </Carousel>
                    </div>
                    <div className="Home_Doctor">
                        <div className="Home_Doctor_Cont">
                            <h3>Bác sĩ</h3>
                            <div className="Split_Bar"></div>
                        </div>
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
                    <div className="Home_Specialty">
                        <div className="Home_Specialty_Cont">
                            <h3>Chuyên khoa</h3>
                            <div className="Split_Bar"></div>
                        </div>
                        <Carousel
                            responsive={responsive}
                            sliderClass="Service_Carousel"
                            itemClass="custom-item"
                            centerMode={true}>
                            {Object.values(listSpecialty).map(ls => {
                                return (
                                    <div className="card">
                                        <div className="image-container"><img src={ls.avatar} alt="Specialty" /></div>
                                        <span>{ls.specialtyName}</span>
                                    </div>
                                )
                            })}
                        </Carousel>
                    </div>
                    <div className="Home_News">
                        <div>
                            <h3>Tin tức</h3>
                            <div className="Split_Bar"></div>
                            <div className="Home_News_Content">
                                <div>
                                    <div>
                                        <div><img src="https://hoanmy.com/wp-content/uploads/2024/01/AdobeStock_181413640-scaled.jpeg" alt="Doctor" /></div>
                                        <div className="brand_date">
                                            <div className="brand_name">I'MPROOK</div>
                                            <div className="date_news">22 Mar 2024</div>
                                        </div>
                                        <div className="separate"></div>
                                        <div><span>Những biến chứng nguy hiểm của đái tháo đường và cách phòng ngừa</span></div>
                                        <div><p>Thời gian gần đây, tỷ lệ người bệnh đái tháo đường đang gia tăng khá cao. Theo số liệu từ Hiệp hội Đái tháo đường Thế giới (International Diabetes Federation – IDF), vào năm 2019, thế giới có khoảng 463 triệu người mắc phải bệnh lý này. Trong số đó, ước tính hơn 4 triệu người liên quan đã tử vong.</p></div>
                                    </div>
                                    <button>Đọc thêm</button>
                                </div>
                                <div>
                                    <div>
                                        <div><img src="https://hoanmy.com/wp-content/uploads/2024/01/Bac-si-thuc-hien-Sinh-thiet-bang-kim-duoi-huong-dan-cua-CT-min.png" alt="Doctor" /></div>
                                        <div className="brand_date">
                                            <div className="brand_name">I'MPROOK</div>
                                            <div className="date_news">28 Mar 2024</div>
                                        </div>
                                        <div className="separate"></div>
                                        <div><span>Bệnh ung thư có thể chữa khỏi hoàn toàn nếu phát hiện sớm</span></div>
                                        <div><p>“Ung thư là căn bệnh đồng nghĩa với cái chết” – đó là suy nghĩ của nhiều người khi nhắc đến bệnh ung thư. Tuy nhiên, trên thực tế, có khoảng 80% người bệnh ung thư có thể hoàn toàn khỏi bệnh và không tái phát trong vòng 5 năm nếu phát hiện sớm và điều trị kịp thời. Hãy hiểu đúng về ung thư để chủ động đẩy lùi bệnh.</p></div>
                                    </div>
                                    <button>Đọc thêm</button>
                                </div>
                                <div>
                                    <div>
                                        <div><img src="https://hoanmy.com/wp-content/uploads/2024/01/AdobeStock_590426101-scaled.jpeg" alt="Doctor" /></div>
                                        <div className="brand_date">
                                            <div className="brand_name">I'MPROOK</div>
                                            <div className="date_news">29 Mar 2024</div>
                                        </div>
                                        <div className="separate"></div>
                                        <div><span>Rối loạn tiền đình và những phương pháp điều trị hiệu quả</span></div>
                                        <div><p>Rối loạn tiền đình là một trong những bệnh lý phổ biến hiện nay. Nhiều người thường bị chóng mặt, đau đầu, xoay tròn và mất thăng bằng… mà không hề biết đây là dấu hiệu của rối loạn tiền đình. Tình trạng này gây khó khăn khi sinh hoạt, tăng nguy cơ té ngã dẫn đến chấn thương và nhiều biến chứng nguy hiểm khác. Đó chính là lý do mà chúng ta cần tìm hiểu kỹ về căn bệnh này để có thể kịp thời chữa trị.</p></div>
                                    </div>
                                    <button>Đọc thêm</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="Home_Why">
                        <div>
                            <h3>5000+ người dùng chọn I'MPROOK CARE</h3>
                            <div className="Split_Bar"></div>
                            <ul>
                                <li>
                                    <div><FaUserDoctor className="why_icon" /></div>
                                    <span>Bác sĩ chuyên nghiệp</span>
                                    <p>Hệ thống bệnh viện và phòng khám của chúng tôi sở hữu đội ngũ bác sĩ siêng năng và tận tụy, hết mình nâng cao sức khỏe cho cộng đồng Việt Nam.</p>
                                </li>
                                <li>
                                    <div><FaBriefcaseMedical className="why_icon" /></div>
                                    <span>Người bệnh là trung tâm</span>
                                    <p>Cam kết đem lại sự xuất sắc trong chuyên môn y khoa, đồng thời cung cấp dịch vụ chăm sóc chất lượng cao, giá cả phải chăng, tập trung vào sức khỏe của người bệnh.</p>
                                </li>
                                <li>
                                    <div><FaHeartbeat className="why_icon" /></div>
                                    <span>Chăm sóc tận tình</span>
                                    <p>Các dịch vụ cấp cứu và điều trị 24/24 tại các bệnh viện đảm bảo người bệnh luôn luôm nhận được sự an tâm và các dịch vụ chăm sóc y tế kịp thời.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="Home_Stats">
                        <div>
                            <h3>Những con số</h3>
                            <div className="Split_Bar"></div>
                            <ul>
                                <li>
                                    <div><FaStethoscope className="stats_icon" /></div>
                                    <span>1.1M+ lượt khám</span>
                                </li>
                                <li>
                                    <div><FaUserDoctor className="stats_icon" /></div>
                                    <span>500+ bác sĩ</span>
                                </li>
                                <li>
                                    <div><FaHospital className="stats_icon" /></div>
                                    <span>25+ bệnh viện</span>
                                </li>
                                <li>
                                    <div><FaEye className="stats_icon" /></div>
                                    <span>3.2K+ lượt truy cập</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="Home_Footer">
                    <div>
                        <div className="Home_Content_5_Left">
                            <h3>Tải ứng dụng I'MPROOK CARE</h3>
                            <ul>
                                <li>
                                    <FaHospital />
                                    <span>Đặt lịch khám bệnh</span>
                                </li>
                                <li>
                                    <FaHandshake />
                                    <span>Tư vấn trực tuyến</span>
                                </li>
                                <li>
                                    <AiFillSecurityScan />
                                    <span>Lưu trữ hồ sơ sức khỏe</span>
                                </li>
                                <li>
                                    <MdPayments />
                                    <span>Thanh toán dịch vụ trực tuyến</span>
                                </li>
                            </ul>
                            <div>
                                <Link to="/" style={{ marginRight: '1rem' }}><img src={googleplay} alt="GooglePlay" /></Link>
                                <Link to="/"><img src={appstore} alt="AppStore" /></Link>
                            </div>
                        </div>
                        <div className="Home_Content_5_Right">
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Home;