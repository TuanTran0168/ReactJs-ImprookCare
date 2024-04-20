import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import Apis, { authApi, endpoints } from "../../configs/Apis";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const UpdateMedicine = () => {
    const { medicineId } = useParams();
    const [loading, setLoading] = useState(false);
    const [newMedicine, setNewMedicine] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [totalCategoryMedicinePages, setTotalCategoryMedicinePages] = useState('1');
    const [totalMedicinePages, setTotalMedicinePages] = useState('1');
    const [medicineList, setMedicineList] = useState([]);
    const avatar = useRef();

    const [selectedCategory, setSelectedCategory] = useState('1');

    const [categories, setCategories] = useState([]);

    const updateMedicineChange = (evt, field) => {
        setNewMedicine(current => {
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

    const loadMedicineCategoriesPage = async (pageNumber) => {
        try {
            setLoading(true);
            let e = endpoints['search-medicine-categories'];
            // let pageNumber = document.getElementsByClassName("active").id;
            console.log(pageNumber)
            if (pageNumber !== null) {
                e = `${e}?pageNumber=${pageNumber - 1}`
            }
            // let url = `/admin?=${pageNumber}`
            let res = await Apis.get(e);
            setCategories(res.data.content);
            setTotalCategoryMedicinePages(res.data.totalPages);
            // navigate(url);
            setLoading(false);
            console.log(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadMedicineCategories();
        loadMedicineCategoriesPage();
    }, [])

    const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value;
        setSelectedCategory(selectedCategoryId);
    }

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

    const updateMedicine = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                const medicineId = newMedicine['medicineId'];
                console.log(avatar.current.files[0]);
                console.log(medicineId);
                let form = new FormData();

                let count = 0
                for (let field in newMedicine)
                    if (field !== "createdDate" && field !== "updatedDate" && field !== "deletedDate" && field !== "active" && field !== "categoryId" && field !== "avatar" && field !== "medicineId") {
                        console.log(field + ": " + newMedicine[field])
                        form.append(field, newMedicine[field]);
                        console.log("Đây là count " + count++);
                    }
                form.append("medicineId", medicineId);

                if (avatar.current.files[0] !== undefined)
                    form.append("avatar", avatar.current.files[0]);
                else
                    form.append("avatar", new Blob());

                console.log(selectedCategory)
                form.append("medicineCategoryId", selectedCategory);

                console.log(selectedCategory, avatar.current.files[0], medicineId)

                console.log(newMedicine);

                setLoading(true);

                let res = await authApi().post(endpoints['admin-update-medicine'], form, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (res.status === 200) {
                    toast.success(res.data)
                    // handleOptionClick("allmedicine");
                    loadMedicine();
                }
                setLoading(false);
            } catch (error) {
                if (error.request.responseText === "Thuốc không tồn tại!")
                    toast.error(error.request.responseText);
                else
                    toast.error(error.request.responseText);
                console.log(error);
            }
        }
        process();
    }

    useEffect(() => {
        const loadMedicineById = async () => {
            try {
                setLoading(true);
                console.log(medicineId)
                let res = await Apis.get(endpoints['load-medicine-by-Id'](medicineId))
                setNewMedicine(res.data);
                setLoading(false);
                console.log(res.data);
                console.log(newMedicine);
            } catch (error) {
                console.log(error);
            }
        }
        loadMedicineById();
        const loadMedicineCategories = async () => {
            try {
                setLoading(true);
                let res = await Apis.get(endpoints['search-medicine-categories'])
                setCategories(res.data.content);
                // setTotalCategoryMedicinePages(res.data.totalPages);
                setLoading(false);
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        loadMedicineCategories();
    }, [])

    return (
        <>
            <div>
                <div>
                    <div className="Update_Medicine_Header">
                        <h4 className="text-primary">Thông tin thuốc</h4>
                    </div>
                    <div className="Update_Medicine_Body">
                        <div className="Update_Medicine_MedicineName">
                            <Form.Label style={{ width: "20%" }}>Tên thuốc</Form.Label>
                            <Form.Control type="text" defaultValue={newMedicine?.medicineName} onChange={(e) => updateMedicineChange(e, "medicineName")} placeholder="Tên thuốc" required />
                        </div>
                        <div className="Update_Medicine_Description">
                            <Form.Label style={{ width: "20%" }}>Mô tả</Form.Label>
                            <Form.Control as="textarea" defaultValue={newMedicine?.description} onChange={(e) => updateMedicineChange(e, "description")} placeholder="Mô tả" required />
                        </div>
                        <div className="Update_Medicine_Ingredient">
                            <Form.Label style={{ width: "20%" }}>Thành phần</Form.Label>
                            <Form.Control type="Text" defaultValue={newMedicine?.ingredients} onChange={(e) => updateMedicineChange(e, "ingredients")} placeholder="Thành phần" required />
                        </div>
                        <div className="Update_Medicine_Dosage">
                            <Form.Label style={{ width: "20%" }}>Liều lượng</Form.Label>
                            <Form.Control type="Text" defaultValue={newMedicine?.dosage} onChange={(e) => updateMedicineChange(e, "dosage")} placeholder="Liều lượng" required />
                        </div>
                        <div className="Update_Medicine_UnitPrice">
                            <Form.Label style={{ width: "20%" }}>Đơn giá</Form.Label>
                            <Form.Control type="Text" defaultValue={newMedicine?.unitPrice} onChange={(e) => updateMedicineChange(e, "unitPrice")} placeholder="Đơn giá" required />
                        </div>
                        <div className="Update_Medicine_Category">
                            <Form.Label style={{ width: "20%" }}>Loại thuốc</Form.Label>
                            <Form.Select onChange={(e) => handleCategoryChange(e)}>
                                {Object.values(categories).map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
                            </Form.Select>
                        </div>
                        <div className="Update_Medicine_Avatar">
                            <Form.Label style={{ width: "16%" }}>Ảnh đại diện</Form.Label>
                            <div className="Avatar_Choice">
                                {selectedImage ? (
                                    <div style={{ width: "140px", height: "140px", overflow: 'hidden', borderRadius: "70px" }}>
                                        <img src={selectedImage} alt="Selected" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    </div>
                                ) : (
                                    <div style={{ width: "140px", height: "140px", overflow: 'hidden', borderRadius: "70px" }}>
                                        <img src={newMedicine?.avatar} alt="Selected" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    </div>
                                )}
                                <Form.Control type="File" ref={avatar} onChange={handleImageChange} width={'50%'} />
                            </div>
                        </div>
                        <div className="Update_Medicine_Button">
                            <button type="button">Hủy</button>
                            <button type="button" onClick={(e) => updateMedicine(e)}>Cập nhật</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UpdateMedicine;