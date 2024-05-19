import { useContext, useEffect, useState } from "react";
import "./Header.css"
import { useNavigate, Link } from "react-router-dom"
import { Button, Dropdown, Image, NavDropdown, OverlayTrigger, Popover } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserContext } from "../../App";
import { FaHome, FaInfoCircle, FaHistory, FaUserNurse, FaBell } from "react-icons/fa";
import { MdSecurity, MdLogout, MdAccountCircle, MdAdminPanelSettings } from "react-icons/md";
import { authApi, endpoints } from "../../configs/Apis";

const Header = () => {
    const [current_user, dispatch] = useContext(UserContext);
    const nav = useNavigate();
    const [notificationList, setNotificationList] = useState([]);

    const logout = () => {
        dispatch({
            "type": "logout"
        })
        nav("/")
    }

    const loadNotification = async () => {
        try {
            let res = await authApi().get(endpoints['load-notification'](current_user?.userId))
            setNotificationList(res.data.content)
            console.log(res.data.content)
            console.log(res.data.content[0].notificationContent)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (current_user !== null) {
            loadNotification()
        }
    }, [])

    const handleItemClick = (to) => {
        nav(to);
    }

    const handleAdminClick = () => {
        nav("/admin/overview")
    };

    const handleDoctorClick = () => {
        nav("/doctor/doctorinformation")
    };

    const handleNurseClick = () => {
        nav("/nurse/medicaltest/unchecked")
    };

    const menuItems = [
        { to: "/", text: "Về trang chủ", icon: <FaHome /> },
        { to: "/user/personal", text: "Thông tin cá nhân", icon: <FaInfoCircle /> },
        { to: "/user/history", text: "Lịch sử khám bệnh", icon: <FaHistory /> },
        { to: "/changepassword", text: "Thay đổi mật khẩu", icon: <MdSecurity /> }
    ];

    return (<>
        <div className="Header">
            <header>
                <div className="Header1">
                    {/* <Link to="/" className="Link_Title"><h2 className="Title">IM'PROOK CARE.</h2></Link> */}
                    <a href="/" className="Link_Title"><h2 className="Title" style={{ textAlign: 'center' }}><span style={{ color: '#fff', background: '#22c55e', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>I'MPROOK</span> <span style={{ color: '#fff', background: '#1a76e3', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CARE.</span></h2></a>
                    {/* <Link to="/">
                        <img src={logo} alt="IMPROOKCARE" />
                    </Link> */}
                </div>
                <div className="Header2">
                    <ul className="Menu-bar">
                        <li className="Hover">
                            <Link to="/booking">Đặt khám</Link>
                            <span>Đặt khám ngay</span>
                        </li>
                        <li>
                            <Link to="/">Chuyên khoa</Link>
                            <span>Tìm bác sĩ theo chuyên khoa</span>
                        </li>
                        <li>
                            <Link to="/">Tin tức</Link>
                            <span>Tin tức về y tế thế giới</span>
                        </li>
                        <li>
                            <Dropdown>
                                <NavDropdown title='Hợp tác bác sĩ ' id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/collaboration">Đăng ký</NavDropdown.Item>
                                </NavDropdown>
                            </Dropdown>
                            <span>Đăng ký ngay</span>
                        </li>
                    </ul>
                </div>
                <div className="Header3">
                    {current_user === null ?
                        <><button className="Sign-in"><Link to="/phoneverification">Đăng ký</Link></button>
                            <button className="Log-in"><Link to="/login">Đăng nhập</Link></button></>
                        :
                        <>
                            {/* <span class="User-profile"><a href="/">Chào {user.lastname} {user.firstname}</a></span> */}
                            <Dropdown style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', alignItems: 'center' }}>
                                <div className="avatar_container"><Image src={current_user?.avatar} alt="Avatar" roundedCircle /></div>
                                <NavDropdown title={`Chào, ${current_user.lastname} ${current_user.firstname}!`} id="basic-nav-dropdown">
                                    {/* <NavDropdown.Item style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }} onClick={handleItemClick()}><Link to="/"><FaHome />Về trang chủ</Link></NavDropdown.Item>
                                    <NavDropdown.Item style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><Link to="/personal"><FaInfoCircle />Thông tin cá nhân</Link></NavDropdown.Item>
                                    <NavDropdown.Item style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><Link to="/history"><FaHistory />Lịch sử khám bệnh</Link></NavDropdown.Item>
                                    <NavDropdown.Item style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><Link to="/changepassword"><MdSecurity />Thay đổi mật khẩu</Link></NavDropdown.Item> */}
                                    {menuItems.map((item, index) => (
                                        <NavDropdown.Item
                                            key={index}
                                            style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
                                            onClick={() => handleItemClick(item.to)}
                                        >
                                            <Link to={item.to}>{item.icon}{item.text}</Link>
                                        </NavDropdown.Item>
                                    ))}
                                    {current_user.roleId.roleId === 1 ?
                                        <>
                                            <NavDropdown.Item style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }} onClick={handleAdminClick}><Link to="/admin/overview"><MdAdminPanelSettings />Quản trị</Link></NavDropdown.Item>
                                            {/* <button class="Admin"><Link to="/admin">Quản trị</Link></button> */}
                                        </> :
                                        <>
                                            {current_user.roleId.roleId === 2 ?
                                                <>
                                                    <NavDropdown.Item style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }} onClick={handleDoctorClick}><Link to="/doctor/doctorinformation"><MdAccountCircle />Bác sĩ</Link></NavDropdown.Item>
                                                    {/* <button class="Doctor"><Link to="/doctor">Bác sĩ</Link></button> */}
                                                </> : <>
                                                    {current_user.roleId.roleId === 4 ?
                                                        <>
                                                            <NavDropdown.Item style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }} onClick={handleNurseClick}><Link to="/nurse/medicaltest"><FaUserNurse />Y tá</Link></NavDropdown.Item>
                                                            {/* <button class="Doctor"><Link to="/doctor">Bác sĩ</Link></button> */}
                                                        </> : <></>}
                                                </>}
                                        </>
                                    }
                                    <NavDropdown.Item onClick={logout} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><MdLogout />Đăng xuất</NavDropdown.Item>
                                </NavDropdown>
                                <OverlayTrigger
                                    trigger="click"
                                    key='bottom'
                                    placement='bottom'
                                    overlay={
                                        <Popover id="popover-positioned-bottom" className="custom-popover" style={{ zIndex: '99999' }}>
                                            <Popover.Header as="h3">Thông báo</Popover.Header>
                                            <Popover.Body>
                                                {notificationList.length === 0 ?
                                                    <div>Chưa có thông báo nào</div>
                                                    :
                                                    <>
                                                        <div className="notification_container">
                                                            {Object.values(notificationList).map((nl) => {
                                                                return (
                                                                    <div className="notification_content">
                                                                        <div className="notification_avatar"><Image src={nl.senderId.avatar} alt="Avatar" roundedCircle /></div>
                                                                        <div>{nl.notificationContent}</div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </>
                                                }
                                            </Popover.Body>
                                        </Popover>
                                    }
                                >
                                    <Button onClick={() => loadNotification()} variant="warning" className="bell-button">
                                        <FaBell />
                                    </Button>
                                </OverlayTrigger>
                            </Dropdown>
                        </>
                    }
                </div>
            </header>
        </div >
    </>)
}

export default Header;