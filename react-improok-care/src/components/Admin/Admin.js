import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../App";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../layout/Spinner";
import "./Admin.css";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { AddCircle, Analytics, Category, Info, LocalHospital, LocalPharmacy, Medication, MonetizationOn, People, Person, PersonAdd, Speed, Group } from "@mui/icons-material";
import { Box, Paper, Typography } from "@mui/material";
import Apis, { endpoints } from "../../configs/Apis";
import AllUser from "./AllUser";
import Overview from "./Overview";
import AddUser from "./AddUser";
import AddMedicine from "./AddMedicine";
import Revenue from "./Revenue";
import Collab from "./Collab";
import MedicineCategory from "./MedicineCategory";
import AllMedicine from "./AllMedicine";
import UpdateUser from "./UpdateUser";
import UpdateMedicine from "./UpdateMedicine";
import { reConnectNotification } from "../../utils/WebSocket";
import cookie from "react-cookies";
import Swal from "sweetalert2";

const Admin = () => {
    const [current_user,] = useContext(UserContext);
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState('overview');
    const [gender, setGender] = useState();
    const navigate = useNavigate();
    const avatar = useRef();
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState('1');
    const [totalPages, setTotalPages] = useState('1');
    const [totalMedicinePages, setTotalMedicinePages] = useState('1');
    const [totalCategoryMedicinePages, setTotalCategoryMedicinePages] = useState('1');
    const [totalCollabDoctorPages, setTotalCollabDoctorPages] = useState('1');
    const [medicineCategoryName, setMedicineCategoryName] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [editCategoryName, setEditCategoryName] = useState('');
    const [medicineList, setMedicineList] = useState([]);
    const [collabDoctorList, setCollabDoctorList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('1');
    const [selectedCollabOption, setSelectedCollabOption] = useState('new');

    const [editingIndex, setEditingIndex] = useState(-1);

    const [statsDataUserByBooking, setStatsDataUserByBooking] = useState([]);
    const [statsLabelsUserByBooking, setStatsLabelsUserByBooking] = useState([]);

    const [statsDataServicePriceAllPaid, setStatsDataServicePriceAllPaid] = useState([]);
    const [statsLabelsServicePriceAllPaid, setStatsLabelsServicePriceAllPaid] = useState([]);

    const [statsDataMedicinePrescriptionAllPaid, setStatsDataMedicinePrescriptionAllPaid] = useState([]);
    const [statsLabelsMedicinePrescriptionAllPaid, setStatsLabelsMedicinePrescriptionAllPaid] = useState([]);

    const [statsDataMedicinePrescriptionPaid, setStatsDataMedicinePrescriptionPaid] = useState([]);
    const [statsLabelsMedicinePrescriptionPaid, setStatsLabelsMedicinePrescriptionPaid] = useState([]);

    const [statsDataMedicinePrescriptionUnpaid, setStatsDataMedicinePrescriptionUnpaid] = useState([]);
    const [statsLabelsMedicinePrescriptionUnpaid, setStatsLabelsMedicinePrescriptionUnpaid] = useState([]);

    const [statsDataServicePricePaid, setStatsDataServicePricePaid] = useState([]);
    const [statsLabelsServicePricePaid, setStatsLabelsServicePricePaid] = useState([]);

    const [statsDataServicePriceUnpaid, setStatsDataServicePriceUnpaid] = useState([]);
    const [statsLabelsServicePriceUnpaid, setStatsLabelsServicePriceUnpaid] = useState([]);

    // const [userUpdate, setUserUpdate] = useState({
    //     "userId": userInfo.userId,
    //     "firstname": userInfo.firstname,
    //     "lastname": userInfo.lastname,
    //     "birthday": userInfo.birthday,
    //     "gender": userInfo.gender,
    //     "roleId": userInfo.roleId,
    //     "avatar": userInfo.avatar
    // })

    const [selectedPage, setSelectedPage] = useState('1');

    const [userUpdate, setUserUpdate] = useState(null);
    const [newMedicine, setNewMedicine] = useState(null);

    const currentDate = new Date();
    const currentFormattedDate = currentDate.toISOString().split('T')[0];

    const [selectedImage, setSelectedImage] = useState('');

    const [categories, setCategories] = useState([]);

    const [q] = useSearchParams();
    const [searchRole, setSearchRole] = useState(null);
    const [searchFirstname, setSearchFirstname] = useState(null);
    const [searchLastname, setSearchLastname] = useState(null);

    const [searchCategory, setSearchCategory] = useState(null);
    const [searchMedicineName, setSearchMedicineName] = useState(null);
    const [searchFromPrice, setSearchFromPrice] = useState(null);
    const [searchToPrice, setSearchToPrice] = useState(null);

    const [medicineCategories, setMedicineCategories] = useState([]);

    const tempStatsDataUserByBooking = [];
    const tempStatsLabelsUserByBooking = [];

    const tempStatsDataServicePriceAllPaid = [];
    const tempStatsLabelsServicePriceAllPaid = [];

    const tempStatsDataMedicinePrescriptionAllPaid = [];
    const tempStatsLabelsMedicinePrescriptionAllPaid = [];

    const tempStatsDataMedicinePrescriptionPaid = [];
    const tempStatsLabelsMedicinePrescriptionPaid = [];

    const tempStatsDataMedicinePrescriptionUnpaid = [];
    const tempStatsLabelsMedicinePrescriptionUnpaid = [];

    const tempStatsDataServicePricePaid = [];
    const tempStatsLabelsServicePricePaid = [];

    const tempStatsDataServicePriceUnpaid = [];
    const tempStatsLabelsServicePriceUnpaid = [];

    var isAdmin = 0;
    var isLogin = 0;

    const checkLogin = (current_user) => {
        if (isLogin === 0) {
            if (current_user === null) {
                toast("Vui lòng đăng nhập!")
                isLogin = 1;
                navigate('/login');
            }
        }
    }

    const adminAuth = (current_user) => {
        if (isAdmin === 0) {
            if (current_user !== null && current_user.roleId.roleId !== 1) {
                Swal.fire(
                    'Thất bại', "Bạn không có quyền truy cập!", 'error'
                );
                isAdmin = 1;
                navigate('/')
            }
        }
    }

    useEffect(() => {
        checkLogin(current_user)
        adminAuth(current_user)
    }, [current_user])

    useEffect(() => {
        let client = cookie.load("socket")
        console.log("Client", client?.connected);
        if (current_user && client) {
            cookie.remove("socket");
            reConnectNotification(false, current_user?.userId);
        }
    }, [])

    const [open, setOpen] = useState(false);
    const [medicineOpen, setMedicineOpen] = useState(false);
    const [collabOpen, setCollabOpen] = useState(false);
    const [statisticalTick, setStatisticalTick] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    const handleMedicineClick = () => {
        setMedicineOpen(!medicineOpen);
    }

    const handleCollabClick = () => {
        setCollabOpen(!collabOpen);
    }

    const handleStatisticalTick = () => {
        setStatisticalTick(!statisticalTick);
    }

    const loadUser = async () => {
        try {
            setLoading(true);
            let res = await Apis.get(endpoints['search-users'])
            setUserList(res.data.content);
            setTotalPages(res.data.totalPages);
            setLoading(false);
            console.log(res.data.content);
        } catch (error) {
            console.log(error);
        }
    }

    const loadUserPage = async (pageNumber) => {
        try {
            setLoading(true);
            // let e = endpoints['search-users'];
            let e = `${endpoints['search-users']}`;
            // let pageNumber = document.getElementsByClassName("active").id;
            console.log(pageNumber)
            if (pageNumber !== null && !isNaN(pageNumber)) {
                e += `?pageNumber=${pageNumber - 1}&`
            }
            else {
                e += `?`
            }
            let firstname = searchFirstname;
            let lastname = searchLastname;
            let roleId = searchRole;
            if (firstname !== null)
                e += `firstname=${firstname}&`
            if (lastname !== null)
                e += `lastname=${lastname}&`
            if (roleId !== null && roleId !== "TẤT CẢ ROLE")
                e += `roleId=${roleId}`
            // let url = `/users/${pageNumber}`
            console.log(e);
            let res = await Apis.get(e);
            setUserList(res.data.content);
            // setUrlUser(e);
            setTotalPages(res.data.totalPages);
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
        loadUserPage();
        loadUser();
    }, [])

    useEffect(() => {
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

    useEffect(() => {
        loadMedicineCategories();
        console.log(medicineCategoryName);
    }, [])

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

    const loadCollabDoctor = async () => {
        try {
            setLoading(true);
            let res = await Apis.get(endpoints['search-collab-doctor'])
            setCollabDoctorList(res.data.content);
            setTotalCollabDoctorPages(res.data.totalPages);
            setLoading(false);
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const loadCollabDoctorPage = async (pageNumber) => {
        try {
            setLoading(true);
            // let e = endpoints['search-users'];
            let e = `${endpoints['search-collab-doctor']}`;
            // let pageNumber = document.getElementsByClassName("active").id;
            console.log(pageNumber)
            if (pageNumber !== null && !isNaN(pageNumber)) {
                e += `?pageNumber=${pageNumber - 1}`
            }
            console.log(e);
            let res = await Apis.get(e);
            setCollabDoctorList(res.data.content);
            setTotalCollabDoctorPages(res.data.totalPages);
            console.log(res.data.totalPages);
            console.log(e);
            setLoading(false);
            console.log(res.data);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadCollabDoctor();
        loadCollabDoctorPage();
    }, [])

    // const loadSearchUser = async () => {
    //     try {
    //         let e = `${endpoints['search-users']}?`;
    //         let firstname = searchFirstname;
    //         let lastname = searchLastname;
    //         let roleId = searchRole;

    //         if (firstname !== null)
    //             e += `firstname=${firstname}&`
    //         if (lastname !== null)
    //             e += `lastname=${lastname}&`
    //         if (roleId !== null)
    //             e += `roleId=${roleId}`

    //         let res = await Apis.get(e)
    //         console.log(e);
    //         setUserList(res.data.content);
    //         setTotalPages(res.data.totalPages);
    //         console.log(res.data)
    //     } catch (ex) {
    //         console.error(ex)
    //     }
    // }

    const statsBookingByUser = async () => {
        try {
            let res = await Apis.get(endpoints['stats-booking-by-user']);
            console.log(res.data)
            res.data.map(item => {
                tempStatsDataUserByBooking.push(item[2]);
                tempStatsLabelsUserByBooking.push(item[1]);
                console.log(item[1]);
            })
            setStatsDataUserByBooking(tempStatsDataUserByBooking);
            setStatsLabelsUserByBooking(tempStatsLabelsUserByBooking);
            // for (let item in res.data) {
            //     setStatsDataUserByBooking(item[2]);
            //     setStatsLabelsUserByBooking(item[1]);
            //     console.log(item[1]);
            // }
        } catch (error) {
            console.log(error);
        }
    }

    const statsServicePriceAllpaid = async () => {
        try {
            let res = await Apis.get(endpoints['stats-service-price-allpaid']);
            console.log(res.data)
            res.data.map(item => {
                tempStatsDataServicePriceAllPaid.push(item[2]);
                tempStatsLabelsServicePriceAllPaid.push(item[1]);
                console.log(item[1]);
            })
            setStatsDataServicePriceAllPaid(tempStatsDataServicePriceAllPaid);
            setStatsLabelsServicePriceAllPaid(tempStatsLabelsServicePriceAllPaid);
        } catch (error) {
            console.log(error);
        }
    }

    const statsMedicinePrescriptionAllpaid = async () => {
        try {
            let res = await Apis.get(endpoints['stats-medicine-prescription-allpaid']);
            console.log(res.data)
            res.data.map(item => {
                tempStatsDataMedicinePrescriptionAllPaid.push(item[1]);
                tempStatsLabelsMedicinePrescriptionAllPaid.push(item[0]);
                console.log(item[1]);
            })
            setStatsDataMedicinePrescriptionAllPaid(tempStatsDataMedicinePrescriptionAllPaid);
            setStatsLabelsMedicinePrescriptionAllPaid(tempStatsLabelsMedicinePrescriptionAllPaid);
            // for (let item in res.data) {
            //     setStatsDataUserByBooking(item[2]);
            //     setStatsLabelsUserByBooking(item[1]);
            //     console.log(item[1]);
            // }
        } catch (error) {
            console.log(error);
        }
    }

    const statsMedicinePrescriptionPaid = async () => {
        try {
            let res = await Apis.get(endpoints['stats-medicine-prescription-paid']);
            console.log(res.data)
            res.data.map(item => {
                tempStatsDataMedicinePrescriptionPaid.push(item[1]);
                tempStatsLabelsMedicinePrescriptionPaid.push(item[0]);
                console.log("Đây là statsMedicinePrescriptionPaid")
                console.log(item[1]);
            })
            setStatsDataMedicinePrescriptionPaid(tempStatsDataMedicinePrescriptionPaid);
            setStatsLabelsMedicinePrescriptionPaid(tempStatsLabelsMedicinePrescriptionPaid);
        } catch (error) {
            console.log(error);
        }
    }

    const statsMedicinePrescriptionUnpaid = async () => {
        try {
            let res = await Apis.get(endpoints['stats-medicine-prescription-unpaid']);
            console.log(res.data)
            res.data.map(item => {
                tempStatsDataMedicinePrescriptionUnpaid.push(item[1]);
                tempStatsLabelsMedicinePrescriptionUnpaid.push(item[0]);
                console.log(item[1]);
            })
            setStatsDataMedicinePrescriptionUnpaid(tempStatsDataMedicinePrescriptionUnpaid);
            setStatsLabelsMedicinePrescriptionUnpaid(tempStatsLabelsMedicinePrescriptionUnpaid);
        } catch (error) {
            console.log(error);
        }
    }

    const statsServicePricePaid = async () => {
        try {
            let res = await Apis.get(endpoints['stats-service-price-paid']);
            console.log(res.data)
            res.data.map(item => {
                tempStatsDataServicePricePaid.push(item[2]);
                tempStatsLabelsServicePricePaid.push(item[1]);
                console.log(item[1]);
            })
            setStatsDataServicePricePaid(tempStatsDataServicePricePaid);
            setStatsLabelsServicePricePaid(tempStatsLabelsServicePricePaid);
        } catch (error) {
            console.log(error);
        }
    }

    const statsServicePriceUnpaid = async () => {
        try {
            let res = await Apis.get(endpoints['stats-service-price-unpaid']);
            console.log(res.data)
            res.data.map(item => {
                tempStatsDataServicePriceUnpaid.push(item[2]);
                tempStatsLabelsServicePriceUnpaid.push(item[1]);
                console.log(item[1]);
            })
            setStatsDataServicePriceUnpaid(tempStatsDataServicePriceUnpaid);
            setStatsLabelsServicePriceUnpaid(tempStatsLabelsServicePriceUnpaid);
        } catch (error) {
            console.log(error);
        }
    }

    let isLoad = 0;

    useEffect(() => {
        if (isLoad === 0) {
            statsBookingByUser();
            statsServicePriceAllpaid();
            statsMedicinePrescriptionAllpaid();
            statsMedicinePrescriptionPaid();
            statsMedicinePrescriptionUnpaid();
            statsServicePricePaid();
            statsServicePriceUnpaid();
            isLoad = 1;
        }
    }, [])

    const renderContent = () => {
        switch (selectedOption) {
            case "overview":
                return <>
                    <Overview />
                </>
            case "alluser":
                return <>
                    <AllUser />
                </>
            case "adduser":
                return <>
                    <AddUser />
                </>
            case "updateuser":
                return <>
                    <UpdateUser />
                </>
            case "allmedicine":
                return <>
                    <AllMedicine />
                </>
            case "medicinecategory":
                return <>
                    <MedicineCategory />
                </>
            case "addmedicine":
                return <>
                    <AddMedicine />
                </>
            case "updatemedicine":
                return <>
                    <UpdateMedicine />
                </>
            case "collab":
                return <>
                    <Collab />
                </>
            case "revenue":
                return <>
                    <Revenue />
                </>
            case "patient":
                return <>
                    <div>Nội dung thống kê bệnh nhân</div>
                </>
            default:
                return null;
        }
    };

    const handleOptionClick = (path) => {
        navigate(path);
    };

    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    <div className="Admin_Wrapper">
                        <div className="Admin_Content">
                            <div className="Admin_Content_Left">
                                <Paper style={{ maxHeight: '50rem', height: '42rem', overflow: 'auto' }}>
                                    <Box sx={{ p: 2 }}>
                                        <List
                                            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                                            component="nav"
                                            aria-labelledby="nested-list-subheader"
                                        >
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    <Speed />
                                                </ListItemIcon>
                                                <ListItemText primary="Tổng quan" onClick={() => handleOptionClick("overview")} />
                                            </ListItemButton>
                                            <div className="System_Management">
                                                <ListItemText primary={<Typography variant="body2" style={{ fontSize: '0.85rem', fontWeight: 'bold', marginLeft: '3rem', color: '#009FFD' }}>
                                                    QUẢN LÝ HỆ THỐNG
                                                </Typography>} />
                                                <ListItemButton onClick={handleClick}>
                                                    <ListItemIcon>
                                                        <Person />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Quản lý người dùng" />
                                                    {open ? <ExpandLess /> : <ExpandMore />}
                                                </ListItemButton>
                                                <Collapse in={open} timeout="auto" unmountOnExit>
                                                    <List component="div" disablePadding>
                                                        <ListItemButton sx={{ pl: 4 }} onClick={() => handleOptionClick("alluser")}>
                                                            <ListItemIcon>
                                                                <People />
                                                            </ListItemIcon>
                                                            <ListItemText primary="Tất cả người dùng" />
                                                        </ListItemButton>
                                                        <ListItemButton sx={{ pl: 4 }} onClick={() => handleOptionClick("adduser")}>
                                                            <ListItemIcon>
                                                                <PersonAdd />
                                                            </ListItemIcon>
                                                            <ListItemText primary="Thêm người dùng" />
                                                        </ListItemButton>
                                                    </List>
                                                </Collapse>
                                                <ListItemButton onClick={handleMedicineClick}>
                                                    <ListItemIcon>
                                                        <LocalPharmacy />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Quản lý thuốc" />
                                                    {medicineOpen ? <ExpandLess /> : <ExpandMore />}
                                                </ListItemButton>
                                                <Collapse in={medicineOpen} timeout="auto" unmountOnExit>
                                                    <List component="div" disablePadding>
                                                        <ListItemButton sx={{ pl: 4 }} onClick={() => handleOptionClick("allmedicine")}>
                                                            <ListItemIcon>
                                                                <Medication />
                                                            </ListItemIcon>
                                                            <ListItemText primary="Tất cả thuốc" />
                                                        </ListItemButton>
                                                        <ListItemButton sx={{ pl: 4 }} onClick={() => handleOptionClick("medicinecategory")}>
                                                            <ListItemIcon>
                                                                <Category />
                                                            </ListItemIcon>
                                                            <ListItemText primary="Danh mục thuốc" />
                                                        </ListItemButton>
                                                        <ListItemButton sx={{ pl: 4 }} onClick={() => handleOptionClick("addmedicine")}>
                                                            <ListItemIcon>
                                                                <AddCircle />
                                                            </ListItemIcon>
                                                            <ListItemText primary="Thêm thuốc" />
                                                        </ListItemButton>
                                                    </List>
                                                </Collapse>
                                                <ListItemButton onClick={handleCollabClick}>
                                                    <ListItemIcon>
                                                        <Group />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Quản lý hợp tác" />
                                                    {collabOpen ? <ExpandLess /> : <ExpandMore />}
                                                </ListItemButton>
                                                <Collapse in={collabOpen} timeout="auto" unmountOnExit>
                                                    <List component="div" disablePadding>
                                                        <ListItemButton sx={{ pl: 4 }} onClick={() => handleOptionClick("collab")}>
                                                            <ListItemIcon>
                                                                <Info />
                                                            </ListItemIcon>
                                                            <ListItemText primary="Thông tin hợp tác" />
                                                        </ListItemButton>
                                                    </List>
                                                </Collapse>
                                            </div>
                                            <div className="Utilities_Service">
                                                <ListItemText primary={<Typography variant="body2" style={{ fontSize: '0.85rem', fontWeight: 'bold', marginLeft: '3rem', color: '#009FFD' }}>
                                                    DỊCH VỤ TIỆN ÍCH
                                                </Typography>} />
                                                <ListItemButton onClick={handleStatisticalTick}>
                                                    <ListItemIcon>
                                                        <Analytics />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Thống kê" />
                                                    {statisticalTick ? <ExpandLess /> : <ExpandMore />}
                                                </ListItemButton>
                                                <Collapse in={statisticalTick} timeout="auto" unmountOnExit>
                                                    <List component="div" disablePadding>
                                                        <ListItemButton sx={{ pl: 4 }} onClick={() => handleOptionClick("revenue")}>
                                                            <ListItemIcon>
                                                                <MonetizationOn />
                                                            </ListItemIcon>
                                                            <ListItemText primary="Thống kê doanh thu" />
                                                        </ListItemButton>
                                                        <ListItemButton sx={{ pl: 4 }}>
                                                            <ListItemIcon>
                                                                <LocalHospital />
                                                            </ListItemIcon>
                                                            <ListItemText primary="Thống kê bệnh nhân" />
                                                        </ListItemButton>
                                                    </List>
                                                </Collapse>
                                            </div>
                                        </List>
                                    </Box>
                                </Paper>
                            </div>
                            <div></div>
                            <div className="Admin_Content_Right">
                                {/* {renderContent()} */}
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Admin;