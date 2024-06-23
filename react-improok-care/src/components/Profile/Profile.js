import { useContext, useEffect, useState } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { UserContext } from "../../App";
import "./Profile.css";
import { Button, Form } from "react-bootstrap";
import Apis, { authApi, endpoints } from "../../configs/Apis";
import printer from "../../assets/images/printer.png";
import profileicon from "../../assets/images/profile-icon.png";
import profile404 from "../../assets/images/profile.png";
import moment from "moment";
import Swal from "sweetalert2";

const Profile = () => {
    const [current_user,] = useContext(UserContext);
    const [gender, setGender] = useState(true)
    const [loading, setLoading] = useState(true)

    const [q] = useSearchParams();

    const [name, setName] = useState();
    const [phonenumber, setPhonenumber] = useState();
    const [personalAddress, setPersonalAddress] = useState();
    const [email, setEmail] = useState();
    const [relationship, setRelationship] = useState();
    const [birthday, setBirthday] = useState(null);

    const [updateName, setUpdateName] = useState();
    const [updatePhonenumber, setUpdatePhonenumber] = useState();
    const [updatePersonalAddress, setUpdatePersonalAddress] = useState();
    const [updateEmail, setUpdateEmail] = useState();
    const [updateRelationship, setUpdateRelationship] = useState();
    // const [updateBirthday, setUpdateBirthday] = useState();
    // const [updateProvinceName, setUpdateProvinceName] = useState();
    // const [updateDistrictName, setUpdateDistrictName] = useState();
    // const [updateWardName, setUpdateWardName] = useState();

    const [profilePatient, setProfilePatient] = useState([]);
    const [profile, setProfile] = useState(null);

    const [province, setProvince] = useState();
    const [district, setDistrict] = useState();
    const [ward, setWard] = useState();
    const [provincename, setProvinceName] = useState();
    const [districtname, setDistrictName] = useState();
    const [wardname, setWardName] = useState();
    const [selectedProvinceCode, setSelectedProvinceCode] = useState('01');
    const [selectedDistrictCode, setSelectedDistrictCode] = useState('001');
    const [selectedWardCode, setSelectedWardCode] = useState('00001');
    const [selectedProfile, setSelectedProfile] = useState();
    // const [selectedGender, setSelectedGender] = useState();
    // const [selectedRelationship, setSelectedRelationship] = useState(relationship);

    const [addProfileInfo, setAddProfileInfo] = useState(false)
    const [checkProfileInfo, setCheckProfileInfo] = useState(true)

    // const formattedDate = new Date(current_user.birthday).toISOString().substring(0, 10);
    // const formattedDate = current_user.birthDate.toISOString();
    // const formattedDate = new Date(current_birthday).toISOString();

    const currentDate = new Date();
    const [currentFormattedDate, setCurrentFormattedDate] = useState(currentDate.toISOString().split('T')[0]);

    const [lockProfile, setLockProfile] = useState([])

    const handleRelationshipChange = (e) => {
        setUpdateRelationship(e);
    };

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

    const loadProfilePatient = async () => {
        try {
            let e = endpoints['load-profile-patient'](current_user?.userId)
            let res = await authApi().get(e)
            setProfilePatient(res.data.content);
            console.log(res.data.content);
        } catch (error) {
            console.log(error)
        }
    }

    const loadLockProfile = async () => {
        try {
            let endpoint = endpoints['load-profile-patient'](current_user?.userId)
            endpoint += `?isLock=false`
            console.log(endpoint)
            let response = await authApi().get(endpoint)
            setLockProfile(response.data.content);
            console.log(response.data.content);
            console.log(response.data.content.length);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadProfilePatient();
    }, [current_user?.userId])

    useEffect(() => {
        loadLockProfile()
    }, [lockProfile])

    const viewProfilePatient = (evt, pp) => {
        evt.preventDefault();
        console.log(pp.profilePatientId)
        setSelectedProfile(pp.profilePatientId);

        const process = async () => {
            try {
                setLoading(true);
                let res = await authApi().get(endpoints['view-profile-patient'](pp.profilePatientId))
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
                ///console.log(name + '' + phonenumber + '' + provincename + '' + districtname + '' + wardname + '' + personalAddress + '' + email + '' + relationship)
                const dateInput = document.getElementById('birthdayInput');
                const selectedDate = dateInput.value;
                const birthDate = new Date(selectedDate).toISOString().split('T')[0];

                console.log(name, phonenumber, gender, birthDate, province[0].name, district[0].name, ward[0].name, personalAddress, relationship, current_user.userId)

                let res = await authApi().post(endpoints['add-profile-patient'], {
                    "name": name,
                    "phonenumber": phonenumber,
                    "gender": gender === undefined ? true : gender,
                    "birthday": birthDate,
                    "provinceName": provincename === undefined ? province[0].name : provincename,
                    "districtName": districtname === undefined ? district[0].name : districtname,
                    "wardName": wardname === undefined ? ward[0].name : wardname,
                    "personalAddress": personalAddress === undefined ? "" : personalAddress,
                    "email": email,
                    "relationship": relationship === undefined ? 'Khác' : relationship,
                    "userId": current_user?.userId
                });
                console.log(res.data);
                Swal.fire(
                    'Thành công', res.data, 'success'
                );
                setLoading(false);
                setAddProfileInfo(false);
                loadProfilePatient();
            } catch (error) {
                console.log(error);
                Swal.fire(
                    'Thất bại', "Có lỗi xảy ra!", 'error'
                );
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
                const dateInput = document.getElementById('dateInput');
                const selectedDate = dateInput.value;

                const birthDate = new Date(selectedDate).toISOString().split('T')[0]; // Định dạng lại ngày thành "yyyy-MM-dd"

                console.log(updateName + '' + updatePhonenumber + '' + gender + '' + birthDate + provincename + '' + districtname + '' + wardname + '' + updatePersonalAddress + '' + updateRelationship + '' + updateEmail)
                let res = await authApi().post(endpoints['update-profile-patient'], {
                    "profilePatientId": profile.profilePatientId,
                    "name": updateName === undefined ? profile.name : updateName,
                    "phonenumber": updatePhonenumber === undefined ? profile.phonenumber : updatePhonenumber,
                    "gender": gender === undefined ? profile.gender : gender,
                    "birthday": birthDate,
                    "provinceName": provincename === undefined ? province[0].name : provincename,
                    "districtName": districtname === undefined ? district[0].name : districtname,
                    "wardName": wardname === undefined ? ward[0].name : wardname,
                    "personalAddress": updatePersonalAddress === undefined ? profile.personalAddress : updatePersonalAddress,
                    "email": updateEmail === undefined ? profile.email : updateEmail,
                    "relationship": updateRelationship === undefined ? profile.relationship : updateRelationship
                });
                console.log(res.data);
                Swal.fire(
                    'Thành công', res.data, 'success'
                );
                setLoading(false);
                setCheckProfileInfo(!checkProfileInfo);
            } catch (error) {
                console.log(error);
                Swal.fire(
                    'Thất bại', "Có lỗi xảy ra!", 'error'
                );
            }
        }
        process();
    }

    // const formattedDate = new Date(profile.birthday);
    // formattedDate.setHours(formattedDate.getHours() + 7);
    // const formattedDateTime = formattedDate.toISOString().substring(0, 10);

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

    // const handleClickProfile = (e) => {
    //     setSelectedProfile(e.target.value);
    // }

    if ((profilePatient !== null && profilePatient.length !== 0) && lockProfile.length !== 0) {
        let next = q.get("next")
        if (next !== null)
            return <Navigate to={next} />
    }

    const autoFill = () => {
        try {
            setName(current_user?.lastname + " " + current_user?.firstname)
            setPhonenumber(current_user?.username)
            setEmail(current_user?.email)
            if (current_user?.gender === 1)
                setGender(true)
            else
                setGender(false)
            setCurrentFormattedDate(current_user?.birthday.toISOString().split('T')[0])
        } catch (error) {
            console.log(error)
        }
    }

    return <>
        <div className="Profile_Wrapper">
            <div className="Profile">
                {/* <div className="Profile_Left">
                    <div className="Profile_Left_Content">
                        <UserMenu />
                    </div>
                </div> */}
                <div className="Profile_Middle">
                    <div className="Profile_Middle_Header">
                        <h3>Hồ sơ</h3>
                    </div>
                    <div className="Profile_Middle_Content">
                        <div className="Profile_Middle_Container">
                            <div className="Profile_Middle_Info">
                                <input type="text" placeholder="Nhập tên hồ sơ cần tìm..."></input>
                                <div className="Profile_List">
                                    {profilePatient.length === 0 ? <>
                                        <div className="Profile_List_404">
                                            <img src={printer} alt="404" width={'20%'} />
                                            <span>Không tìm thấy kết quả</span>
                                        </div>
                                    </> : <>
                                        <div className="Profile_List_Info">
                                            <ul>
                                                {Object.values(profilePatient).map(pp => {
                                                    return <>
                                                        <div className="Profile_List_Detail" value={selectedProfile} onClick={(e) => viewProfilePatient(e, pp)}>
                                                            <img src={profileicon} alt="profileicon" width={'20%'} />
                                                            <li key={pp.profilePatientId} value={pp.profilePatientId}>{pp.name}</li>
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
                <div className="Profile_Right">
                    {addProfileInfo === false ?
                        <>
                            {checkProfileInfo === true ?
                                <>
                                    <section>
                                        <div className="Profile_Right_Header"><h3 className="text-center mb-4">Thông tin cá nhân</h3></div>
                                        <div className="Profile_Right_Content">
                                            {profile === null ? <>
                                                <div className="Profile_Null">
                                                    <h5 className="mb-4">Chọn hồ sơ cần xem</h5>
                                                    <img src={profile404} alt="Not found" width={'20%'} />
                                                </div>
                                            </> :
                                                <>
                                                    <div className="Profile_Name">
                                                        <Form.Label style={{ width: "30%" }}>Họ và tên</Form.Label>
                                                        <Form.Control value={profile.name} type="text" disabled />
                                                    </div>
                                                    <div className="Profile_Phonenumber">
                                                        <Form.Label style={{ width: "30%" }}>Số điện thoại</Form.Label>
                                                        <Form.Control value={profile.phonenumber} type="text" disabled />
                                                    </div>
                                                    <div className="Profile_Email">
                                                        <Form.Label style={{ width: "30%" }}>Email</Form.Label>
                                                        <Form.Control value={profile.email} type="email" disabled />
                                                    </div>
                                                    <div className="Profile_Address">
                                                        <Form.Label style={{ width: "30%" }}>Địa chỉ</Form.Label>
                                                        <Form.Control value={profile.address} type="Text" disabled />
                                                    </div>
                                                    <div className="Profile_Gender">
                                                        <Form.Label style={{ width: "30%" }}>Giới tính</Form.Label>
                                                        <Form.Control value={profile.gender === true ? "Nam" : "Nữ"} type="Text" disabled />
                                                    </div>
                                                    <div className="Profile_Relationship">
                                                        <Form.Label style={{ width: "30%" }}>Quan hệ</Form.Label>
                                                        <Form.Control value={profile.relationship} type="Text" disabled />
                                                    </div>
                                                    <div className="Profile_Birthday">
                                                        <Form.Label style={{ width: "30%" }}>Ngày sinh</Form.Label>
                                                        {profile.birthday === null ? <>
                                                            <Form.Control value="Thiết lập ngày sinh" type="Text" disabled />
                                                        </> : <>
                                                            {(() => {
                                                                // const formattedBirthDate = new Date(profile.birthday);
                                                                // formattedBirthDate.setHours(formattedBirthDate.getHours() + 7);
                                                                // const formattedBirthDateTime = formattedBirthDate.toISOString().substring(0, 10);
                                                                const formattedBirthDateTime = moment(profile.birthday).format('DD-MM-YYYY')
                                                                return (
                                                                    // <Form.Control value={new Date(formattedBirthDateTime).toISOString().substring(0, 10)} type="text" disabled />
                                                                    <Form.Control value={formattedBirthDateTime} type="text" disabled />
                                                                );
                                                            })()}
                                                        </>}
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
                                        <div className="Profile_Right_Header"><h3 className="text-center mb-4">Thay đổi thông tin</h3></div>
                                        <div className="Profile_Right_Content">
                                            <div className="Profile_Name">
                                                <Form.Label style={{ width: "30%" }}>Họ và tên</Form.Label>
                                                <Form.Control defaultValue={profile.name} onChange={(e) => setUpdateName(e.target.value)} type="text" placeholder="Họ và tên" required />
                                            </div>
                                            <div className="Profile_Phonenumber">
                                                <Form.Label style={{ width: "30%" }}>Số điện thoại</Form.Label>
                                                <Form.Control defaultValue={profile.phonenumber} onChange={(e) => setUpdatePhonenumber(e.target.value)} type="text" placeholder="Số điện thoại" required />
                                            </div>
                                            <div className="Profile_Email">
                                                <Form.Label style={{ width: "30%" }}>Email</Form.Label>
                                                <Form.Control defaultValue={profile.email} type="email" onChange={(e) => setUpdateEmail(e.target.value)} placeholder="Email" required />
                                            </div>
                                            <div className="Profile_Address">
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
                                            <div className="Profile_Address_Personal">
                                                <div className="Profile_Personal_Address">
                                                    <Form.Label style={{ width: "30%" }}>Địa chỉ nhà</Form.Label>
                                                    <Form.Control type="text" defaultValue={profile.personalAddress} placeholder="Địa chỉ nhà" required onChange={(e) => setUpdatePersonalAddress(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="Profile_Gender">
                                                <Form.Label style={{ width: "22%" }}>Giới tính</Form.Label>
                                                <div className="Profile_Gender_Tick">
                                                    {profile.gender === true ? <>
                                                        <Form.Check type="radio" label="Nam" name="genderOption" defaultChecked onChange={() => setGender(true)} />
                                                        <Form.Check type="radio" label="Nữ" name="genderOption" onChange={() => setGender(false)} />
                                                    </> : <>
                                                        <Form.Check type="radio" label="Nam" name="genderOption" onChange={() => setGender(true)} />
                                                        <Form.Check type="radio" label="Nữ" name="genderOption" defaultChecked onChange={() => setGender(false)} />
                                                    </>}
                                                </div>
                                            </div>
                                            <div className="Profile_Birthday">
                                                <Form.Label style={{ width: "30%" }}>Ngày sinh</Form.Label>
                                                {profile.birthday === null ? <>
                                                    <input type="date" id="dateInput" defaultValue={currentFormattedDate} />
                                                </> : <>
                                                    {(() => {
                                                        const formattedBirthDate = new Date(profile.birthday);
                                                        formattedBirthDate.setHours(formattedBirthDate.getHours() + 7);
                                                        const formattedBirthDateTime = formattedBirthDate.toISOString().substring(0, 10);
                                                        return (
                                                            <input type="date" defaultValue={formattedBirthDateTime} id="dateInput" />
                                                        );
                                                    })()}
                                                </>}
                                            </div>
                                            <div className="Profile_Relationship">
                                                <Form.Label style={{ width: "22%" }}>Mối quan hệ</Form.Label>
                                                <div className="Profile_Relationship_Tick">
                                                    <Form.Check type="radio" label="Cha" name="relationshipOption" defaultChecked={profile.relationship === "Cha"} onChange={(e) => handleRelationshipChange("Cha")} />
                                                    <Form.Check type="radio" label="Mẹ" name="relationshipOption" defaultChecked={profile.relationship === "Mẹ"} onChange={(e) => handleRelationshipChange("Mẹ")} />
                                                    <Form.Check type="radio" label="Con" name="relationshipOption" defaultChecked={profile.relationship === "Con"} onChange={(e) => handleRelationshipChange("Con")} />
                                                    <Form.Check type="radio" label="Vợ" name="relationshipOption" defaultChecked={profile.relationship === "Vợ"} onChange={(e) => handleRelationshipChange("Vợ")} />
                                                    <Form.Check type="radio" label="Chồng" name="relationshipOption" defaultChecked={profile.relationship === "Chồng"} onChange={(e) => handleRelationshipChange("Chồng")} />
                                                    <Form.Check type="radio" label="Khác" name="relationshipOption" defaultChecked={profile.relationship === "Khác"} onChange={(e) => handleRelationshipChange("Khác")} />
                                                </div>
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
                                <div className="Profile_Right_Header"><h3 className="text-center mb-4">Thêm hồ sơ mới</h3></div>
                                <div className="Profile_Right_Content">
                                    <Form onSubmit={addNewProfile}>
                                        <div className="Profile_Name">
                                            <Form.Label style={{ width: "30%" }}>Tên</Form.Label>
                                            <Form.Control defaultValue={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Họ và tên" required />
                                        </div>
                                        <div className="Profile_Phonenumber">
                                            <Form.Label style={{ width: "30%" }}>Số điện thoại</Form.Label>
                                            <Form.Control defaultValue={phonenumber} onChange={(e) => setPhonenumber(e.target.value)} type="text" placeholder="Số điện thoại" required />
                                        </div>
                                        <div className="Profile_Email">
                                            <Form.Label style={{ width: "30%" }}>Email</Form.Label>
                                            <Form.Control defaultValue={email} type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                                        </div>
                                        <div className="Profile_Address">
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
                                        <div className="Profile_Personal_Address">
                                            <Form.Label style={{ width: "30%" }}>Địa chỉ nhà</Form.Label>
                                            <Form.Control type="text" defaultValue={personalAddress} placeholder="Địa chỉ nhà" required onChange={(e) => setPersonalAddress(e.target.value)} />
                                        </div>
                                        <div className="Profile_Gender">
                                            <Form.Label style={{ width: "22%" }}>Giới tính</Form.Label>
                                            <div className="Profile_Gender_Tick">
                                                {gender === true ? <>
                                                    <Form.Check type="radio" label="Nam" name="genderOption" defaultChecked onChange={() => setGender(true)} />
                                                    <Form.Check type="radio" label="Nữ" name="genderOption" onChange={() => setGender(false)} />
                                                </> : <>
                                                    <Form.Check type="radio" label="Nam" name="genderOption" onChange={() => setGender(true)} />
                                                    <Form.Check type="radio" label="Nữ" name="genderOption" defaultChecked onChange={() => setGender(false)} />
                                                </>}
                                            </div>

                                        </div>
                                        <div className="Profile_Birthday">
                                            <Form.Label style={{ width: "30%" }}>Ngày sinh</Form.Label>
                                            <input type="date" id="birthdayInput" defaultValue={currentFormattedDate} />
                                        </div>
                                        <div className="Profile_Relationship">
                                            <Form.Label style={{ width: "22%" }}>Mối quan hệ</Form.Label>
                                            <div className="Profile_Relationship_Tick">
                                                <Form.Check type="radio" defaultValue="Cha" label="Cha" name="relationshipOption" onChange={(e) => setRelationship(e.target.value)} />
                                                <Form.Check type="radio" defaultValue="Mẹ" label="Mẹ" name="relationshipOption" onChange={(e) => setRelationship(e.target.value)} />
                                                <Form.Check type="radio" defaultValue="Con" label="Con" name="relationshipOption" onChange={(e) => setRelationship(e.target.value)} />
                                                <Form.Check type="radio" defaultValue="Vợ" label="Vợ" name="relationshipOption" onChange={(e) => setRelationship(e.target.value)} />
                                                <Form.Check type="radio" defaultValue="Chồng" label="Chồng" name="relationshipOption" onChange={(e) => setRelationship(e.target.value)} />
                                                <Form.Check type="radio" defaultValue="Khác" label="Khác" name="relationshipOption" defaultChecked onChange={(e) => setRelationship(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="Update_Button">
                                            <button type="button" onClick={exitAddProfileClick}>Thoát</button>
                                            <Button type="submit">Thêm hồ sơ mới</Button>
                                            <button type="button" onClick={autoFill}>Tự động điền</button>
                                        </div>
                                    </Form>
                                </div>
                            </section>
                        </>}
                </div>
            </div>
        </div>
    </>
}

export default Profile;