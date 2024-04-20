import { useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";
import Apis, { endpoints } from "../../configs/Apis";
import avatar_user from "../../assets/images/avatar-user.png"

const AddUser = () => {
    const [gender, setGender] = useState();
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const avatar = useRef();
    const [user, setUser] = useState({
        "username": "",
        "password": "",
        "firstname": "",
        "lastname": "",
        "gender": "",
        "avatar": "",
        "birthday": ""
    })

    const currentDate = new Date();
    const currentFormattedDate = currentDate.toISOString().split('T')[0];

    const change = (evt, field) => {
        // setUser({...user, [field]: evt.target.value})
        setUser(current => {
            return { ...current, [field]: evt.target.value }
        })
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

    const addUser = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                const dateInput = document.getElementById('doB');
                const selectedDate = dateInput.value; // Lấy giá trị ngày từ trường input

                const birthDate = new Date(selectedDate).toISOString().split('T')[0]; // Định dạng lại ngày thành "yyyy-MM-dd"
                console.log(avatar.current.files[0]);
                let form = new FormData();
                for (let field in user)
                    if (field !== "gender" && field !== "avatar" && field !== "birthday")
                        form.append(field, user[field]);

                if (avatar.current.files[0] !== undefined)
                    form.append("avatar", avatar.current.files[0]);
                else
                    form.append("avatar", new Blob());

                form.delete("gender");
                if (gender === false) {
                    form.append("gender", false)
                } else {
                    form.append("gender", true)
                }

                form.delete("birthday")
                form.append("birthday", birthDate);

                setLoading(true);

                let res = await Apis.post(endpoints['admin-add-user'], form);
                if (res.status === 200) {
                    toast.success(res.data)
                }
                setLoading(false);
            } catch (error) {
                if (error.request.responseText === "Số điện thoại đã tồn tại!")
                    toast.error(error.request.responseText);
                else
                    toast.error(error.request.responseText);
                console.log(error);
            }
        }
        process();
    }

    return (
        <>
            <div>
                <div>
                    <div className="Add_User_Header">
                        <h4 className="text-primary">Thông tin người dùng</h4>
                    </div>
                    <div className="Add_User_Body">
                        <div className="Add_User_UserName">
                            <Form.Label style={{ width: "20%" }}>Tên đăng nhập</Form.Label>
                            <Form.Control type="text" onChange={(e) => change(e, "username")} placeholder="Tên đăng nhập" required />
                        </div>
                        <div className="Add_User_Password">
                            <Form.Label style={{ width: "20%" }}>Mật khẩu</Form.Label>
                            <Form.Control type="text" onChange={(e) => change(e, "password")} placeholder="Mật khẩu" required />
                        </div>
                        <div className="Add_User_Name">
                            <div className="Add_Lastname">
                                <Form.Label style={{ width: "78%" }}>Họ và tên đệm</Form.Label>
                                <Form.Control type="Text" onChange={(e) => change(e, "lastname")} placeholder="Họ và tên đệm" required />
                            </div>
                            <div className="Add_Firstname">
                                <Form.Label style={{ width: "78%" }}>Tên</Form.Label>
                                <Form.Control type="Text" onChange={(e) => change(e, "firstname")} placeholder="Tên" required />
                            </div>
                        </div>
                        <div className="Add_User_Gender">
                            <Form.Label style={{ width: "16%" }}>Giới tính</Form.Label>
                            <div className="Add_User_Gender_Tick">
                                <Form.Check type="radio" label="Nam" name="genderOption" defaultChecked onChange={() => setGender(true)} />
                                <Form.Check type="radio" label="Nữ" name="genderOption" onChange={() => setGender(false)} />
                            </div>
                        </div>
                        <div className="Add_User_Avatar">
                            <Form.Label style={{ width: "16%" }}>Ảnh đại diện</Form.Label>
                            <div className="Avatar_Choice">
                                {selectedImage ? (
                                    <div>
                                        <img src={selectedImage} alt="Selected" width="100%" />
                                    </div>
                                ) : (
                                    <div className="Avatar_Null">
                                        <span>Vui lòng chọn ảnh</span>
                                        <img src={avatar_user} alt="user avatar" />
                                    </div>
                                )}
                                <Form.Control type="File" ref={avatar} onChange={handleImageChange} width={'50%'} />
                            </div>
                        </div>
                        <div className="Add_User_Birthday">
                            <Form.Label style={{ width: "20%" }}>Ngày sinh</Form.Label>
                            <Form.Control type="Date" id="doB" defaultValue={currentFormattedDate} />
                        </div>
                        <div className="Add_User_Button">
                            <button type="button">Hủy</button>
                            <button type="button" onClick={(e) => addUser(e)}>Thêm</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddUser;