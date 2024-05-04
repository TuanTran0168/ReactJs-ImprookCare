import { Button, Form, Table } from "react-bootstrap"
import Pagination from "../../utils/Pagination"
import { HiPlus } from "react-icons/hi"
import { useEffect, useState } from "react";
import Apis, { endpoints } from "../../configs/Apis";
import { useNavigate } from "react-router-dom";

const AllMedicine = () => {
    const [loading, setLoading] = useState(false);
    const [searchCategory, setSearchCategory] = useState(null);
    const [searchMedicineName, setSearchMedicineName] = useState(null);
    const [searchFromPrice, setSearchFromPrice] = useState(null);
    const [searchToPrice, setSearchToPrice] = useState(null);
    const [medicineCategories, setMedicineCategories] = useState([]);

    const [selectedPage, setSelectedPage] = useState('1');
    const [totalMedicinePages, setTotalMedicinePages] = useState('1');
    const [medicineList, setMedicineList] = useState([]);

    const nav = useNavigate();

    const medicinePages = Array.from({ length: totalMedicinePages }, (_, index) => index + 1);
    const handleMedicinePageChange = (pageNumber) => {
        setSelectedPage(pageNumber);
        loadMedicinePage(pageNumber);
        console.log(`Chuyển đến trang ${pageNumber}`);
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

    const loadMedicinePage = async (pageNumber) => {
        try {
            setLoading(true);
            // let e = endpoints['search-users'];
            let e = `${endpoints['search-medicines']}`;
            // let pageNumber = document.getElementsByClassName("active").id;
            console.log(pageNumber)
            if (pageNumber !== null && !isNaN(pageNumber)) {
                e += `?pageNumber=${pageNumber - 1}&`
            }
            else {
                e += `?`
            }
            let medicineName = searchMedicineName;
            let fromPrice = searchFromPrice;
            let toPrice = searchToPrice;
            let categoryId = searchCategory;
            if (medicineName !== null)
                e += `medicineName=${medicineName}&`
            if (fromPrice !== null)
                e += `fromPrice=${fromPrice}&`
            if (toPrice !== null)
                e += `toPrice=${toPrice}&`
            if (categoryId !== null && categoryId !== "TẤT CẢ DANH MỤC")
                e += `categoryId=${categoryId}`
            // let url = `/users/${pageNumber}`
            console.log(e);
            let res = await Apis.get(e);
            setMedicineList(res.data.content);
            // setUrlUser(e);
            setTotalMedicinePages(res.data.totalPages);
            console.log(res.data.totalPages);
            console.log(e);
            // navigate(url);
            setLoading(false);
            console.log(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadMedicine();
        loadMedicinePage();
    }, [])

    const handleOptionClick = (option) => {
        // setSelectedOption(option);
    };

    const handleOptionClickAndUpdateMedicine = (e, medicineId) => {
        // handleOptionClick("updatemedicine");
        // loadMedicineById(e, medicineId);
    };

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

    return (
        <>
            <div>
                <div>
                    <div className="Medicine">
                        <button onClick={() => handleOptionClick("addmedicine")}><HiPlus /> Thêm 1 thuốc mới</button>
                    </div>
                    <div className="Medicine_Search_Group">
                        <div className="Medicine_Search_Input">
                            <Form.Control className="Medicine_Search_MedicineName" defaultValue={searchMedicineName} name="searchMedicineName" type="Text" onChange={(e) => setSearchMedicineName(e.target.value)} placeholder="Nhập tên thuốc..." />
                            <Form.Control className="Medicine_Search_FromPrice" defaultValue={searchFromPrice} name="searchFromPrice" type="Text" onChange={(e) => setSearchFromPrice(e.target.value)} placeholder="Nhập giá bắt đầu..." />
                            <Form.Control className="Medicine_Search_ToPrice" defaultValue={searchToPrice} name="searchToPrice" type="Text" onChange={(e) => setSearchToPrice(e.target.value)} placeholder="Nhập giá kết thúc..." />
                            <Form.Select className="Medicine_Search_Category" value={searchCategory} name="searchCategory" onChange={(e) => setSearchCategory(e.target.value)}>
                                <option value={null}>TẤT CẢ DANH MỤC</option>
                                {Object.values(medicineCategories).map(mc => <option key={mc.categoryId} value={mc.categoryId}>{mc.categoryName}</option>)}
                            </Form.Select>
                        </div>
                        <button className="Medicine_Search_Butt" onClick={loadMedicinePage}>Tìm kiếm</button>
                    </div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Ảnh đại diện</th>
                                {/* <th>#</th> */}
                                <th>Tên thuốc</th>
                                <th>Mô tả</th>
                                <th>Thành phần</th>
                                <th>Liều lượng</th>
                                <th>Đơn giá</th>
                                <th>Loại</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(medicineList).map(m => {
                                let url = `/admin/updatemedicine/${m.medicineId}`
                                return <>
                                    <tr key={m.medicineId}>
                                        <td><div style={{ width: "90px", height: "90px", overflow: 'hidden' }}><img src={m.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div></td>
                                        {/* <td>{m.medicineId}</td> */}
                                        <td>{m.medicineName}</td>
                                        <td>{m.description}</td>
                                        <td>{m.ingredients}</td>
                                        <td>{m.dosage}</td>
                                        <td>{m.unitPrice}</td>
                                        <td>{m.categoryId.categoryName}</td>
                                        <td>
                                            <Button variant="success" onClick={(e) => {
                                                nav(url)
                                            }}>Cập nhật</Button>
                                        </td>
                                    </tr>
                                </>
                            })}
                        </tbody>
                    </Table>
                    {/* <div className="Page_Nav">
                                {medicinePages.map((page) => (
                                    <button id={`${page}`} key={page} onClick={() => handleMedicinePageChange(page)}
                                        className={page === selectedPage ? 'active' : ''}>
                                        {page}
                                    </button>
                                ))}
                            </div> */}
                    <Pagination pages={medicinePages}
                        selectedPage={selectedPage}
                        handlePageChange={handleMedicinePageChange} />
                </div>
            </div>
        </>
    )
}

export default AllMedicine;