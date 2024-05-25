import { HiPlus } from "react-icons/hi";
import Pagination from "../../utils/Pagination"
import { Button, Form, Table } from "react-bootstrap";
import moment from 'moment';
import { useEffect, useState } from "react";
import Apis, { endpoints } from "../../configs/Apis";
import { useNavigate } from "react-router-dom";

const AllUser = () => {
    const [selectedPage, setSelectedPage] = useState('1');
    const [searchRole, setSearchRole] = useState(null);
    const [searchFirstname, setSearchFirstname] = useState(null);
    const [searchLastname, setSearchLastname] = useState(null);
    const [roles, setRoles] = useState([]);
    const [userList, setUserList] = useState([]);
    const [totalPages, setTotalPages] = useState('1');
    const [loading, setLoading] = useState(false);

    const nav = useNavigate();

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
        loadUser();
    }, [])

    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
    const handlePageChange = (pageNumber) => {
        // TODO: Xử lý sự kiện khi người dùng chuyển trang
        setSelectedPage(pageNumber);
        loadUserPage(pageNumber);
        console.log(`Chuyển đến trang ${pageNumber}`);
    };

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

    return (
        <>
            <div>
                <div>
                    <div className="Add_User">
                        <button onClick={() => nav('/admin/adduser')}><HiPlus /> Thêm người dùng mới</button>
                    </div>
                    <div className="User_Search_Group">
                        <div className="User_Search_Input">
                            <Form.Control className="User_Search_Lastname" defaultValue={searchLastname} name="searchFirstname" type="Text" onChange={(e) => setSearchLastname(e.target.value)} placeholder="Nhập họ và tên đệm..." />
                            <Form.Control className="User_Search_Firstname" defaultValue={searchFirstname} name="searchLastname" type="Text" onChange={(e) => setSearchFirstname(e.target.value)} placeholder="Nhập tên..." />
                            <Form.Select className="User_Search_Role" value={searchRole} name="searchRole" onChange={(e) => setSearchRole(e.target.value)}>
                                <option value={null}>TẤT CẢ ROLE</option>
                                {Object.values(roles).map(r => <option key={r.roleId} value={r.roleId}>{r.roleName.substring(5)}</option>)}
                            </Form.Select>
                        </div>
                        <button className="User_Search_Butt" onClick={loadUserPage}>Tìm kiếm</button>
                    </div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Ảnh đại diện</th>
                                <th>Họ và tên đệm</th>
                                <th>Tên</th>
                                <th>Tài khoản</th>
                                <th>Ngày sinh</th>
                                <th>Giới tính</th>
                                <th>Vai trò</th>
                                <th>Cập nhật</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(userList).map(u => {
                                let url = `/admin/updateuser/${u.userId}`
                                const dateTimeString = u.birthday;
                                const formattedDate = moment(dateTimeString).format('DD-MM-YYYY');
                                return <>
                                    <tr key={u.userId}>
                                        <td><div style={{ width: "90px", height: "90px", overflow: 'hidden' }}><img src={u.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "45px" }} /></div></td>
                                        <td>{u.lastname}</td>
                                        <td>{u.firstname}</td>
                                        <td>{u.username}</td>
                                        <td>{formattedDate}</td>
                                        <td>{u.gender === true ? 'Nam' : 'Nữ'}</td>
                                        <td>{u.roleId.roleName.substring(5)}</td>
                                        <td><Button variant="success" onClick={() => nav(url)}>Cập nhật</Button>
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
        </>
    )
}

export default AllUser;