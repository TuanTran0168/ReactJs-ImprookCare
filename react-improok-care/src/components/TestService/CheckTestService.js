import { Button, Form, Modal, Table } from "react-bootstrap";
import { useContext, useEffect } from 'react';
import medicaltest from "../../assets/images/medical-test.png"
import { useState } from 'react';
import Apis, { authApi, endpoints } from '../../configs/Apis';
import { BookingManagementContext } from '../../App';
import axios from "axios";

const CheckTestService = () => {
    const [booking,] = useContext(BookingManagementContext)
    const [testType, setTestType] = useState([])
    const [testResult, setTestResult] = useState([])
    const [selectedService, setSelectedService] = useState('')
    const [testResultDetail, setTestResultDetail] = useState(null)
    const [pdfUrl, setPdfUrl] = useState(null)

    const [showModal, setShowModal] = useState(false)

    const loadTestResult = async () => {
        try {
            let e = endpoints['load-test-result']
            e += `?profilePatientId=${booking.profilePatientId}`
            let res = await authApi().get(e)
            console.log(res.data.content)
            setTestResult(res.data.content)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadTestResult()
    }, [])

    useEffect(() => {
        const loadTestService = async () => {
            try {
                let res = await Apis.get(endpoints['load-test-service'])
                console.log(res.data.content)
                setTestType(res.data.content)
            } catch (error) {
                console.log(error)
            }
        }
        loadTestService()
    }, [])

    const loadTestResultDetail = async (testResultId) => {
        try {
            console.log(testResultId)
            let res = await authApi().get(endpoints['load-test-service-detail'](testResultId))
            console.log(res.data)
            setTestResultDetail(res.data)
            setSelectedService(res.data.testServiceId.testServiceId)
            setShowModal(true)
        } catch (error) {
            console.log(error)
        }
    }

    const handleServiceChange = (e) => {
        const selectedServiceId = e.target.value;
        setSelectedService(selectedServiceId);
    }

    const updateTestResult = async (testResultId) => {
        try {
            console.log(selectedService)
            let res = await authApi().post(endpoints['update-test-result'], {
                "testResultId": testResultId,
                "testServiceId": selectedService
            })
            console.log(res.data)
            loadTestResultDetail(testResultId)
            loadTestResult()
        } catch (error) {
            console.log(error)
        }
    }

    const createPdf = async () => {
        try {
            let response = await axios.post('http://localhost:2024/IMPROOK_CARE/api/public/generate-pdf-test-result/', {
                "profilePatientName": testResultDetail?.bookingId.profilePatientId.name,
                "profileDoctorName": testResultDetail?.bookingId.scheduleId.profileDoctorId.name,
                "nurseName": testResultDetail?.userId === null ? "Chưa xét nghiệm" : `${testResultDetail?.userId.lastname} ${testResultDetail?.userId.firstname}`,
                "birthday": testResultDetail?.bookingId.profilePatientId.birthday?.substring(0, 4),
                "address": testResultDetail?.bookingId.profilePatientId.address,
                "specialtyName": testResultDetail?.bookingId.scheduleId.profileDoctorId.specialtyId.specialtyName,
                "testResultDiagnosis": testResultDetail?.testResultDiagnosis === null ? "Chưa có kết quả" : testResultDetail?.testResultDiagnosis,
                "gender": testResultDetail?.bookingId.profilePatientId.gender === true ? "Nam" : "Nữ",
                "createdDate": testResultDetail?.createdDate,
                "updatedDate": testResultDetail?.updatedDate
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
                console.error('Failed to fetch PDF');
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
                        {Object.values(testResult).map(tr => {
                            return <>
                                {tr.userId !== null ?
                                    <tr key={tr.testResultId}>
                                        <td>{tr.testResultId}</td>
                                        <td>{tr.bookingId.profilePatientId.name}</td>
                                        <td>{tr.testServiceId.testServiceName}</td>
                                        <td>{tr.testResultValue}</td>
                                        <td>{tr.testResultDiagnosis}</td>
                                        <td>{tr.bookingId.scheduleId.profileDoctorId.specialtyId.specialtyName}</td>
                                        <td>{tr.bookingId.scheduleId.profileDoctorId.name}</td>
                                        <td><Button variant="primary" onClick={() => loadTestResultDetail(tr.testResultId)}>Chi tiết</Button></td>
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
                                        <Form.Control type="text" value={testResultDetail?.bookingId.profilePatientId.name} disabled />
                                    </div>
                                    <div>
                                        <Form.Label style={{ width: "50%" }}>Bác sĩ</Form.Label>
                                        <Form.Control type="text" value={testResultDetail?.bookingId.scheduleId.profileDoctorId.name} disabled />
                                    </div>
                                    <div>
                                        <Form.Label style={{ width: "50%" }}>Người thực hiện</Form.Label>
                                        <Form.Control type="text" value={testResultDetail?.userId === null ? "Chưa xét nghiệm" : `${testResultDetail?.userId.lastname} ${testResultDetail?.userId.firstname}`} disabled />
                                    </div>
                                    <div>
                                        <Form.Label style={{ width: "50%" }}>Tình trạng</Form.Label>
                                        <Form.Control type="text" value={testResultDetail?.testResultValue === null ? "Chưa có kết quả" : testResultDetail?.testResultValue} disabled />
                                    </div>
                                    <div>
                                        <Form.Label style={{ width: "50%" }}>Chẩn đoán</Form.Label>
                                        <Form.Control type="text" value={testResultDetail?.testResultDiagnosis === null ? "Chưa có kết quả" : testResultDetail?.testResultDiagnosis} disabled />
                                    </div>
                                    <div>
                                        <Form.Label style={{ width: "50%" }}>Loại xét nghiệm</Form.Label>
                                        <Form.Select className="test-choice-select" value={selectedService} name="selectedtService" onChange={(e) => handleServiceChange(e)}>
                                            {Object.values(testType).map(tt => <option key={tt.testServiceId} value={tt.testServiceId}>{tt.testServiceName}</option>)}
                                        </Form.Select>
                                    </div>
                                </div>
                                <div className="test-body-image">
                                    <h4>Kết quả</h4>
                                    <div className="test-image-choice">
                                        {testResultDetail?.testResultImage ? (
                                            <div>
                                                <img src={testResultDetail?.testResultImage} alt="Selected" width="100%" />
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
                            <Button variant="primary" onClick={() => updateTestResult(testResultDetail?.testResultId)}>Cập nhật</Button>
                        </Modal.Footer>
                    </Modal>
                )}
            </div>
        </>
    )
}

export default CheckTestService;