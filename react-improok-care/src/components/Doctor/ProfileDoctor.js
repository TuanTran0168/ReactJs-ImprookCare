import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import "./ProfileDoctor.css";
import { Form } from "react-bootstrap";
import Apis, { authApi, endpoints } from "../../configs/Apis";
import { toast } from "react-toastify";
// import doctorprofile from "../../assets/images/doctor-profile-icon.png"
import printer from "../../assets/images/printer.png"
import profileicon from "../../assets/images/profile-icon.png"
import profile404 from "../../assets/images/profile.png"

const ProfileDoctor = () => {
    const [current_user,] = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [profileDoctor, setProfileDoctor] = useState([]);

    const [name, setName] = useState();
    const [phonenumber, setPhonenumber] = useState();
    const [bookingPrice, setBookingPrice] = useState();
    const [workPlace, setWorkPlace] = useState();
    const [email, setEmail] = useState();
    const [specialty, setSpecialty] = useState([]);
    const [position, setPosition] = useState();

    const [province, setProvince] = useState();
    const [district, setDistrict] = useState();
    const [ward, setWard] = useState();
    const [provincename, setProvinceName] = useState();
    const [districtname, setDistrictName] = useState();
    const [wardname, setWardName] = useState();
    const [selectedProvinceCode, setSelectedProvinceCode] = useState('01');
    const [selectedDistrictCode, setSelectedDistrictCode] = useState('001');
    const [selectedWardCode, setSelectedWardCode] = useState('00001');
    const [selectedSpecialty, setSelectedSpecialty] = useState('1');

    const [addProfileInfo, setAddProfileInfo] = useState(false);
    const [profile, setProfile] = useState(null);
    const [checkProfileInfo, setCheckProfileInfo] = useState(true);
    const [selectedProfile, setSelectedProfile] = useState();

    const [updateName, setUpdateName] = useState();
    const [updatePhonenumber, setUpdatePhonenumber] = useState();
    const [updateWorkPlace, setUpdateWorkPlace] = useState();
    const [updateBookingPrice, setUpdateBookingPrice] = useState();
    const [updateEmail, setUpdateEmail] = useState();
    const [updatePosition, setUpdatePosition] = useState();


    // const formattedDate = new Date(current_user.birthday).toISOString().substring(0, 10);
    // console.log(typeof (current_birthday))
    // console.log(typeof (current_user.birthday))
    // const formattedDate = current_user.birthDate.toISOString();
    // const formattedDate = new Date(current_birthday).toISOString();

    useEffect(() => {
        const loadProvince = async () => {
            try {
                let res = await Apis.get(endpoints['provinces'])
                setProvince(res.data);
            } catch (error) {
                console.log(error);
            }
        }

        const loadDistrict = async () => {
            try {
                let res = await Apis.get(endpoints['districts'](selectedProvinceCode))
                setDistrict(res.data);
            } catch (error) {
                console.log(error);
            }
        }

        const loadWard = async () => {
            try {
                let res = await Apis.get(endpoints['wards'](selectedDistrictCode))
                setWard(res.data);
            } catch (error) {
                console.log(error)
            }
        }

        loadProvince();
        // if (selectedProvinceCode)
        loadDistrict();
        // if (selectedDistrictCode)
        loadWard()
    }, [selectedProvinceCode, selectedDistrictCode])

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
        loadSpecialty();
    }, [])

    const loadProfileDoctor = async () => {
        try {
            let res = await Apis.get(endpoints['load-profile-doctor-by-userId'](current_user?.userId))
            setProfileDoctor(res.data);
            console.log(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadProfileDoctor();
    }, [current_user?.userId])

    const viewProfileDoctor = (evt, pd) => {
        evt.preventDefault();
        console.log("pp" + pd.profileDoctorId);
        setSelectedProfile(pd.profileDoctorId);
        // console.log(selectedProfile);

        const process = async () => {
            try {
                setLoading(true);
                let res = await authApi().get(endpoints['load-profile-doctor-by-Id'](pd.profileDoctorId))

                setProfile(res.data);
                console.log(res.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
        process();
    }

    const updateClick = () => {
        setCheckProfileInfo(!checkProfileInfo);
    }

    const addNewProfile = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                setLoading(true);

                let res = await authApi().post(endpoints['add-profile-doctor'], {
                    "name": name,
                    "phonenumber": phonenumber,
                    "bookingPrice": bookingPrice,
                    "email": email,
                    "provinceName": provincename === undefined ? province[0].name : provincename,
                    "districtName": districtname === undefined ? district[0].name : districtname,
                    "wardName": wardname === undefined ? ward[0].name : wardname,
                    "workPlace": workPlace,
                    "position": position,
                    "userId": current_user?.userId,
                    "specialtyId": selectedSpecialty
                });
                console.log(res.data);
                toast.success(res.data)
                setLoading(false);
                setAddProfileInfo(false);
            } catch (error) {
                console.log(error);
                toast.error("Có lỗi xảy ra!")
            }
        }

        process();
    }

    const updateProfile = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                setLoading(true);
                // setUpdateName(profile.name);
                // setUpdatePhonenumber(profile.phonenumber);
                // setUpdatePersonalAddress(profile.personalAddress);
                // setUpdateEmail(profile.email);
                // setUpdateRelationship(profile.relationship);
                // setUpdateProvinceName("Hà Nội");
                // setUpdateDistrictName("Vue.js");
                // setUpdateWardName("Nue.js");

                console.log(profile.profileDoctorId, updateName, updatePhonenumber, provincename, districtname, wardname, updateWorkPlace, updateBookingPrice, updateEmail, updatePosition, selectedSpecialty)
                console.log(profile.profileDoctorId, profile.name, profile.phonenumber, province[0].name, district[0].name, ward[0].name, profile.workPlace, profile.bookingPrice, profile.email, profile.position, profile.specialtyId)
                let res = await authApi().post(endpoints['update-profile-doctor'], {
                    "profileDoctorId": profile.profileDoctorId,
                    "name": updateName === undefined ? profile.name : updateName,
                    "phonenumber": updatePhonenumber === undefined ? profile.phonenumber : updatePhonenumber,
                    "provinceName": provincename === undefined ? province[0].name : provincename,
                    "districtName": districtname === undefined ? district[0].name : districtname,
                    "wardName": wardname === undefined ? ward[0].name : wardname,
                    "workPlace": updateWorkPlace === undefined ? profile.workPlace : updateWorkPlace,
                    "bookingPrice": updateBookingPrice === undefined ? profile.bookingPrice : updateBookingPrice,
                    "email": updateEmail === undefined ? profile.email : updateEmail,
                    "position": updatePosition === undefined ? profile.position : updatePosition,
                    "specialtyId": selectedSpecialty === undefined ? profile.specialtyId : selectedSpecialty
                });
                console.log(res.data);
                toast.success(res.data);
                setLoading(false);
                setCheckProfileInfo(!checkProfileInfo);
            } catch (error) {
                console.log(error);
                toast.error("Có lỗi xảy ra!")
            }
        }
        process();
    }

    const addProfileClick = () => {
        setAddProfileInfo(true);
    }

    const exitAddProfileClick = () => {
        setAddProfileInfo(false);
    }

    const focusProvince = (e) => {
        setSelectedProvinceCode(e.target.value);
    }

    const handleProvinceChange = (e) => {
        const selectedProvinceCode = e.target.value;
        const selectedProvince = province.find(pr => pr.code === selectedProvinceCode);
        setSelectedProvinceCode(selectedProvinceCode);
        setProvinceName(selectedProvince.fullName);

    };

    const focusDistrict = (e) => {
        setSelectedDistrictCode(e.target.value);
    }

    const handleDistrictChange = (e) => {
        const selectedDistrictCode = e.target.value;
        const selectedDistrict = district.find(dis => dis.code === selectedDistrictCode);
        setSelectedDistrictCode(selectedDistrictCode);
        setDistrictName(selectedDistrict.fullName);
    }

    const focusWard = (e) => {
        setSelectedWardCode(e.target.value);
    }

    const handleWardChange = (e) => {
        const selectedWardCode = e.target.value;
        const selectedWard = ward.find(wa => wa.code === selectedWardCode);
        setSelectedWardCode(selectedWardCode);
        setWardName(selectedWard.fullName);
    }

    const focusSpecialty = (e) => {
        setSelectedSpecialty(e.target.value);
    }

    const handleSpecialtyChange = (e) => {
        const selectedSpecialtyId = e.target.value;
        setSelectedSpecialty(selectedSpecialtyId);
    }


    if (current_user === null)
        <Navigate to="/" />

    return <>
        <div className="Profile_Doctor_Wrapper">
            <div className="Profile_Doctor">
                {/* <div className="Profile_Doctor_Left">
                    <div className="Profile_Doctor_Left_Content">
                        <DoctorMenu />
                    </div>
                </div> */}
                <div className="Profile_Doctor_Middle">
                    <div className="Profile_Doctor_Middle_Header">
                        <h3>Hồ sơ</h3>
                    </div>
                    <div className="Profile_Doctor_Middle_Content">
                        <div className="Profile_Doctor_Middle_Container">
                            <div className="Profile_Doctor_Middle_Info">
                                <input type="text" placeholder="Nhập tên hồ sơ cần tìm..."></input>
                                <div className="Profile_List">
                                    {profileDoctor.length === 0 ? <>
                                        <div className="Profile_List_404">
                                            <img src={printer} alt="404" width={'20%'} />
                                            <span>Không tìm thấy kết quả</span>
                                        </div>
                                    </> : <>
                                        <div className="Profile_List_Info">
                                            <ul>
                                                {Object.values(profileDoctor).map(pd => {
                                                    return <>
                                                        <div className="Profile_List_Detail" value={selectedProfile} onClick={(e) => viewProfileDoctor(e, pd)}>
                                                            <img src={profileicon} alt="profileicon" width={'20%'} />
                                                            <li key={pd.profileDoctorId} value={pd.profileDoctorId}>{pd.name}</li>
                                                        </div>
                                                    </>
                                                })}
                                            </ul>
                                        </div>
                                    </>}
                                </div>
                            </div>
                            <button className="addProfileButt" onClick={addProfileClick}>Thêm hồ sơ</button>
                        </div>
                    </div>
                </div>
                <div className="Profile_Doctor_Right">
                    {addProfileInfo === false ?
                        <>
                            {checkProfileInfo === true ?
                                <>
                                    <section>
                                        <div className="Profile_Doctor_Right_Header"><h2 className="text-center mb-4">Thông tin cá nhân của bác sĩ</h2></div>
                                        <div className="Profile_Doctor_Right_Content">
                                            {profile === null ? <>
                                                <div className="Profile_Null">
                                                    <h5 className="mb-4">Chọn hồ sơ cần xem</h5>
                                                    <img src={profile404} alt="Not found" width={'20%'} />
                                                </div>
                                            </> :
                                                <>
                                                    <div className="Profile_Doctor_Name">
                                                        <Form.Label style={{ width: "30%" }}>Tên</Form.Label>
                                                        <Form.Control value={profile.name} type="text" disabled />
                                                    </div>
                                                    <div className="Profile_Doctor_Phonenumber">
                                                        <Form.Label style={{ width: "30%" }}>Số điện thoại</Form.Label>
                                                        <Form.Control value={profile.phonenumber} type="text" disabled />
                                                    </div>
                                                    <div className="Profile_Doctor_Price">
                                                        <Form.Label style={{ width: "30%" }}>Giá khám</Form.Label>
                                                        <Form.Control value={profile.bookingPrice} type="text" disabled />
                                                    </div>
                                                    <div className="Profile_Doctor_Email">
                                                        <Form.Label style={{ width: "30%" }}>Email</Form.Label>
                                                        <Form.Control value={profile.email} type="email" disabled />
                                                    </div>
                                                    <div className="Profile_Doctor_Address">
                                                        <Form.Label style={{ width: "30%" }}>Địa chỉ công tác</Form.Label>
                                                        <Form.Control value={profile.workAddress} type="text" disabled />
                                                    </div>
                                                    <div className="Profile_Doctor_Specialty">
                                                        <Form.Label style={{ width: "30%" }}>Chuyên khoa</Form.Label>
                                                        <Form.Control value={profile?.specialtyId?.specialtyName} type="text" disabled />
                                                    </div>
                                                    <div className="Profile_Doctor_Position">
                                                        <Form.Label style={{ width: "30%" }}>Vị trí</Form.Label>
                                                        <Form.Control value={profile.position} type="text" disabled />
                                                    </div>
                                                    <div className="Change_Button">
                                                        <button type="button">Xóa</button>
                                                        <button type="button" onClick={updateClick}>Thay đổi thông tin</button>
                                                    </div>
                                                </>}
                                        </div>
                                    </section>
                                </> : <>
                                    <section>
                                        <div className="Profile_Doctor_Right_Header"><h2 className="text-center mb-4">Thay đổi thông tin</h2></div>
                                        <div className="Profile_Doctor_Right_Content">
                                            <div className="Profile_Doctor_Name">
                                                <Form.Label style={{ width: "30%" }}>Tên</Form.Label>
                                                <Form.Control defaultValue={profile.name} onChange={(e) => setUpdateName(e.target.value)} type="text" placeholder="Họ và tên" required />
                                            </div>
                                            <div className="Profile_Doctor_Phonenumber">
                                                <Form.Label style={{ width: "30%" }}>Số điện thoại</Form.Label>
                                                <Form.Control defaultValue={profile.phonenumber} onChange={(e) => setUpdatePhonenumber(e.target.value)} type="text" placeholder="Số điện thoại" required />
                                            </div>
                                            <div className="Profile_Doctor_Price">
                                                <Form.Label style={{ width: "30%" }}>Giá khám</Form.Label>
                                                <Form.Control defaultValue={profile.bookingPrice} type="text" onChange={(e) => setUpdateBookingPrice(e.target.value)} placeholder="Giá khám" required />
                                            </div>
                                            <div className="Profile_Doctor_Email">
                                                <Form.Label style={{ width: "30%" }}>Email</Form.Label>
                                                <Form.Control defaultValue={profile.email} type="email" onChange={(e) => setUpdateEmail(e.target.value)} placeholder="Email" required />
                                            </div>
                                            <div className="Profile_Doctor_Address">
                                                <div>
                                                    <Form.Label style={{ width: "30%" }}>Tỉnh/TP</Form.Label>
                                                    <Form.Select defaultValue={selectedProvinceCode} onChange={(e) => handleProvinceChange(e)} onFocus={(e) => focusProvince(e)}>
                                                        {Object.values(province).map(pr => <option key={pr.code} value={pr.code}>{pr.name}</option>)}
                                                    </Form.Select>
                                                </div>
                                                <div>
                                                    <Form.Label style={{ width: "30%" }}>Quận/Huyện</Form.Label>
                                                    <Form.Select defaultValue={selectedDistrictCode} onChange={(e) => handleDistrictChange(e)} onFocus={(e) => focusDistrict(e)}>
                                                        {Object.values(district).map(dis => <option key={dis.code} value={dis.code}>{dis.fullName}</option>)}
                                                    </Form.Select>
                                                </div>
                                                <div>
                                                    <Form.Label style={{ width: "30%" }}>Phường/Xã</Form.Label>
                                                    <Form.Select defaultValue={selectedWardCode} onChange={(e) => handleWardChange(e)} onFocus={(e) => focusWard(e)}>
                                                        {Object.values(ward).map(wa => <option key={wa.code} value={wa.code}>{wa.fullName}</option>)}
                                                    </Form.Select>
                                                </div>
                                            </div>
                                            <div className="Profile_Doctor_Place">
                                                <div className="Profile_Doctor_Work_Place">
                                                    <Form.Label style={{ width: "30%" }}>Địa chỉ làm việc</Form.Label>
                                                    <Form.Control type="text" defaultValue={profile.workPlace} placeholder="Địa chỉ làm việc" required onChange={(e) => setUpdateWorkPlace(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="Profile_Doctor_Specialty">
                                                <Form.Label style={{ width: "30%" }}>Chuyên khoa</Form.Label>
                                                <Form.Select defaultValue={selectedSpecialty} onChange={(e) => handleSpecialtyChange(e)} onFocus={(e) => focusSpecialty(e)}>
                                                    {Object.values(specialty).map(s => <option key={s.specialtyId} value={s.specialtyId}>{s.specialtyName}</option>)}
                                                </Form.Select>
                                            </div>
                                            <div className="Profile_Doctor_Position">
                                                <Form.Label style={{ width: "30%" }}>Vị trí</Form.Label>
                                                <Form.Control defaultValue={profile.position} type="text" onChange={(e) => setUpdatePosition(e.target.value)} placeholder="Vị trí công việc" required />
                                            </div>
                                            <div className="Update_Button">
                                                <button type="button" onClick={updateClick}>Hủy</button>
                                                <button type="button" onClick={updateProfile}>Cập nhật thông tin</button>
                                            </div>
                                        </div>
                                    </section>
                                </>}
                        </> : <>
                            <section>
                                <div className="Profile_Doctor_Right_Header"><h2 className="text-left mb-4">Thêm hồ sơ mới</h2></div>
                                <div className="Profile_Doctor_Right_Content">
                                    <div className="Profile_Doctor_Name">
                                        <Form.Label style={{ width: "30%" }}>Tên</Form.Label>
                                        <Form.Control defaultValue={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Nhập chức vụ, họ và tên. Ví dụ: Bác sĩ Nguyễn Văn A" required />
                                    </div>
                                    <div className="Profile_Doctor_Phonenumber">
                                        <Form.Label style={{ width: "30%" }}>Số điện thoại</Form.Label>
                                        <Form.Control defaultValue={phonenumber} onChange={(e) => setPhonenumber(e.target.value)} type="text" placeholder="Số điện thoại" required />
                                    </div>
                                    <div className="Profile_Doctor_Price">
                                        <Form.Label style={{ width: "30%" }}>Giá khám</Form.Label>
                                        <Form.Control defaultValue={bookingPrice} type="text" onChange={(e) => setBookingPrice(e.target.value)} placeholder="Giá khám" required />
                                    </div>
                                    <div className="Profile_Doctor_Email">
                                        <Form.Label style={{ width: "30%" }}>Email</Form.Label>
                                        <Form.Control defaultValue={email} type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                                    </div>
                                    <div className="Profile_Doctor_Address">
                                        <div>
                                            <Form.Label style={{ width: "30%" }}>Tỉnh/TP</Form.Label>
                                            <Form.Select defaultValue={selectedProvinceCode} onChange={(e) => handleProvinceChange(e)} onFocus={(e) => focusProvince(e)}>
                                                {Object.values(province).map(pr => <option key={pr.code} value={pr.code}>{pr.name}</option>)}
                                            </Form.Select>
                                        </div>
                                        <div>
                                            <Form.Label style={{ width: "30%" }}>Quận/Huyện</Form.Label>
                                            <Form.Select defaultValue={selectedDistrictCode} onChange={(e) => handleDistrictChange(e)} onFocus={(e) => focusDistrict(e)}>
                                                {Object.values(district).map(dis => <option key={dis.code} value={dis.code}>{dis.fullName}</option>)}
                                            </Form.Select>
                                        </div>
                                        <div>
                                            <Form.Label style={{ width: "30%" }}>Phường/Xã</Form.Label>
                                            <Form.Select defaultValue={selectedWardCode} onChange={(e) => handleWardChange(e)} onFocus={(e) => focusWard(e)}>
                                                {Object.values(ward).map(wa => <option key={wa.code} value={wa.code}>{wa.fullName}</option>)}
                                            </Form.Select>
                                        </div>
                                    </div>
                                    <div className="Profile_Doctor_Work_Place">
                                        <Form.Label style={{ width: "30%" }}>Địa chỉ làm việc</Form.Label>
                                        <Form.Control type="text" defaultValue={workPlace} placeholder="Địa chỉ làm việc" required onChange={(e) => setWorkPlace(e.target.value)} />
                                    </div>
                                    <div className="Profile_Doctor_Specialty">
                                        <Form.Label style={{ width: "30%" }}>Chuyên khoa</Form.Label>
                                        <Form.Select defaultValue={selectedSpecialty} onChange={(e) => handleSpecialtyChange(e)} onFocus={(e) => focusSpecialty(e)}>
                                            {Object.values(specialty).map(s => <option key={s.specialtyId} value={s.specialtyId}>{s.specialtyName}</option>)}
                                        </Form.Select>
                                    </div>
                                    <div className="Profile_Doctor_Position">
                                        <Form.Label style={{ width: "30%" }}>Vị trí</Form.Label>
                                        <Form.Control defaultValue={position} type="text" onChange={(e) => setPosition(e.target.value)} placeholder="Vị trí công việc" required />
                                    </div>
                                    <div className="Update_Button">
                                        <button type="button" onClick={exitAddProfileClick}>Thoát</button>
                                        <button type="button" onClick={addNewProfile}>Thêm hồ sơ mới</button>
                                    </div>
                                </div>
                            </section>
                        </>}
                </div>
            </div>
        </div >
    </>
}

export default ProfileDoctor;