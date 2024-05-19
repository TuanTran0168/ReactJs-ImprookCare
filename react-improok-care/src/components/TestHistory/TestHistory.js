import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { UserContext } from "../../App";
import "./TestHistory.css";
import Apis, { authApi, endpoints } from "../../configs/Apis";
import profile404 from "../../assets/images/profile.png"
import printer from "../../assets/images/printer.png"
import profileicon from "../../assets/images/profile-icon.png"
import reminder from "../../assets/images/reminder.png";
import moment from "moment"
import { MdMenu } from "react-icons/md";

const TestHistory = () => {
    const [current_user,] = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [profilePatient, setProfilePatient] = useState([]);
    const [selectedProfilePatientId, setSelectedProfilePatientId] = useState('');
    const [selectedProfile, setSelectedProfile] = useState();
    const [testList, setTestList] = useState([]);
    const [testDetail, setTestDetail] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const [pdfUrl, setPdfUrl] = useState(null)

    const loadProfilePatient = async () => {
        try {
            let e = endpoints['load-profile-patient'](current_user?.userId)
            let res = await authApi().get(e)
            setProfilePatient(res.data.content);
            console.log(res.data.content);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadProfilePatient();
    }, [current_user?.userId])

    const loadTestResult = async (pp) => {
        try {
            let e = endpoints['load-test-result']
            e += `?profilePatientId=${pp.profilePatientId}`
            let res = await authApi().get(e)
            console.log(res.data.content)
            setTestList(res.data.content)
        } catch (error) {
            console.log(error)
        }
    }

    const loadTestDetail = async (testResultId) => {
        try {
            console.log(testResultId)
            let res = await authApi().get(endpoints['load-test-service-detail'](testResultId))
            console.log(res.data)
            setTestDetail(res.data)
            setShowModal(true)
        } catch (error) {
            console.log(error)
        }
    }

    const createPdf = async () => {
        try {
            let response = await Apis.post(endpoints['create-pdf-result'], {
                "profilePatientId": testDetail?.bookingId.profilePatientId.profilePatientId,
                "profilePatientName": testDetail?.bookingId.profilePatientId.name,
                "profileDoctorName": testDetail?.bookingId.scheduleId.profileDoctorId.name,
                "nurseName": testDetail?.userId === null ? "Chưa xét nghiệm" : `${testDetail?.userId.lastname} ${testDetail?.userId.firstname}`,
                "birthday": moment(testDetail?.bookingId.profilePatientId.birthday).format('DD-MM-YYYY'),
                "address": testDetail?.bookingId.profilePatientId.address,
                "specialtyName": testDetail?.bookingId.scheduleId.profileDoctorId.specialtyId.specialtyName,
                "testResultDiagnosis": testDetail?.testResultDiagnosis === null ? "Chưa có kết quả" : testDetail?.testResultDiagnosis,
                "gender": testDetail?.bookingId.profilePatientId.gender === true ? "Nam" : "Nữ",
                "createdDate": moment(testDetail?.createdDate).format('DD-MM-YYYY'),
                "updatedDate": moment(testDetail?.updatedDate).format('DD-MM-YYYY')
            },
                {
                    responseType: 'blob',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
            console.log(response)
            if (response.status === 200) {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);

                console.log(url);
                setPdfUrl(url);
            } else {
                console.error('Tạo pdf thất bại!');
            }
        } catch (error) {
            console.log(error)
        }
    }

    const downloadPDF = () => {
        if (pdfUrl) {
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = 'test_result.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return <>
        <div className="TestHistory_Wrapper">
            <div className="TestHistory">
                {/* <div className="TestHistory_Left">
                    <div className="TestHistory_Left_Content">
                        <UserMenu />
                    </div>
                </div> */}
                <div className="TestHistory_Middle">
                    <div className="TestHistory_Middle_Header">
                        <h3>Lịch sử xét nghiệm</h3>
                    </div>
                    <div className="TestHistory_Middle_Content">
                        <div className="TestHistory_Middle_Container">
                            <div className="TestHistory_Middle_Info">
                                <input type="text" placeholder="Nhập tên hồ sơ cần tìm..."></input>
                                <div className="TestHistory_List">
                                    {profilePatient.length === 0 ? <>
                                        <div className="TestHistory_List_404">
                                            <img src={printer} alt="404" width={'20%'} />
                                            <span>Không tìm thấy kết quả</span>
                                        </div>
                                    </> : <>
                                        <div className="TestHistory_List_Info">
                                            <ul>
                                                {Object.values(profilePatient).map(pp => {
                                                    return <>
                                                        <div className="TestHistory_List_Detail" value={selectedProfile} onClick={(e) => loadTestResult(pp)}>
                                                            <img src={profileicon} alt="profileicon" width={'20%'} />
                                                            <li key={pp.profilePatientId} value={pp.profilePatientId}>{pp.name}</li>
                                                        </div>
                                                    </>
                                                })}
                                            </ul>
                                        </div>
                                    </>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="TestHistory_Right">
                    <>
                        <section>
                            <div className="TestHistory_Right_Header"><h3 className="text-center mb-4">Thông tin xét nghiệm</h3></div>
                            <div className="TestHistory_Right_Content">
                                {profilePatient === null ? <>
                                    <div className="TestHistory_Null">
                                        <h5 className="mb-4">Chọn xét nghiệm cần xem</h5>
                                        <img src={profile404} alt="Not found" width={'20%'} />
                                    </div>
                                </> :
                                    <>
                                        <div>
                                            {testList.length === 0 ? <>
                                                <div className="Appointment_Null">
                                                    <h5 className="mb-4">Không tìm thấy xét nghiệm</h5>
                                                    <img src={reminder} alt="Not found" width={'20%'} />
                                                </div>
                                            </> :
                                                <>
                                                    <Table striped bordered hover>
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th>Tên bệnh nhân</th>
                                                                <th>Loại xét nghiệm</th>
                                                                <th>Kết quả</th>
                                                                <th>Chẩn đoán</th>
                                                                <th>Chuyên khoa</th>
                                                                <th>Bác sĩ</th>
                                                                <th>Chi tiết</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {Object.values(testList).map(tl => {
                                                                return <>
                                                                    {tl.userId !== null ?
                                                                        <tr key={tl.testResultId}>
                                                                            <td>{tl.testResultId}</td>
                                                                            <td>{tl.bookingId.profilePatientId.name}</td>
                                                                            <td>{tl.testServiceId.testServiceName}</td>
                                                                            <td>{tl.testResultValue}</td>
                                                                            <td>{tl.testResultDiagnosis}</td>
                                                                            <td>{tl.bookingId.scheduleId.profileDoctorId.specialtyId.specialtyName}</td>
                                                                            <td>{tl.bookingId.scheduleId.profileDoctorId.name}</td>
                                                                            <td><Button variant="primary" onClick={() => loadTestDetail(tl.testResultId)}><MdMenu /></Button></td>
                                                                        </tr>
                                                                        : ""}
                                                                </>
                                                            })}
                                                        </tbody>
                                                    </Table>
                                                    {showModal && (
                                                        <Modal fullscreen={true} show={showModal} onHide={() => { setShowModal(false) }}
                                                            style={{ display: 'block', backgroundColor: 'rgba(0.0.0.0.5)', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, zIndex: 9999 }}
                                                        >
                                                            <Modal.Header closeButton>
                                                                <Modal.Title>Thông tin xét nghiệm</Modal.Title>
                                                            </Modal.Header>
                                                            <Modal.Body>
                                                                <div className="test-body">
                                                                    <div className="test-body-info">
                                                                        <div>
                                                                            <Form.Label style={{ width: "50%" }}>Bệnh nhân</Form.Label>
                                                                            <Form.Control type="text" value={testDetail?.bookingId.profilePatientId.name} disabled />
                                                                        </div>
                                                                        <div>
                                                                            <Form.Label style={{ width: "50%" }}>Bác sĩ</Form.Label>
                                                                            <Form.Control type="text" value={testDetail?.bookingId.scheduleId.profileDoctorId.name} disabled />
                                                                        </div>
                                                                        <div>
                                                                            <Form.Label style={{ width: "50%" }}>Người thực hiện</Form.Label>
                                                                            <Form.Control type="text" value={testDetail?.userId === null ? "Chưa xét nghiệm" : `${testDetail?.userId.lastname} ${testDetail?.userId.firstname}`} disabled />
                                                                        </div>
                                                                        <div>
                                                                            <Form.Label style={{ width: "50%" }}>Tình trạng</Form.Label>
                                                                            <Form.Control type="text" value={testDetail?.testResultValue === null ? "Chưa có kết quả" : testDetail?.testResultValue} disabled />
                                                                        </div>
                                                                        <div>
                                                                            <Form.Label style={{ width: "50%" }}>Chẩn đoán</Form.Label>
                                                                            <Form.Control type="text" value={testDetail?.testResultDiagnosis === null ? "Chưa có kết quả" : testDetail?.testResultDiagnosis} disabled />
                                                                        </div>
                                                                        <div>
                                                                            <Form.Label style={{ width: "50%" }}>Loại xét nghiệm</Form.Label>
                                                                            <Form.Control type="text" value={testDetail?.testServiceId.testServiceName} disabled />
                                                                        </div>
                                                                    </div>
                                                                    <div className="test-body-pdf">
                                                                        <button className="create-pdf-butt" onClick={() => createPdf()}>Tạo PDF</button>
                                                                        {pdfUrl && (
                                                                            <>
                                                                                <iframe
                                                                                    src={pdfUrl}
                                                                                    width="100%"
                                                                                    height="600px"
                                                                                    title="PDF Viewer" />
                                                                                <button className="download-pdf-butt" onClick={downloadPDF}>Tải PDF</button>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </Modal.Body>
                                                            <Modal.Footer>
                                                                <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
                                                            </Modal.Footer>
                                                        </Modal>
                                                    )}
                                                </>
                                            }
                                        </div>
                                    </>}
                            </div>
                        </section>
                    </>
                </div>
            </div>
        </div >
    </>
}

export default TestHistory;