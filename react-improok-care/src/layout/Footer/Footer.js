import "./Footer.css"
import dadangky from "../../assets/images/dadangky.svg"
import dmcabadge from "../../assets/images/dmca-badge.png"
import { Link } from "react-router-dom";
import { Facebook, Google, LinkedIn, YouTube } from "@mui/icons-material";

const Footer = () => {
    return (<>
        <div className="Footer">
            <div className="Footer1">
                <div className="Footer1_1">
                    <label style={{ fontWeight: 600 }}>CÔNG TY TNHH I'MPROOK VIỆT NAM</label>
                    <ul>
                        <li><strong>VPĐD:</strong> 371 Nguyễn Kiệm, P. 3, Q. Gò Vấp, TP. HCM</li>
                        <li>Số ĐKKD 0315268642 do Sở Kế hoạch và Đầu tư TP. Hồ Chí Minh cấp lần đầu ngày 28/08/2023</li>
                        <li>Chịu trách nhiệm nội dung: <Link to="/" style={{ textDecoration: 'none', fontSize: '1rem', fontWeight: 'bold' }}>PGS. TS. Tuấn Trần</Link></li>
                    </ul>
                </div>
                <div className="Footer1_2">
                    <label style={{ fontWeight: 600 }}>Về I'MPROOK Care</label>
                    <ul>
                        <li>Giới thiệu về I'MPROOK Care</li>
                        <li>Ban điều hành</li>
                        <li>Nhân sự & Tuyển dụng</li>
                        <li>Liên hệ</li>
                    </ul>
                </div>
                <div className="Footer1_3">
                    <label style={{ fontWeight: 600 }}>Dịch vụ</label>
                    <ul>
                        <li>Đặt khám Bác sĩ</li>
                        <li>Đặt khám Bệnh viện</li>
                        <li>Đặt khám Phòng khám</li>
                        <li>I'MPROOK Store</li>
                    </ul>
                </div>
                <div className="Footer1_4">
                    <label style={{ fontWeight: 600 }}>Hỗ trợ</label>
                    <ul>
                        <li>Câu hỏi thường gặp</li>
                        <li>Điều khoản sử dụng</li>
                        <li>Chính sách bảo mật</li>
                        <li>Chính sách giải quyết khiếu nại</li>
                        <li>Hỗ trợ khách hàng: <Link to="mailto:cskh@spring.vn">cskh@improok.vn</Link></li>
                    </ul>
                </div>
                <div className="Footer1_5">
                    <div style={{ fontWeight: 600 }}>Kết nối với chúng tôi</div>
                    <ul>
                        <li><Facebook /></li>
                        <li><YouTube /></li>
                        <li><LinkedIn /></li>
                        <li><Google /></li>
                    </ul>
                </div>
                <div className="Footer1_6">
                    <ul>
                        <li>
                            <Link to="/">
                                <img src={dadangky} alt="Đã đăng ký bộ công thương" width={'80%'} />
                            </Link>
                        </li>
                        <li>
                            <Link to="/">
                                <img src={dmcabadge} alt="dmca" width={'100%'} />
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="Footer2">
                <p>Các thông tin trên I'MPROOK Care chỉ dành cho mục đích tham khảo, tra cứu và không thay thế cho việc chuẩn đoán hoặc điều trị y khoa.
                    <br />
                    Cần tuyệt đối tuân theo hướng dẫn của Bác sĩ và Nhân viên y tế.
                </p>
                <p>Copyright © 2020 - 2024 Công ty TNHH I'MPROOK Việt Nam.</p>
            </div>
        </div>
    </>)
}

export default Footer;