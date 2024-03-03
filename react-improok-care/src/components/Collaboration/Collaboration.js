import { useEffect, useState } from "react";
import "./Collaboration.css"
import Apis, { endpoints } from "../../configs/Apis";
import googleplay from "../../assets/images/googleplay.svg"
import appstore from "../../assets/images/appstore.svg"
// import maledoctor from "../../assets/images/male-doctor.png"
// import femaledoctor from "../../assets/images/female-doctor.png"
import setting from "../../assets/images/settings.png"
import timetable from "../../assets/images/timetable.png"
import phonecall from "../../assets/images/phone-call.png"
import medicalapp from "../../assets/images/medical-app.png"
import bannerheader from "../../assets/images/banner-header.png"
import advice from "../../assets/images/advice.png"
import managementapp from "../../assets/images/management-app.png"
import collabdoctor from "../../assets/images/collab-doctor-register.png"
import { TiTickOutline } from "react-icons/ti";
import { Link } from "react-router-dom";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";

const Collaboration = () => {
    const [name, setName] = useState();
    const [phonenumber, setPhonenumber] = useState();
    const [email, setEmail] = useState();
    const [loading, setLoading] = useState(false);

    const addCollabDoctor = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                setLoading(true);
                let res = await Apis.post(endpoints['add-collab-doctor'], {
                    "name": name,
                    "phonenumber": phonenumber,
                    "email": email
                });
                toast.success(res.data)
                console.log(res.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
        process();
    }

    return <>
        <div className="CollabDoctor_Wrapper">
            <div className="CollabDoctor_Content">
                <div className="CollabDoctor_Content_1">
                    <div className="CollabDoctor_Content_1_Header">
                        <div>
                            <h1>IM'PROOK CARE.</h1>
                            <h2>Giải pháp chuyển đổi số phòng khám</h2>
                        </div>
                        <div>
                            <p>I'MPROOK cung cấp giải <strong>pháp chuyển đổi số</strong> giúp bác sĩ vận hành phòng khám hiệu quả,
                                quản lý và lưu trữ hồ sơ bệnh nhân cũng như nâng cao danh tiếng, chất lượng dịch vụ.</p>
                        </div>
                        <div>
                            <button><a href="#register_collab">Đăng ký hợp tác</a></button>
                        </div>
                    </div>
                    <div className="CollabDoctor_Content_1_Content">
                        <div>
                            <img src={bannerheader} alt="Header" width={'80%'} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="CollabDoctor_Content">
                <div className="CollabDoctor_Content_2">
                    <div className="CollabDoctor_Content_2_Detail_1">
                        <div>
                            <img src={setting} alt="setting" width={'40%'} />
                            <h4>Phần mềm <span>Quản lý phòng khám</span></h4>
                            <ul>
                                <li>Quản lý khám bệnh</li>
                                <li>Lưu trữ hồ sơ</li>
                                <li>Kết nối bác sĩ</li>
                                <li>Kết quả nhanh chóng</li>
                                <li>An toàn bảo mật</li>
                            </ul>
                        </div>
                    </div>
                    <div className="CollabDoctor_Content_2_Detail_2">
                        <div>
                            <img src={timetable} alt="timetable" width={'40%'} />
                            <h4>Ứng dụng <span>Quản lý thời gian khám</span></h4>
                            <ul>
                                <li>Quản lý lịch khám</li>
                                <li>Quản lý hồ sơ</li>
                                <li>Tư vấn trực tuyến</li>
                                <li>Đặt khám miễn phí</li>
                                <li>Thời gian linh hoạt</li>
                            </ul>
                        </div>
                    </div>
                    <div className="CollabDoctor_Content_2_Detail_3">
                        <div>
                            <img src={phonecall} alt="phonecall" width={'40%'} />
                            <h4>Nền tảng <span>Hỗ trợ tư vấn trực tuyến</span></h4>
                            <ul>
                                <li>Chủ động thời gian</li>
                                <li>Hỗ trợ khám nhanh</li>
                                <li>Rút ngắn khoảng cách</li>
                                <li>Đảm bảo kết nối</li>
                                <li>Linh hoạt không gian</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="CollabDoctor_Content_3">
                    <div className="CollabDoctor_Content_3_Header">
                        <h1>Ứng dụng <strong>Quản lý lịch khám</strong></h1>
                    </div>
                    <div className="CollabDoctor_Content_3_Content">
                        <div className="CollabDoctor_Content_4_LeftContent">
                            <img src={medicalapp} alt="Medical App" style={{ width: '100%' }} />
                        </div>
                        <div className="CollabDoctor_Content_3_RightContent">
                            <div >
                                <div className="Separate"></div>
                                <div style={{ padding: '1.5rem' }}>
                                    <h5 style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Quản lý lịch khám</h5>
                                    <h6 style={{ fontWeight: '400' }}>Lịch khám bệnh nhân được thống kê ngay trên ứng dụng. Bác sĩ dễ dàng kiểm tra bất cứ lúc nào.</h6>
                                </div>
                            </div>
                            <hr />
                            <div>
                                <div className="Separate"></div>
                                <div style={{ padding: '1.5rem' }}>
                                    <h5 style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Quản lý hồ sơ</h5>
                                    <h6 style={{ fontWeight: '400' }}>Hồ sơ bệnh nhân được lưu trữ tự động ngay trên ứng dụng. Bác sĩ dễ dàng theo dõi và tìm lại.</h6>
                                </div>
                            </div>
                            <hr />
                            <div>
                                <div className="Separate"></div>
                                <div style={{ padding: '1.5rem' }}>
                                    <h5 style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Tư vấn trực tuyến</h5>
                                    <h6 style={{ fontWeight: '400' }}>Tính năng tư vấn trực tuyến cho phép Bác sĩ tư vấn và thăm khám sức khỏe người bệnh từ xa.</h6>
                                </div>
                            </div>
                            <hr />
                            <div>
                                <div className="Separate"></div>
                                <div style={{ padding: '1.5rem' }}>
                                    <h5 style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Đặt khám miễn phí</h5>
                                    <h6 style={{ fontWeight: '400' }}>Bệnh nhân đặt khám miễn phí trên ứng dụng IMPROOKCARE. Trả kết quả, đơn thuốc và nhắc tái khám.</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="CollabDoctor_Content_4">
                    <div className="CollabDoctor_Content_4_Header">
                        <div>
                            <h1>Nền tảng <strong>Tư vấn trực tuyến</strong></h1>
                            <ul>
                                <li>Tối ưu hóa thời gian trống</li>
                                <li>Giúp tiếp cận bệnh nhân từ xa nhanh chóng</li>
                                <li>Quản lý hồ sơ bệnh nhân</li>
                                <li>Tăng sự trung thành của bệnh nhân</li>
                                <li>Hạn chế các cuộc gọi và tin nhắn truyền thống</li>
                            </ul>
                            <div>
                                <button><a href="#register_collab">Đăng ký ngay</a></button>
                            </div>
                        </div>
                    </div>
                    <div className="CollabDoctor_Content_4_Content">
                        <img src={advice} alt="Advice" width={"70%"} />
                    </div>
                </div>
                <div className="CollabDoctor_Content_5">
                    <div className="CollabDoctor_Content_5_Header">
                        <div>
                            <img src={managementapp} alt="Management App" width={"70%"} />
                        </div>
                    </div>
                    <div className="CollabDoctor_Content_5_Content">
                        <div>
                            <h1>Phần mềm <strong>Quản lý phòng khám</strong></h1>
                            <ul>
                                <li>Nhận bệnh theo quy trình</li>
                                <li>Tìm kiếm hồ sơ bệnh án</li>
                                <li>Quản lý thuốc</li>
                                <li>Vận hành hệ thống phòng khám</li>
                                <li>An toàn, bảo mật thông tin</li>
                            </ul>
                            <div>
                                <button><a href="#register_collab">Đăng ký ngay</a></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="CollabDoctor_Content_6" id="register_collab">
                    <div className="CollabDoctor_Content_6_Header">
                        <div className="mb-3">
                            <h1 className="mb-3">Hợp tác với <strong>I'MPROOK</strong> ngay!</h1>
                            <h6>Để lại thông tin. Chúng tôi sẽ liên hệ với bạn.</h6>
                        </div>
                        <Form onSubmit={(e) => addCollabDoctor(e)}>
                            <div className="mb-3">
                                <Form.Control defaultValue={name} style={{ width: "70%", marginBottom: '0.75rem' }} onChange={(e) => setName(e.target.value)} type="text" placeholder="Họ và tên *" required />
                                <Form.Control defaultValue={phonenumber} style={{ width: "70%", marginBottom: '0.75rem' }} onChange={(e) => setPhonenumber(e.target.value)} type="text" placeholder="Số điện thoại *" required />
                                <Form.Control defaultValue={email} style={{ width: "70%", marginBottom: '0.75rem' }} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email *" required />

                            </div>
                            <div className="Collab_Butt">
                                <button type="submit">Gửi thông tin</button>
                            </div>
                        </Form>
                    </div>
                    <div className="CollabDoctor_Content_6_Content">
                        <div>
                            <img src={collabdoctor} alt="Collab Doctor" width={"80%"} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="CollabDoctor_Content_7">
                <div>
                    <div className="CollabDoctor_Content_7_Left">
                        <h3>Tải ứng dụng I'MPROOK CARE</h3>
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
                    <div className="CollabDoctor_Content_7_Right">
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Collaboration;