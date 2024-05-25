import { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import Pagination from "../../utils/Pagination"
import Apis, { authApi, endpoints } from "../../configs/Apis";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const MedicineCategory = () => {
    const [medicineCategoryName, setMedicineCategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const [editingIndex, setEditingIndex] = useState(-1);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [editCategoryName, setEditCategoryName] = useState('');
    const [loading, setLoading] = useState(false);
    const [totalCategoryMedicinePages, setTotalCategoryMedicinePages] = useState('1');
    const [medicineCategories, setMedicineCategories] = useState([]);
    const [selectedPage, setSelectedPage] = useState('1');

    const handleEdit = (index, categoryId) => {
        setEditingIndex(index);
        setSelectedCategoryId(categoryId)
    };

    const handleCancel = () => {
        setEditingIndex(-1);
    };

    useEffect(() => {
        loadMedicineCategories();
        console.log(medicineCategoryName);
    }, [])

    useEffect(() => {
        const loadMedicineCategories = async () => {
            try {
                let res = await Apis.get(endpoints['medicine-categories'])
                setMedicineCategories(res.data);
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        loadMedicineCategories();
    }, [])

    const addMedicineCategory = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                setLoading(true)
                if (medicineCategoryName === '') {
                    Swal.fire(
                        'Cảnh báo', "Bạn chưa nhập tên thuốc!", 'warning'
                    );
                    setLoading(false);
                    return
                }
                let res = await authApi().post(endpoints['add-medicine-categories'], {
                    "medicineCategoryName": medicineCategoryName
                });
                if (res.status === 200) {
                    toast.success(res.data)
                    loadMedicineCategories();
                }
                setLoading(false);
            } catch (error) {
                if (error.request.responseText === "Thêm danh mục thuốc thất bại!")
                    toast.error(error.request.responseText);
                else
                    toast.error(error.request.responseText);
                console.log(error);
            }
        }
        process();
    }
    const categoryMedicinePages = Array.from({ length: totalCategoryMedicinePages }, (_, index) => index + 1);
    const handleCategoryMedicinePageChange = (pageNumber) => {
        // TODO: Xử lý sự kiện khi người dùng chuyển trang
        setSelectedPage(pageNumber);
        loadMedicineCategoriesPage(pageNumber);
        console.log(`Chuyển đến trang ${pageNumber}`);
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

    const updateMedicineCategory = (evt, categoryName) => {
        evt.preventDefault();

        const process = async () => {
            try {
                setLoading(true)
                console.log(selectedCategoryId, editCategoryName)
                let res = await authApi().post(endpoints['update-medicine-categories'], {
                    "medicineCategoryId": selectedCategoryId,
                    "medicineCategoryName": editCategoryName === '' ? categoryName : editCategoryName
                });
                if (res.status === 200) {
                    toast.success(res.data)
                    loadMedicineCategories();
                }
                console.log(res.data);
                setEditCategoryName('');
                setEditingIndex(-1);
                setLoading(false);
            } catch (error) {
                if (error.request.responseText === "Danh mục thuốc không tồn tại!")
                    toast.error(error.request.responseText);
                else
                    toast.error(error.request.responseText);
                console.log(error);
            }
        }
        process();
    }

    useEffect(() => {
        loadMedicineCategories();
    }, [])

    return (
        <>
            <div>
                <div>
                    <div className="Medicine_Category_Header">
                        <h4 className="text-primary">Thông tin danh mục thuốc</h4>
                    </div>
                    <div className="Medicine_Catagory">
                        <Form.Label style={{ width: "78%" }}>Thêm danh mục thuốc</Form.Label>
                        <div className="Add_Medicine_Category">
                            <Form.Control type="text" defaultValue={medicineCategoryName} onChange={(e) => setMedicineCategoryName(e.target.value)} placeholder="Tên danh mục thuốc" required />
                            <Button variant="secondary" onClick={(e) => {
                                addMedicineCategory(e);
                                setMedicineCategoryName('');
                            }}>Thêm</Button>
                        </div>
                    </div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tên danh mục</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(categories).map((c, index) => (
                                <tr key={c.categoryId}>
                                    <td style={{ width: '20%' }}>{c.categoryId}</td>
                                    <td style={{ width: '40%' }}>
                                        {editingIndex === index ? (
                                            <input className="category_name"
                                                type="text"
                                                defaultValue={c.categoryName}
                                                onChange={(e) => setEditCategoryName(e.target.value)}
                                            />
                                        ) : (
                                            c.categoryName
                                        )}
                                    </td>
                                    <td style={{ width: '30%' }}>
                                        {editingIndex === index ? (
                                            <>
                                                <Button style={{ marginRight: '0.5rem' }} variant="success" onClick={(e) => updateMedicineCategory(e, c.categoryName)}>
                                                    Cập nhật
                                                </Button>
                                                <Button style={{ marginRight: '0.5rem' }} variant="warning" onClick={handleCancel}>
                                                    Hủy
                                                </Button>
                                            </>
                                        ) : (
                                            <Button style={{ marginRight: '0.5rem' }} variant="primary" onClick={() => handleEdit(index, c.categoryId)}>
                                                Sửa
                                            </Button>
                                        )}
                                        <Button variant="danger">Xóa</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    {/* <div className="Page_Nav">
                        {categoryMedicinePages.map((page) => (
                            <button id={`${page}`} key={page} onClick={() => handleCategoryMedicinePageChange(page)}
                                className={page === selectedPage ? 'active' : ''}>
                                {page}
                            </button>
                        ))}
                    </div> */}
                    <Pagination pages={categoryMedicinePages}
                        selectedPage={selectedPage}
                        handlePageChange={handleCategoryMedicinePageChange} />
                </div>
            </div>
        </>
    )
}

export default MedicineCategory;