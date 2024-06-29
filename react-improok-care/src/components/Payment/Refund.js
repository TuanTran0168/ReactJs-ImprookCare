import React, { useState, useEffect, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Apis, { authApi, endpoints } from "../../configs/Apis";
import "./Refund.css";
import success from "../../assets/images/success.png"
import { Badge } from "react-bootstrap";
import { UserContext } from "../../App";
import cookie from "react-cookies";
import { reConnectNotification } from "../../utils/WebSocket";
import moment from "moment";

const Refund = () => {
    const [current_user,] = useContext(UserContext)
    const [signatureValid, setSignatureValid] = useState([]);
    // const [bookingResult,] = useContext(BookingResultContext)
    // const [bookingId, setBookingId] = useState(cookie.load('bookingresult'))

    const [q] = useSearchParams();

    useEffect(() => {
        // validSignature(bookingResult);
        getPaymentHistory()
        let client = cookie.load("socket")
        console.log("Client", client?.connected);
        if (current_user && client) {
            cookie.remove("socket");
            reConnectNotification(false, current_user?.userId);
        }
    }, [current_user]);

    const getPaymentHistory = async () => {
        try {
            let bookingId = q.get('bookingId')
            let res = await authApi().get(endpoints['get-payment-by-booking'](bookingId))
            console.log(res.data)
            validSignature(bookingId)
        } catch (error) {
            console.log(error)
        }
    }

    const validSignature = async (bookingId) => {
        try {
            let paymentDate = q.get("vnp_PayDate")
            let paymentTxnRef = q.get("vnp_TxnRef");
            console.log(paymentDate);
            console.log(paymentTxnRef);
            let res = await Apis.post(endpoints['check-payment'], {
                "vnp_TxnRef": paymentTxnRef,
                "vnp_TransactionDate": paymentDate
            })
            console.log(res.data);
            setSignatureValid(res.data);
            let vnp_ResponseId = res.data.vnp_ResponseId;
            let vnp_command = res.data.vnp_Command;
            let vnp_ResponseCode = res.data.vnp_ResponseCode;
            let vnp_Message = res.data.vnp_Message;
            let vnp_tmncode = res.data.vnp_TmnCode;
            let vnp_txnref = res.data.vnp_TxnRef;
            let vnp_amount = res.data.vnp_Amount;
            let vnp_orderinfo = res.data.vnp_OrderInfo;
            let vnp_bankcode = res.data.vnp_BankCode;
            let vnp_PayDate = res.data.vnp_PayDate;
            let vnp_TransactionNo = res.data.vnp_TransactionNo;
            let vnp_TransactionStatus = res.data.vnp_TransactionStatus;
            let vnp_securehash = res.data.vnp_SecureHash;
            let e = endpoints['add-payment']
            e += `?bookingId=${bookingId}&vnp_ResponseId=${vnp_ResponseId}&vnp_command=${vnp_command}&vnp_ResponseCode=${vnp_ResponseCode}&vnp_Message=${vnp_Message}&vnp_tmncode=${vnp_tmncode}&vnp_txnref=${vnp_txnref}&vnp_amount=${vnp_amount}&vnp_orderinfo=${vnp_orderinfo}&vnp_bankcode=${vnp_bankcode}&vnp_PayDate=${vnp_PayDate}&vnp_TransactionNo=${vnp_TransactionNo}&vnp_TransactionStatus=${vnp_TransactionStatus}&vnp_securehash=${vnp_securehash}`;
            console.log(e);
            let pay = await authApi().get(e)
            console.log(pay.data)
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        // addPayment();
    }, [])

    return (
        <div className="Payment_Result_Wrapper">
            <div className="Payment_Result_Header">
                <h3 className="text-muted">KẾT QUẢ HOÀN TIỀN</h3>
                <div className="Payment_Result_Image">
                    <img src={success} alt="success" width={"20%"} />
                </div>
            </div>
            <div className="Payment_Result_Content">
                <div className="form-group">
                    <label>Mã giao dịch hoàn tiền:</label>
                    <label>{signatureValid.vnp_TxnRef}</label>
                </div>
                <div className="form-group">
                    <label>Số tiền:</label>
                    <label>{signatureValid.vnp_Amount} VNĐ</label>
                </div>
                <div className="form-group">
                    <label>Mô tả giao dịch:</label>
                    {/* <label style={{ whiteSpace: 'normal' }}>{signatureValid.vnp_OrderInfo}</label> */}
                    <label style={{ whiteSpace: 'normal' }}>{decodeURIComponent(signatureValid.vnp_OrderInfo)}</label>
                </div>
                <div className="form-group">
                    <label>Mã lỗi thanh toán:</label>
                    <label>{signatureValid.vnp_ResponseCode}</label>
                </div>
                <div className="form-group">
                    <label>Mã giao dịch tại CTT VNPAY-QR:</label>
                    <label>{signatureValid.vnp_TransactionNo}</label>
                </div>
                <div className="form-group">
                    <label>Mã ngân hàng:</label>
                    <label>{signatureValid.vnp_BankCode}</label>
                </div>
                <div className="form-group">
                    <label>Thời gian:</label>
                    <label><label>{moment(signatureValid.vnp_PayDate, "YYYYMMDDHHmmss").format("DD-MM-YYYY HH:mm:ss")}</label></label>
                </div>
                <div className="form-group">
                    <label>Tình trạng giao dịch:</label>
                    <label>
                        {signatureValid
                            ? signatureValid.vnp_TransactionStatus === "00"
                                ? <Badge bg="success">Thành công</Badge>
                                : <Badge bg="warning">Không thành công</Badge>
                            : <Badge bg="danger">Invalid Signature</Badge>}
                    </label>
                </div>
                <div className="form-group">
                    <button><Link to="/">Về trang chủ</Link></button>
                </div>
            </div>
            <p>&nbsp;</p>
            <footer className="footer">
                <p>&copy; IMPROOK_CARE 2024</p>
            </footer>
        </div>
    );
}

export default Refund;