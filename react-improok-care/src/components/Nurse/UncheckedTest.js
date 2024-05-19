import { useContext, useEffect, useRef, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { UserContext } from "../../App";
import { authApi, endpoints } from "../../configs/Apis";
// import medicaltest from "../../assets/images/medical-test.png"
import { MdMenu } from "react-icons/md";
import Swal from "sweetalert2";

const UncheckedTest = () => {
    const [current_user,] = useContext(UserContext)
    const [testList, setTestList] = useState([])
    const [showModal, setShowModal] = useState(false)

    const [testResultValue, setTestResultValue] = useState('')
    const [testResultDiagnosis, setTestResultDiagnosis] = useState('')

    const [selectedImage, setSelectedImage] = useState('');
    const [testResultDetail, setTestResultDetail] = useState(null);
    const testImage = useRef();

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

    const returnTestResult = async (testResultId) => {
        try {
            let form = new FormData()

            form.append("testResultId", testResultId)
            form.append("userId", current_user?.userId)
            form.append("testResultValue", testResultValue)
            form.append("testResultDiagnosis", testResultDiagnosis)
            // if (testImage.current.files[0] !== undefined) {
            //     form.append("image", testImage.current.files[0]);
            // } else {
            //     form.append("image", new Blob());
            // }
            form.append("image", new Blob());

            let res = await authApi().post(endpoints['return-test-result'], form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            console.log(res.data)
            setShowModal(false)
            Swal.fire(
                'Thành công', "Điền xét nghiệm thành công!", 'success'
            );
        } catch (error) {
            console.log(error)
        }
    }
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
                                {tl.userId === null ?
                                    <tr key={tl.testResultId}>
                                        <td>{tl.testResultId}</td>
                                        <td>{tl.bookingId.profilePatientId.name}</td>
                                        <td>{tl.testServiceId.testServiceName}</td>
                                        <td>{tl.testResultValue}</td>
                                        <td>{tl.testResultDiagnosis}</td>
                                        <td>{tl.bookingId.scheduleId.profileDoctorId.specialtyId.specialtyName}</td>
                                        <td>{tl.bookingId.scheduleId.profileDoctorId.name}</td>
                                        <td><Button variant="primary" onClick={() => loadTestResultDetail(tl.testResultId)}><MdMenu /></Button></td>
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
                                        <Form.Control type="Text" defaultValue={testResultDiagnosis} onChange={(e) => setTestResultDiagnosis(e.target.value)} placeholder="Nhập chẩn đoán..." />
                                        :
                                        <Form.Control type="Text" value={testResultDetail?.testResultDiagnosis} disabled />
                                    }
                                </div>
                                <div>
                                    <Form.Label style={{ width: "50%" }}>Loại xét nghiệm</Form.Label>
                                    <Form.Control type="text" value={testResultDetail?.testServiceId.testServiceName} disabled />
                                </div>
                            </div>
                            {/* <div className="test-body-image">
                                <h4>Kết quả</h4>
                                <div className="Avatar_Choice">
                                    {selectedImage ? (
                                        <div>
                                            <img src={selectedImage} alt="Selected" width="100%" />
                                        </div>
                                    ) : (
                                        <div className="Avatar_Null">
                                            <span>Vui lòng chọn ảnh</span>
                                            <img src={medicaltest} alt="medical test" />
                                        </div>
                                    )}
                                    <Form.Control type="File" ref={testImage} onChange={handleImageChange} width={'50%'} />
                                </div>
                            </div> */}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
                        <Button variant="primary" onClick={() => returnTestResult(testResultDetail?.testResultId)}>Lưu</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    )
}

export default UncheckedTest;