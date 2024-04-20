import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import Apis, { authApi, endpoints } from "../../configs/Apis";
import { useParams } from "react-router-dom";

const UpdateUser = () => {
    const { userId } = useParams();
    const [loading, setLoading] = useState(false);
    const [userUpdate, setUserUpdate] = useState();
    const [selectedImage, setSelectedImage] = useState('');
    const avatar = useRef();
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState('1');
    const [gender, setGender] = useState();

    const updateChange = (evt, field) => {
        setUserUpdate(current => {
            return { ...current, [field]: evt.target.value }
        })
    }
    const updateUser = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                console.log(userUpdate['gender'])
                const dateInput = document.getElementById('doBUpdate');
                const selectedDate = dateInput.value; // Lấy giá trị ngày từ trường input
                const userId = userUpdate['userId'];

                const birthDate = new Date(selectedDate).toISOString().split('T')[0]; // Định dạng lại ngày thành "yyyy-MM-dd"
                console.log(avatar.current.files[0]);
                console.log(userId);
                let form = new FormData();

                console.log("For nhé cả nhà")
                for (let field in userUpdate)
                    if (field !== "username" && field !== "password" && field !== "email" && field !== "createdDate" && field !== "updatedDate" && field !== "deletedDate" && field !== "active" && field !== "userId" && field !== "gender" && field !== "avatar" && field !== "birthday" && field !== "roleId") {
                        console.log(field)
                        console.log(userUpdate[field])
                        form.append(field, userUpdate[field]);
                    }
                console.log("Bye for nhé cả nhà")
                form.append("userId", userId);

                if (avatar.current.files[0] !== undefined)
                    form.append("avatar", avatar.current.files[0]);
                else
                    form.append("avatar", new Blob());

                form.delete("gender");
                form.append("gender", gender)
                // if (gender === false) {
                //     form.append("gender", gender)
                // } else {
                //     form.append("gender", gender)
                // }

                form.delete("birthday")
                form.append("birthday", birthDate);

                console.log(selectedRole)
                form.append("roleId", selectedRole);

                console.log(gender, selectedRole, birthDate, avatar.current.files[0], userId)

                console.log(userUpdate);

                setLoading(true);

                let res = await authApi().post(endpoints['admin-update-user'], form, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (res.status === 200) {
                    toast.success(res.data)
                    // handleOptionClick("alluser");
                    // loadUser();
                }
                setLoading(false);
            } catch (error) {
                if (error.request.responseText === "Người dùng không tồn tại!")
                    toast.error(error.request.responseText);
                else
                    toast.error(error.request.responseText);
                console.log(error);
            }
        }
        process();
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setSelectedImage(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleRoleChange = (e) => {
        const selectedRoleId = e.target.value;
        setSelectedRole(selectedRoleId);
    }

    useEffect(() => {
        const loadUserById = async () => {
            try {
                setLoading(true);
                console.log(userId)
                let res = await Apis.get(endpoints['load-user-by-Id'](userId))
                setUserUpdate(res.data);
                setLoading(false);
                console.log("Đây là userInfo");
                console.log(res.data);
                setGender(res.data['gender']);
            } catch (error) {
                console.log(error);
            }
        }
        loadUserById();
        const loadRole = async () => {
            try {
                let res = await Apis.get(endpoints['roles'])
                setRoles(res.data);
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        loadRole();
    }, [])

    return (
        <>
            <div>
                <div>
                    <div className="Update_User_Header">
                        <h4 className="text-primary">Thông tin người dùng</h4>
                    </div>
                    <div className="Update_User_Body">
                        <div className="Update_User_Name">
                            <div className="Update_Lastname">
                                <Form.Label style={{ width: "78%" }}>Họ và tên đệm</Form.Label>
                                <Form.Control type="Text" defaultValue={userUpdate?.lastname} onChange={(e) => updateChange(e, "lastname")} placeholder="Họ và tên đệm" required />
                            </div>
                            <div className="Update_Firstname">
                                <Form.Label style={{ width: "78%" }}>Tên</Form.Label>
                                <Form.Control type="Text" defaultValue={userUpdate?.firstname} onChange={(e) => updateChange(e, "firstname")} placeholder="Tên" required />
                            </div>
                        </div>
                        <div className="Update_User_Gender">
                            <Form.Label style={{ width: "16%" }}>Giới tính</Form.Label>
                            <div className="Update_User_Gender_Tick">
                                {userUpdate?.gender === true ? <>
                                    <Form.Check type="radio" label="Nam" name="genderOption" defaultChecked onChange={() => setGender(true)} />
                                    <Form.Check type="radio" label="Nữ" name="genderOption" onChange={() => setGender(false)} />
                                </> : <>
                                    <Form.Check type="radio" label="Nam" name="genderOption" onChange={() => setGender(true)} />
                                    <Form.Check type="radio" label="Nữ" name="genderOption" defaultChecked onChange={() => setGender(false)} />
                                </>}
                            </div>
                        </div>
                        <div className="Update_User_Avatar">
                            <Form.Label style={{ width: "16%" }}>Ảnh đại diện</Form.Label>
                            <div className="Update_Avatar_Choice">
                                <div>
                                    {selectedImage ? <img src={selectedImage} alt="Selected" width={"100%"} /> : <img src={userUpdate?.avatar} alt="Selected" width="100%" />}
                                </div>
                                <Form.Control type="File" ref={avatar} onChange={handleImageChange} width={'50%'} />
                            </div>
                        </div>
                        <div className="Update_User_Birthday">
                            <Form.Label style={{ width: "20%" }}>Ngày sinh</Form.Label>
                            {userUpdate !== undefined && (() => {
                                const formattedBirthDate = new Date(userUpdate.birthday);
                                formattedBirthDate.setHours(formattedBirthDate.getHours() + 7);
                                const formattedBirthDateTime = formattedBirthDate.toISOString().substring(0, 10);
                                return (
                                    <>
                                        <Form.Control type="date" defaultValue={formattedBirthDateTime} id="doBUpdate" />
                                    </>
                                );
                            })()}
                        </div>
                        <div className="Update_User_Role">
                            <Form.Label style={{ width: "20%" }}>Vai trò</Form.Label>
                            <Form.Select defaultValue={userUpdate?.roleId} onChange={(e) => handleRoleChange(e)}>
                                {Object.values(roles).map(r => <option key={r.roleId} value={r.roleId}>{r.roleName}</option>)}
                            </Form.Select>
                        </div>
                        <div className="Update_User_Button">
                            <button type="button">Hủy</button>
                            <button type="button" onClick={(e) => updateUser(e)}>Cập nhật</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UpdateUser;