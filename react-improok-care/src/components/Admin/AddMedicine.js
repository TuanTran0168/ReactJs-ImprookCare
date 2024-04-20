import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap"
import medicine_image from "../../assets/images/medicine.png"
import { toast } from "react-toastify";
import Apis, { endpoints } from "../../configs/Apis";


const AddMedicine = () => {
    const [selectedImage, setSelectedImage] = useState('');
    const avatar = useRef();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('1');
    const [medicineList, setMedicineList] = useState([]);
    const [totalMedicinePages, setTotalMedicinePages] = useState('1');
    const [totalCategoryMedicinePages, setTotalCategoryMedicinePages] = useState('1');

    const [medicine, setMedicine] = useState({
        "medicineName": "",
        "description": "",
        "ingredients": "",
        "dosage": "",
        "unitPrice": "",
        "medicineCategoryId": "",
        "avatar": "",
    })

    const changeMedicine = (evt, field) => {
        // setUser({...user, [field]: evt.target.value})
        setMedicine(current => {
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

    const loadMedicine = async () => {
        try {
            setLoading(true);
            let res = await Apis.get(endpoints['search-medicines'])
            setMedicineList(res.data.content);
            setTotalMedicinePages(res.data.totalPages);
            setLoading(false);
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const addMedicine = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                console.log(avatar.current.files[0]);
                let form = new FormData();
                for (let field in medicine)
                    if (field !== "medicineCategoryId" && field !== "avatar")
                        form.append(field, medicine[field]);

                if (avatar.current.files[0] !== undefined)
                    form.append("avatar", avatar.current.files[0]);
                else
                    form.append("avatar", new Blob());

                form.append("medicineCategoryId", selectedCategory);

                setLoading(true);

                let res = await Apis.post(endpoints['admin-add-medicine'], form);
                if (res.status === 200) {
                    toast.success(res.data);
                    loadMedicine();
                }
                setLoading(false);
            } catch (error) {
                if (error.request.responseText === "Thêm thuốc thất bại!")
                    toast.error(error.request.responseText);
                else
                    toast.error(error.request.responseText);
                console.log(error);
            }
        }
        process();
    }

    const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value;
        setSelectedCategory(selectedCategoryId);
    }

    const loadMedicineCategories = async () => {
        try {
            setLoading(true);
            let res = await Apis.get(endpoints['search-medicine-categories'])
            setCategories(res.data.content);
            setTotalCategoryMedicinePages(res.data.totalPages);
            setLoading(false);
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        loadMedicineCategories();
    }, [])

    return (
        <>
            <div>
                <div>
                    <div className="Add_Medicine_Header">
                        <h4 className="text-primary">Thông tin thuốc</h4>
                    </div>
                    <div className="Add_Medicine_Body">
                        <div className="Add_Medicine_MedicineName">
                            <Form.Label style={{ width: "20%" }}>Tên thuốc</Form.Label>
                            <Form.Control type="text" onChange={(e) => changeMedicine(e, "medicineName")} placeholder="Tên thuốc" required />
                        </div>
                        <div className="Add_Medicine_Description">
                            <Form.Label style={{ width: "20%" }}>Mô tả</Form.Label>
                            <Form.Control as="textarea" onChange={(e) => changeMedicine(e, "description")} placeholder="Mô tả" required />
                        </div>
                        <div className="Add_Medicine_Ingredient">
                            <Form.Label style={{ width: "20%" }}>Thành phần</Form.Label>
                            <Form.Control type="Text" onChange={(e) => changeMedicine(e, "ingredients")} placeholder="Thành phần" required />
                        </div>
                        <div className="Add_Medicine_Dosage">
                            <Form.Label style={{ width: "20%" }}>Liều lượng</Form.Label>
                            <Form.Control type="Text" onChange={(e) => changeMedicine(e, "dosage")} placeholder="Liều lượng" required />
                        </div>
                        <div className="Add_Medicine_UnitPrice">
                            <Form.Label style={{ width: "20%" }}>Đơn giá</Form.Label>
                            <Form.Control type="Text" onChange={(e) => changeMedicine(e, "unitPrice")} placeholder="Đơn giá" required />
                        </div>
                        <div className="Add_Medicine_Category">
                            <Form.Label style={{ width: "20%" }}>Loại thuốc</Form.Label>
                            <Form.Select onChange={(e) => handleCategoryChange(e)}>
                                {Object.values(categories).map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
                            </Form.Select>
                        </div>
                        <div className="Add_Medicine_Avatar">
                            <Form.Label style={{ width: "16%" }}>Ảnh đại diện</Form.Label>
                            <div className="Avatar_Choice">
                                {selectedImage ? (
                                    <div>
                                        <img src={selectedImage} alt="Selected" width="100%" />
                                    </div>
                                ) : (
                                    <div className="Avatar_Null">
                                        <span>Vui lòng chọn ảnh</span>
                                        <img src={medicine_image} alt="medicine avatar" />
                                    </div>
                                )}
                                <Form.Control type="File" ref={avatar} onChange={handleImageChange} width={'50%'} />
                            </div>
                        </div>
                        <div className="Add_Medicine_Button">
                            <button type="button">Hủy</button>
                            <button type="button" onClick={(e) => addMedicine(e)}>Thêm</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddMedicine