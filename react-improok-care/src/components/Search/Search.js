import React, { useContext, useEffect, useState } from "react"
import "./Search.css"
import { FcSearch } from "react-icons/fc";
import { Accordion, Form } from "react-bootstrap";
import Apis, { endpoints } from "../../configs/Apis";
import doctorprofile from "../../assets/images/doctor-profile-icon.png"
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import googleplay from "../../assets/images/googleplay.svg"
import appstore from "../../assets/images/appstore.svg"
import Pagination from "../../utils/Pagination"
import { UserContext } from "../../App";
import cookie from "react-cookies";
import { reConnectNotification } from "../../utils/WebSocket";

const Search = () => {
    const [current_user,] = useContext(UserContext);
    const [listSpecialty, setListSpecialty] = useState([]);
    const [listDoctor, setListDoctor] = useState([]);
    const [count, setCount] = useState('');
    const [q] = useSearchParams();
    const nav = useNavigate();

    const [totalPages, setTotalPages] = useState('1');
    const [selectedPage, setSelectedPage] = useState('1');

    const [keyword, setKeyword] = useState(q.get('q'));

    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
    const handlePageChange = (pageNumber) => {
        // TODO: Xử lý sự kiện khi người dùng chuyển trang
        setSelectedPage(pageNumber);
        if (selectedOption)
            handleOptionChange(selectedOption, pageNumber)
        else
            search(pageNumber);
        console.log(`Chuyển đến trang ${pageNumber}`);
    };

    useEffect(() => {
        const loadSpecialty = async () => {
            try {
                let res = await Apis.get(endpoints['specialty']);
                setListSpecialty(res.data);
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        }
        loadSpecialty();
        let client = cookie.load("socket")
        console.log("Client", client?.connected);
        if (current_user && client) {
            cookie.remove("socket");
            reConnectNotification(false, current_user?.userId);
        }
    }, [])

    const [selectedOption, setSelectedOption] = useState("all");

    // const handleOptionChange = (option) => {
    //     setSelectedOption(option);
    //     console.log(option);
    // };

    const handleOptionChange = async (option, pageNumber) => {
        try {
            setSelectedOption(option);
            console.log(option);
            console.log(pageNumber);
            // let kw = q.get("q")
            let kw = keyword;
            let e = endpoints['search-function']
            if (pageNumber !== null && !isNaN(pageNumber)) {
                e += `?pageNumber=${pageNumber - 1}`
            }
            else {
                e += ``
            }
            if (kw !== "" && kw !== null && kw !== undefined)
                e += `&name=${kw}`
            else {
                e += ``
            }
            if (option !== null && option !== "all")
                e += `&specialtyId=${option}`
            else
                e += ``
            console.log(e)
            let res = await Apis.get(e)
            nav(`/search?q=${keyword}&specialtyId=${option}&page=${pageNumber}`)
            setListDoctor(res.data.content)
            setTotalPages(res.data.totalPages)
            setCount(res.data.totalElements)
            console.log(res.data.content)
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        handleOptionChange(selectedOption, 1)
    }, [selectedOption])

    useEffect(() => {
        search(1)
    }, [])

    const search = async (pageNumber) => {
        try {
            nav(`/search?q=${keyword}`)
            // let kw = q.get("q")
            let kw = keyword;
            console.log(kw)
            setKeyword(kw)
            let e = endpoints['search-function']
            if (pageNumber !== null && !isNaN(pageNumber)) {
                e += `?pageNumber=${pageNumber - 1}`
            }
            else {
                e += ``
            }
            if (kw !== "" && kw !== null && kw !== undefined)
                e += `&name=${kw}`
            else {
                e += ``
            }
            let res = await Apis.get(e)
            console.log(res.data.content)
            setListDoctor(res.data.content)
            setTotalPages(res.data.totalPages)
            setCount(res.data.totalElements)
            console.log(res.data.content)
        } catch (error) {
            console.log(error)
        }
    }

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            search(1);
        }
    };

    return (
        <>
            <div className="search-wrapper">
                <div className="search-header">
                    <div>
                        <div className="search-input">
                            <input type="text" placeholder="Tìm theo bác sĩ, chuyên khoa, triệu chứng,.." defaultValue={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(event) => handleKeyPress(event)} />
                            <button onClick={() => search(1)}><FcSearch /></button>
                        </div>
                    </div>
                </div>
                <div className="search-content">
                    <div className="search-specialty">
                        <Accordion defaultActiveKey={['0']} alwaysOpen>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Chuyên khoa</Accordion.Header>
                                <Accordion.Body>
                                    <div className="search-specialty-input">
                                        <div>
                                            <input type="text" placeholder="Tìm nhanh chuyên khoa" />
                                            <button><FcSearch /></button>
                                        </div>
                                    </div>
                                    <div className="search-specialty-tick">
                                        <div>
                                            <Form.Check
                                                type="radio"
                                                label="Tất cả"
                                                checked={selectedOption === "all"}
                                                onChange={() => handleOptionChange("all", 1)}
                                            />
                                            {Object.values(listSpecialty).map(ls => {
                                                return (
                                                    <Form.Check
                                                        key={ls.specialtyId}
                                                        type="radio"
                                                        label={ls.specialtyName}
                                                        checked={selectedOption === ls.specialtyId}
                                                        onChange={() => handleOptionChange(ls.specialtyId, 1)}
                                                    />
                                                )
                                            })}
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                    <div className="search-result">
                        <div className="search-count-result">
                            <p>Đã tìm thấy <strong>{count}</strong> kết quả</p>
                        </div>
                        <div className="search-result-detail">
                            {Object.values(listDoctor).map(ld => {
                                let url = `/doctor/${ld.profileDoctorId}`
                                return (
                                    <div>
                                        <div className="image-frame"><img src={ld.userId?.avatar === null ? doctorprofile : ld.userId?.avatar} alt="404" /></div>
                                        <div className="search-doctor-info">
                                            <span>{ld.name}</span>
                                            <span>{ld.specialtyId.specialtyName}</span>
                                            <span>{ld.workAddress}</span>
                                        </div>
                                        <button className="booking-butt"><Link to={url} style={{ color: 'white' }}>Đặt khám</Link></button>
                                    </div>
                                )
                            })}
                        </div>
                        <Pagination pages={pages}
                            selectedPage={selectedPage}
                            handlePageChange={handlePageChange} />
                    </div>
                </div>
                <div className="search-footer">
                    <div>
                        <span>Đặt lịch khám Bác sĩ dễ dàng</span>
                        <h3>Tải ngay I'MPROOK CARE</h3>
                        <div>
                            <Link to="/" style={{ marginRight: '1rem' }}><img src={googleplay} alt="GooglePlay" /></Link>
                            <Link to="/"><img src={appstore} alt="AppStore" /></Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Search;