import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { UserContext } from "../../App";
import Apis, { authApi, endpoints } from "../../configs/Apis";
import medicaltest from "../../assets/images/medical-test.png"
import moment from "moment";

const CheckedTest = () => {
    const [current_user,] = useContext(UserContext)
    const [testList, setTestList] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [pdfUrl, setPdfUrl] = useState(null)
    const [testResultValue, setTestResultValue] = useState('')
    const [testResultDiagnosis, setTestResultDiagnosis] = useState('')
    // const [selectedImage, setSelectedImage] = useState('');
    const [testResultDetail, setTestResultDetail] = useState(null);
    // const testImage = useRef();

    useEffect(() => {
        const loadTestList = async () => {
            try {
                let res = await authApi().get(endpoints['load-test-result'])
                console.log(res.data.content)
                setTestList(res.data.content)
            } catch (error) {
                console.log(error)
            }
        }
        loadTestList()
    }, [testResultDetail])

    // const handleImageChange = (event) => {
    //     const file = event.target.files[0];
    //     const reader = new FileReader();

    //     reader.onloadend = () => {
    //         setSelectedImage(reader.result);
    //     };

    //     if (file) {
    //         reader.readAsDataURL(file);
    //     }
    // };

    const loadTestResultDetail = async (testResultId) => {
        try {
            console.log(testResultId)
            let res = await authApi().get(endpoints['load-test-service-detail'](testResultId))
            setTestResultDetail(res.data)
            console.log(res.data)
            setShowModal(true)
        } catch (error) {
            console.log(error)
        }
    }

    const createPdf = async () => {
        try {
            let response = await Apis.post(endpoints['create-pdf-result'], {
                "profilePatientName": testResultDetail?.bookingId.profilePatientId.name,
                "profileDoctorName": testResultDetail?.bookingId.scheduleId.profileDoctorId.name,
                "nurseName": testResultDetail?.userId === null ? "Chưa xét nghiệm" : `${testResultDetail?.userId.lastname} ${testResultDetail?.userId.firstname}`,
                "birthday": moment(testResultDetail?.bookingId.profilePatientId.birthday).format('DD-MM-YYYY'),
                "address": testResultDetail?.bookingId.profilePatientId.address,
                "specialtyName": testResultDetail?.bookingId.scheduleId.profileDoctorId.specialtyId.specialtyName,
                "testResultDiagnosis": testResultDetail?.testResultDiagnosis === null ? "Chưa có kết quả" : testResultDetail?.testResultDiagnosis,
                "gender": testResultDetail?.bookingId.profilePatientId.gender === true ? "Nam" : "Nữ",
                "createdDate": moment(testResultDetail?.createdDate).format('DD-MM-YYYY'),
                "updatedDate": moment(testResultDetail?.updatedDate).format('DD-MM-YYYY')
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

    return (
        <>
            <div>
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
                                        <td><Button variant="primary" onClick={() => loadTestResultDetail(tl.testResultId)}>Chi tiết</Button></td>
                                    </tr>
                                    : ""}
                            </>
                        })}
                    </tbody>
                </Table>
            </div>
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
                                    <Form.Control type="text" value={testResultDetail?.bookingId.profilePatientId.name} disabled />
                                </div>
                                <div>
                                    <Form.Label style={{ width: "50%" }}>Bác sĩ</Form.Label>
                                    <Form.Control type="text" value={testResultDetail?.bookingId.scheduleId.profileDoctorId.name} disabled />
                                </div>
                                <div>
                                    <Form.Label style={{ width: "50%" }}>Người thực hiện</Form.Label>
                                    <Form.Control type="text" value={`${current_user?.lastname} ${current_user?.firstname}`} disabled />
                                </div>
                                <div>
                                    <Form.Label style={{ width: "50%" }}>Tình trạng</Form.Label>
                                    {testResultDetail?.testResultValue === null ?
                                        <Form.Control type="Text" defaultValue={testResultValue} onChange={(e) => setTestResultValue(e.target.value)} placeholder="Nhập tình trạng..." />
                                        :
                                        <Form.Control type="Text" value={testResultDetail?.testResultValue} disabled />
                                    }
                                </div>
                                <div>
                                    <Form.Label style={{ width: "50%" }}>Chẩn đoán</Form.Label>
                                    {testResultDetail?.testResultDiagnosis === null ?
                                        <Form.Control type="Text" defaultValue={testResultDiagnosis} onChange={(e) => setTestResultDiagnosis(e.target.value)} placeholder="Nhập triệu chứng..." />
                                        :
                                        <Form.Control type="Text" value={testResultDetail?.testResultDiagnosis} disabled />
                                    }
                                </div>
                                <div>
                                    <Form.Label style={{ width: "50%" }}>Loại xét nghiệm</Form.Label>
                                    <Form.Control type="text" value={testResultDetail?.testServiceId.testServiceName} disabled />
                                </div>
                            </div>
                            <div className="test-body-image">
                                <h4>Kết quả</h4>
                                <div className="test-image-choice">
                                    {testResultDetail?.testResultImage ? (
                                        <div>
                                            <img src={testResultDetail?.testResultImage} alt="Selected" width="40%" />
                                        </div>
                                    ) : (
                                        <div className="Avatar_Null">
                                            <img src={medicaltest} alt="medical test" />
                                        </div>
                                    )}
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
                        {/* <Button variant="primary" onClick={() => returnTestResult(testResultDetail?.testResultId)}>Lưu</Button> */}
                    </Modal.Footer>
                </Modal>
            )}
        </>
    )
}

export default CheckedTest;