import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../App";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Badge, Button, Form, Table } from "react-bootstrap";
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
import Apis, { authApi, endpoints } from "../../configs/Apis";
import moment from 'moment';
import { HiPlus } from "react-icons/hi";
import avatar_user from "../../assets/images/avatar-user.png"
import medicine_image from "../../assets/images/medicine.png"
import BarChart from "../../utils/Chart/BarChart";
import PieChart from "../../utils/Chart/PieChart";
import Pagination from "../../utils/Pagination"

const Admin = () => {
    const [current_user,] = useContext(UserContext);
    const [userList, setUserList] = useState([]);
    // const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState('overview');
    const [gender, setGender] = useState();
    const navigate = useNavigate();
    const avatar = useRef();
    const [roles, setRoles] = useState();
    const [selectedRole, setSelectedRole] = useState('1');
    const [totalPages, setTotalPages] = useState('1');
    const [totalMedicinePages, setTotalMedicinePages] = useState('1');
    const [totalCategoryMedicinePages, setTotalCategoryMedicinePages] = useState('1');
    const [totalCollabDoctorPages, setTotalCollabDoctorPages] = useState('1')
    const [medicineCategoryName, setMedicineCategoryName] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('')
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

    const [user, setUser] = useState({
        "username": "",
        "password": "",
        "firstname": "",
        "lastname": "",
        "gender": "",
        "avatar": "",
        "birthday": ""
    })

    const [medicine, setMedicine] = useState({
        "medicineName": "",
        "description": "",
        "ingredients": "",
        "dosage": "",
        "unitPrice": "",
        "medicineCategoryId": "",
        "avatar": "",
    })

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

    const [userUpdate, setUserUpdate] = useState(null)
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
                toast.error("Bạn không có quyền truy cập!")
                isAdmin = 1;
                navigate('/')
            }
        }
    }

    useEffect(() => {
        checkLogin(current_user)
        adminAuth(current_user)
    }, [current_user])

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

    const loadUserById = (evt, userId) => {
        evt.preventDefault();

        const process = async () => {
            try {
                setLoading(true);
                console.log(userId)
                let res = await Apis.get(endpoints['load-user-by-Id'](userId))
                setUserUpdate(res.data);
                setLoading(false);
                console.log("Đây là userInfo");
                console.log(res.data);
                console.log(userUpdate);
                setGender(res.data['gender']);
            } catch (error) {
                console.log(error);
            }
        }
        process();
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
                    handleOptionClick("alluser");
                    loadUser();
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

    const handleOptionClickAndUpdateUser = (e, userId) => {
        handleOptionClick("updateuser");
        loadUserById(e, userId);
    };

    const change = (evt, field) => {
        // setUser({...user, [field]: evt.target.value})
        setUser(current => {
            return { ...current, [field]: evt.target.value }
        })
    }

    const updateChange = (evt, field) => {
        // setUser({...user, [field]: evt.target.value})
        setUserUpdate(current => {
            return { ...current, [field]: evt.target.value }
        })
    }

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

    const handleRoleChange = (e) => {
        const selectedRoleId = e.target.value;
        setSelectedRole(selectedRoleId);
    }

    const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value;
        setSelectedCategory(selectedCategoryId);
    }

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

    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
    const handlePageChange = (pageNumber) => {
        // TODO: Xử lý sự kiện khi người dùng chuyển trang
        setSelectedPage(pageNumber);
        loadUserPage(pageNumber);
        console.log(`Chuyển đến trang ${pageNumber}`);
    };

    const medicinePages = Array.from({ length: totalMedicinePages }, (_, index) => index + 1);
    const handleMedicinePageChange = (pageNumber) => {
        // TODO: Xử lý sự kiện khi người dùng chuyển trang
        setSelectedPage(pageNumber);
        loadMedicinePage(pageNumber);
        console.log(`Chuyển đến trang ${pageNumber}`);
    };

    const categoryMedicinePages = Array.from({ length: totalCategoryMedicinePages }, (_, index) => index + 1);
    const handleCategoryMedicinePageChange = (pageNumber) => {
        // TODO: Xử lý sự kiện khi người dùng chuyển trang
        setSelectedPage(pageNumber);
        loadMedicineCategoriesPage(pageNumber);
        console.log(`Chuyển đến trang ${pageNumber}`);
    };

    const collabDoctorPages = Array.from({ length: totalCollabDoctorPages }, (_, index) => index + 1);
    const handleCollabDoctorPageChange = (pageNumber) => {
        // TODO: Xử lý sự kiện khi người dùng chuyển trang
        setSelectedPage(pageNumber);
        loadCollabDoctorPage(pageNumber);
        console.log(`Chuyển đến trang ${pageNumber}`);
    };

    // const loadMedicineCategories = async () => {
    //     try {
    //         setLoading(true);
    //         let res = await Apis.get(endpoints['medicine-categories'])
    //         setCategories(res.data);
    //         // setTotalPages(res.data.totalPages);
    //         setLoading(false);
    //         console.log(res.data);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

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

    const addMedicineCategory = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                setLoading(true)
                if (medicineCategoryName === '') {
                    toast.warning("Vui lòng nhập tên thuốc");
                    setLoading(false);
                    return
                }
                let res = await authApi().post(endpoints['add-medicine-categories'], {
                    "medicineCategoryName": medicineCategoryName
                });
                if (res.status === 200) {
                    toast.success(res.data)
                    handleOptionClick("medicinecategory");
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
                    handleOptionClick("medicinecategory");
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

    const handleOptionClickAndUpdateMedicine = (e, medicineId) => {
        handleOptionClick("updatemedicine");
        loadMedicineById(e, medicineId);
    };

    const loadMedicineById = (evt, medicineId) => {
        evt.preventDefault();

        const process = async () => {
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
        process();
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

    const acceptCollabDoctor = (evt, collabId) => {
        evt.preventDefault();

        const process = async () => {
            try {
                const requestBody = collabId.toString();
                let res = await authApi().post(endpoints['accept-collab-doctor'], requestBody, {
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                })
                console.log(requestBody)
                if (res.data === "Xác nhận thành công hợp tác!") {
                    toast.success(res.data);
                    loadCollabDoctor();
                }
                else {
                    toast.error(res.data);
                }
                let mes = await Apis.post(endpoints['send-custom-email'], {
                    "mailTo": "2051052125thai@ou.edu.vn",
                    "mailSubject": "Xác nhận hợp tác!",
                    "mailContent": "Bạn đã được xác nhận trở thành bác sĩ của IMPROOK"
                })
                console.log(mes.data);
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        process();
    }

    const denyCollabDoctor = (evt, collabId) => {
        evt.preventDefault();

        const process = async () => {
            try {
                const requestBody = collabId.toString();
                let res = await authApi().post(endpoints['deny-collab-doctor'], requestBody, {
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                })
                console.log(requestBody)
                if (res.data === "Từ chối thành công hợp tác!") {
                    toast.success(res.data);
                    loadCollabDoctor();
                }
                else {
                    toast.error(res.data);
                }
                let mes = await Apis.post(endpoints['send-custom-email'], {
                    "mailTo": "2051052125thai@ou.edu.vn",
                    "mailSubject": "Từ chối hợp tác!",
                    "mailContent": "Rất tiếc nhưng bạn không đủ điều kiện để trở thành bác sĩ của hệ thống. Mong sẽ có cơ hội hợp tác với bạn vào dịp khác"
                })
                console.log(mes.data);
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        process();
    }

    useEffect(() => {
        loadCollabDoctor();
        loadCollabDoctorPage();
    }, [])

    // useEffect(() => {

    // }, [q])

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
                    handleOptionClick("allmedicine");
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

    const changeMedicine = (evt, field) => {
        // setUser({...user, [field]: evt.target.value})
        setMedicine(current => {
            return { ...current, [field]: evt.target.value }
        })
    }

    const updateMedicineChange = (evt, field) => {
        // setUser({...user, [field]: evt.target.value})
        setNewMedicine(current => {
            return { ...current, [field]: evt.target.value }
        })
    }

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
            // for (let item in res.data) {
            //     setStatsDataUserByBooking(item[2]);
            //     setStatsLabelsUserByBooking(item[1]);
            //     console.log(item[1]);
            // }
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
                    <div className="Overview_Stats">
                        <div className="Stats_Booking">
                            <div>
                                <BarChart labels={statsLabelsUserByBooking} titleLabel="Biểu đồ thống kê lượt Booking" data={statsDataUserByBooking} />
                            </div>
                        </div>
                        <div className="Stats_Revenue">
                            <div>
                                <PieChart labels={statsLabelsMedicinePrescriptionAllPaid} titleLabel="Biểu đồ thống kê số tiền thuốc của bác sĩ" data={statsDataMedicinePrescriptionAllPaid} />
                            </div>
                        </div>
                    </div>
                </>
            case "alluser":
                return <>
                    <div>
                        <div>
                            <div className="Add_User">
                                <button onClick={() => handleOptionClick("adduser")}><HiPlus /> Thêm 1 người dùng mới</button>
                            </div>
                            <div className="User_Search_Group">
                                <div className="User_Search_Input">
                                    <Form.Control className="User_Search_Lastname" defaultValue={searchLastname} name="searchFirstname" type="Text" onChange={(e) => setSearchLastname(e.target.value)} placeholder="Nhập họ và tên đệm..." />
                                    <Form.Control className="User_Search_Firstname" defaultValue={searchFirstname} name="searchLastname" type="Text" onChange={(e) => setSearchFirstname(e.target.value)} placeholder="Nhập tên..." />
                                    <Form.Select className="User_Search_Role" value={searchRole} name="searchRole" onChange={(e) => setSearchRole(e.target.value)}>
                                        <option value={null}>TẤT CẢ ROLE</option>
                                        {Object.values(roles).map(r => <option key={r.roleId} value={r.roleId}>{r.roleName}</option>)}
                                    </Form.Select>
                                </div>
                                <button className="User_Search_Butt" onClick={loadUserPage}>Tìm kiếm</button>
                            </div>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        {/* <th>#</th> */}
                                        <th>Ảnh đại diện</th>
                                        <th>Họ và tên đệm</th>
                                        <th>Tên</th>
                                        <th>Tài khoản/Số điện thoại</th>
                                        <th>Ngày sinh</th>
                                        <th>Giới tính</th>
                                        <th>Email</th>
                                        <th>Vai trò</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(userList).map((u, index) => {
                                        const dateTimeString = u.birthday;
                                        const formattedDate = moment(dateTimeString).format('DD-MM-YYYY');
                                        return <>
                                            <tr key={u.userId}>
                                                {/* <td>{index + 1}</td> */}
                                                <td><div style={{ width: "90px", height: "90px", overflow: 'hidden' }}><img src={u.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "45px" }} /></div></td>
                                                <td>{u.lastname}</td>
                                                <td>{u.firstname}</td>
                                                <td>{u.username}</td>
                                                <td>{formattedDate}</td>
                                                <td>{u.gender === true ? 'Nam' : 'Nữ'}</td>
                                                <td>{u.email}</td>
                                                <td>{u.roleId.roleName}</td>
                                                <td>
                                                    <Button variant="success" onClick={(e) => {
                                                        handleOptionClickAndUpdateUser(e, u.userId)
                                                    }}>Cập nhật</Button>
                                                </td>
                                            </tr>
                                        </>
                                    })}
                                </tbody>
                            </Table>
                            {/* <div className="Page_Nav">
                                {pages.map((page) => (
                                    <button id={`${page}`} key={page} onClick={() => handlePageChange(page)}
                                        className={page === selectedPage ? 'active' : ''}>
                                        {page}
                                    </button>
                                ))}
                            </div> */}
                            <Pagination pages={pages}
                                selectedPage={selectedPage}
                                handlePageChange={handlePageChange} />
                        </div>
                    </div>
                    {/* <ListUser handleOptionClick={handleOptionClick} /> */}
                </>
            case "adduser":
                return <>
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
            case "updateuser":
                return <>
                    <div>
                        <div>
                            <div className="Update_User_Header">
                                <h4 className="text-primary">Thông tin người dùng</h4>
                            </div>
                            <div className="Update_User_Body">
                                <div className="Update_User_Name">
                                    <div className="Update_Lastname">
                                        <Form.Label style={{ width: "78%" }}>Họ và tên đệm</Form.Label>
                                        <Form.Control type="Text" defaultValue={userUpdate.lastname} onChange={(e) => updateChange(e, "lastname")} placeholder="Họ và tên đệm" required />
                                    </div>
                                    <div className="Update_Firstname">
                                        <Form.Label style={{ width: "78%" }}>Tên</Form.Label>
                                        <Form.Control type="Text" defaultValue={userUpdate.firstname} onChange={(e) => updateChange(e, "firstname")} placeholder="Tên" required />
                                    </div>
                                </div>
                                <div className="Update_User_Gender">
                                    <Form.Label style={{ width: "16%" }}>Giới tính</Form.Label>
                                    <div className="Update_User_Gender_Tick">
                                        {userUpdate.gender === true ? <>
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
                                            {selectedImage ? <img src={selectedImage} alt="Selected" width={"100%"} /> : <img src={userUpdate.avatar} alt="Selected" width="100%" />}
                                        </div>
                                        <Form.Control type="File" ref={avatar} onChange={handleImageChange} width={'50%'} />
                                    </div>
                                </div>
                                <div className="Update_User_Birthday">
                                    <Form.Label style={{ width: "20%" }}>Ngày sinh</Form.Label>
                                    {(() => {
                                        const formattedBirthDate = new Date(userUpdate.birthday);
                                        formattedBirthDate.setHours(formattedBirthDate.getHours() + 7);
                                        const formattedBirthDateTime = formattedBirthDate.toISOString().substring(0, 10);
                                        return (
                                            <Form.Control
                                                type="date" defaultValue={formattedBirthDateTime} id="doBUpdate"
                                            />
                                        );
                                    })()}
                                </div>
                                <div className="Update_User_Role">
                                    <Form.Label style={{ width: "20%" }}>Vai trò</Form.Label>
                                    <Form.Select defaultValue={userUpdate.roleId} onChange={(e) => handleRoleChange(e)}>
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
            case "allmedicine":
                return <>
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
                                                        handleOptionClickAndUpdateMedicine(e, m.medicineId)
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
            case "medicinecategory":
                return <>
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
                                        setMedicineCategoryName(''); // Xóa nội dung input
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
            case "addmedicine":
                return <>
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
            case "updatemedicine":
                return <>
                    <div>
                        <div>
                            <div className="Update_Medicine_Header">
                                <h4 className="text-primary">Thông tin thuốc</h4>
                            </div>
                            <div className="Update_Medicine_Body">
                                <div className="Update_Medicine_MedicineName">
                                    <Form.Label style={{ width: "20%" }}>Tên thuốc</Form.Label>
                                    <Form.Control type="text" defaultValue={newMedicine.medicineName} onChange={(e) => updateMedicineChange(e, "medicineName")} placeholder="Tên thuốc" required />
                                </div>
                                <div className="Update_Medicine_Description">
                                    <Form.Label style={{ width: "20%" }}>Mô tả</Form.Label>
                                    <Form.Control as="textarea" defaultValue={newMedicine.description} onChange={(e) => updateMedicineChange(e, "description")} placeholder="Mô tả" required />
                                </div>
                                <div className="Update_Medicine_Ingredient">
                                    <Form.Label style={{ width: "20%" }}>Thành phần</Form.Label>
                                    <Form.Control type="Text" defaultValue={newMedicine.ingredients} onChange={(e) => updateMedicineChange(e, "ingredients")} placeholder="Thành phần" required />
                                </div>
                                <div className="Update_Medicine_Dosage">
                                    <Form.Label style={{ width: "20%" }}>Liều lượng</Form.Label>
                                    <Form.Control type="Text" defaultValue={newMedicine.dosage} onChange={(e) => updateMedicineChange(e, "dosage")} placeholder="Liều lượng" required />
                                </div>
                                <div className="Update_Medicine_UnitPrice">
                                    <Form.Label style={{ width: "20%" }}>Đơn giá</Form.Label>
                                    <Form.Control type="Text" defaultValue={newMedicine.unitPrice} onChange={(e) => updateMedicineChange(e, "unitPrice")} placeholder="Đơn giá" required />
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
                                                <img src={newMedicine.avatar} alt="Selected" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
            case "collab":
                return <>
                    <div>
                        <div className="Tab_List">
                            <ul>
                                <li className={selectedCollabOption === "new" ? "active" : ""}
                                    onClick={() => handleCollabOptionClick("new")}
                                >Hợp tác mới</li>
                                <li className={selectedCollabOption === "confirmed" ? "active" : ""}
                                    onClick={() => handleCollabOptionClick("confirmed")}
                                >Đã xác nhận</li>
                                <li className={selectedCollabOption === "denied" ? "active" : ""}
                                    onClick={() => handleCollabOptionClick("denied")}
                                >Đã từ chối</li>
                            </ul>
                        </div>
                        <div>
                            {selectedCollabOption === "new" &&
                                <>
                                    <div>
                                        <div>
                                            <Table striped bordered hover>
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Tên</th>
                                                        <th>Số điện thoại</th>
                                                        <th>Email</th>
                                                        <th>Tình trạng</th>
                                                        <th>Thao tác</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Object.values(collabDoctorList).map((cd) => {
                                                        if (cd.statusId.statusValue === "Chờ xác nhận") {
                                                            return <>
                                                                <tr key={cd.collabId}>
                                                                    <td>{cd.collabId}</td>
                                                                    <td>{cd.name}</td>
                                                                    <td>{cd.phonenumber}</td>
                                                                    <td>{cd.email}</td>
                                                                    <td>{cd.statusId.statusValue}</td>
                                                                    <td>
                                                                        <Button style={{ marginRight: '.5rem' }} onClick={(e) => acceptCollabDoctor(e, cd.collabId)} variant="success">Xác nhận</Button>
                                                                        <Button variant="danger" onClick={(e) => denyCollabDoctor(e, cd.collabId)}>Từ chối</Button>
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        }
                                                    })}
                                                </tbody>
                                            </Table>
                                            {/* <div className="Page_Nav">
                                                {collabDoctorPages.map((page) => (
                                                    <button id={`${page}`} key={page} onClick={() => handleCollabDoctorPageChange(page)}
                                                        className={page === selectedPage ? 'active' : ''}>
                                                        {page}
                                                    </button>
                                                ))}
                                            </div> */}
                                            <Pagination pages={collabDoctorPages}
                                                selectedPage={selectedPage}
                                                handlePageChange={handleCollabDoctorPageChange} />
                                        </div>
                                    </div>
                                </>
                            }
                            {selectedCollabOption === "confirmed" &&
                                <>
                                    <div>
                                        <div>
                                            <Table striped bordered hover>
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Tên</th>
                                                        <th>Số điện thoại</th>
                                                        <th>Email</th>
                                                        <th>Tình trạng</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Object.values(collabDoctorList).map((cd) => {
                                                        if (cd.statusId.statusValue === "Đã xác nhận") {
                                                            return <>
                                                                <tr key={cd.collabId}>
                                                                    <td>{cd.collabId}</td>
                                                                    <td>{cd.name}</td>
                                                                    <td>{cd.phonenumber}</td>
                                                                    <td>{cd.email}</td>
                                                                    <td><Badge bg="success">{cd.statusId.statusValue}</Badge></td>
                                                                </tr>
                                                            </>
                                                        }
                                                    })}
                                                </tbody>
                                            </Table>
                                            <Pagination pages={collabDoctorPages}
                                                selectedPage={selectedPage}
                                                handlePageChange={handleCollabDoctorPageChange} />
                                        </div>
                                    </div>
                                </>
                            }
                            {selectedCollabOption === "denied" &&
                                <>
                                    <div>
                                        <div>
                                            <Table striped bordered hover>
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Tên</th>
                                                        <th>Số điện thoại</th>
                                                        <th>Email</th>
                                                        <th>Tình trạng</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Object.values(collabDoctorList).map((cd) => {
                                                        if (cd.statusId.statusValue === "Từ chối") {
                                                            return <>
                                                                <tr key={cd.collabId}>
                                                                    <td>{cd.collabId}</td>
                                                                    <td>{cd.name}</td>
                                                                    <td>{cd.phonenumber}</td>
                                                                    <td>{cd.email}</td>
                                                                    <td><Badge bg="danger">{cd.statusId.statusValue}</Badge></td>
                                                                </tr>
                                                            </>
                                                        }
                                                    })}
                                                </tbody>
                                            </Table>
                                            <Pagination pages={collabDoctorPages}
                                                selectedPage={selectedPage}
                                                handlePageChange={handleCollabDoctorPageChange} />
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </>
            case "revenue":
                return <>
                    <div className="Stats_Revenue_Detail">
                        <div className="Stats_Service_Price">
                            <div className="Stats_Service_Price_Paid">
                                <BarChart labels={statsLabelsServicePricePaid} titleLabel="Biểu đồ thống kê số tiền khám đã trả" data={statsDataServicePricePaid} />
                            </div>
                            <div className="Stats_Service_Price_Unpaid">
                                <BarChart labels={statsLabelsServicePriceUnpaid} titleLabel="Biểu đồ thống kê số tiền khám chưa trả" data={statsDataServicePriceUnpaid} />
                            </div>
                        </div>
                        <div className="Stats_Medicine_Prescription">
                            <div className="Stats_Medicine_Prescription_Paid">
                                <BarChart labels={statsLabelsMedicinePrescriptionPaid} titleLabel="Biểu đồ thống kê số tiền thuốc đã trả" data={statsDataMedicinePrescriptionPaid} />
                            </div>
                            <div className="Stats_Medicine_Prescription_Unpaid">
                                <BarChart labels={statsLabelsMedicinePrescriptionUnpaid} titleLabel="Biểu đồ thống kê số tiền thuốc chưa trả" data={statsDataMedicinePrescriptionUnpaid} />
                            </div>
                        </div>
                    </div>
                </>
            //Thái
            case "patient":
                return <>
                    <div>Nội dung thống kê bệnh nhân</div>
                </>
            default:
                return null;
        }
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    const handleCollabOptionClick = (option) => {
        setSelectedCollabOption(option);
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
                                                        <ListItemButton sx={{ pl: 4 }} onClick={() => handleOptionClick("patient")}>
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
                                {renderContent()}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Admin;