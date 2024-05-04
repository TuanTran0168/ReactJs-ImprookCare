import { useEffect, useState } from "react";
import { Badge, Button, Table } from "react-bootstrap"
import Pagination from "../../utils/Pagination"
import Apis, { authApi, endpoints } from "../../configs/Apis";
import { toast } from "react-toastify";

const Collab = () => {
    const [selectedCollabOption, setSelectedCollabOption] = useState('new');
    const [collabDoctorList, setCollabDoctorList] = useState([]);
    const [totalCollabDoctorPages, setTotalCollabDoctorPages] = useState('1');
    const [selectedPage, setSelectedPage] = useState('1');
    const [loading, setLoading] = useState(false);
    const handleCollabOptionClick = (option) => {
        setSelectedCollabOption(option);
    };
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
    const collabDoctorPages = Array.from({ length: totalCollabDoctorPages }, (_, index) => index + 1);
    const handleCollabDoctorPageChange = (pageNumber) => {
        setSelectedPage(pageNumber);
        loadCollabDoctorPage(pageNumber);
        console.log(`Chuyển đến trang ${pageNumber}`);
    };
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

    return (
        <>
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
    )
}

export default Collab;