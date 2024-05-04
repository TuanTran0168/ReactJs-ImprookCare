import { useContext, useEffect } from 'react';
import './TestService.css'
import medicaltest from "../../assets/images/medical-test.png"
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import Apis, { authApi, endpoints } from '../../configs/Apis';
import { BookingManagementContext } from '../../App';
import { toast } from 'react-toastify';
import { NavLink, Outlet } from 'react-router-dom';

const TestService = () => {
    const [booking,] = useContext(BookingManagementContext)
    const [testType, setTestType] = useState([])
    const [testChoice, setTestChoice] = useState(null)
    const [testResult, setTestResult] = useState([])

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

    const addTestResult = async () => {
        try {
            let res = await authApi().post(endpoints['add-test-result'], {
                "testServiceId": testChoice === null ? "1" : testChoice,
                "bookingId": booking.bookingId
            })
            toast.success("Tạo xét nghiệm thành công!")
            console.log(res.data)
            loadTestResult()
        } catch (error) {
            console.log(error)
        }
    }

    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    return (
        <>
            <div className='test-service-wrapper'>
                <div className='test-service'>
                    <h3 className="text-center">THÔNG TIN XÉT NGHIỆM</h3>
                    <div className='test-service-register'>
                        <h5>Đăng ký xét nghiệm</h5>
                        <div>
                            <h6>Loại xét nghiệm</h6>
                            <Form.Select className="test-choice-select" value={testChoice} name="testChoice" onChange={(e) => setTestChoice(e.target.value)}>
                                {Object.values(testType).map(tt => <option key={tt.testServiceId} value={tt.testServiceId}>{tt.testServiceName}</option>)}
                            </Form.Select>
                            <Button variant='primary' onClick={() => addTestResult()}>Đăng ký</Button>
                        </div>
                    </div>
                    <div className='test-service-history'>
                        <h5>Kết quả xét nghiệm</h5>
                        {testResult.length === 0 ?
                            <>
                                <div className="test-service-history-null">
                                    <h5 className="mb-4">Bệnh nhân này chưa có xét nghiệm nào</h5>
                                    <img src={medicaltest} alt="Not found" width={'20%'} />
                                </div>
                            </> :
                            <>
                                <div className="test-service-menu">
                                    <div>
                                        <NavLink
                                            activeClassName="active"
                                            onClick={() => handleItemClick("unchecktestservice")}
                                            to="unchecktestservice">
                                            <span className="text">Chờ xét nghiệm</span>
                                        </NavLink>
                                        <NavLink
                                            activeClassName="active"
                                            onClick={() => handleItemClick("checktestservice")}
                                            to="checktestservice">
                                            <span className="text">Đã xét nghiệm</span>
                                        </NavLink>
                                    </div>
                                </div>
                                <Outlet />
                            </>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default TestService;