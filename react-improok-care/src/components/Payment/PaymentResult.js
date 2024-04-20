import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Apis, { authApi, endpoints } from "../../configs/Apis";
import "./PaymentResult.css";
import success from "../../assets/images/success.png"
import { Badge } from "react-bootstrap";

function PaymentResult() {
    const [transactionRef, setTransactionRef] = useState("");
    const [amount, setAmount] = useState("");
    const [orderInfo, setOrderInfo] = useState("");
    const [responseCode, setResponseCode] = useState("");
    const [transactionNo, setTransactionNo] = useState("");
    const [bankCode, setBankCode] = useState("");
    const [payDate, setPayDate] = useState("");
    const [transactionStatus, setTransactionStatus] = useState("");
    const [signatureValid, setSignatureValid] = useState(false);

    const {
        vnp_Amount,
        vnp_BankCode,
        vnp_BankTranNo,
        vnp_CardType,
        vnp_OrderInfo,
        vnp_PayDate,
        vnp_ResponseCode,
        vnp_TmnCode,
        vnp_TransactionNo,
        vnp_TransactionStatus,
        vnp_TxnRef,
        vnp_SecureHash,
    } = useSearchParams();

    const [q] = useSearchParams();

    useEffect(() => {
        validSignature();
        setTransactionRef(q.get("vnp_TxnRef"));
        setAmount(q.get("vnp_Amount"));
        setOrderInfo(q.get("vnp_OrderInfo"));
        setResponseCode(q.get("vnp_ResponseCode"));
        setTransactionNo(q.get("vnp_TransactionNo"));
        setBankCode(q.get("vnp_BankCode"));
        setPayDate(q.get("vnp_PayDate"));
        setTransactionStatus(q.get("vnp_TransactionStatus"));
    }, []);

    const validSignature = async () => {
        try {
            // let e = endpoints['search-users'];
            let e = `${endpoints["process-return-vnpay"]}?`;

            let vnp_Amount = q.get("vnp_Amount");
            let vnp_BankCode = q.get("vnp_BankCode");
            let vnp_BankTranNo = q.get("vnp_BankTranNo");
            let vnp_CardType = q.get("vnp_CardType");
            let vnp_OrderInfo = q.get("vnp_OrderInfo");
            let vnp_PayDate = q.get("vnp_PayDate");
            let vnp_ResponseCode = q.get("vnp_ResponseCode");
            let vnp_TmnCode = q.get("vnp_TmnCode");
            let vnp_TransactionNo = q.get("vnp_TransactionNo");
            let vnp_TransactionStatus = q.get("vnp_TransactionStatus");
            let vnp_TxnRef = q.get("vnp_TxnRef");
            let vnp_SecureHash = q.get("vnp_SecureHash");

            e += `vnp_Amount=${vnp_Amount}&vnp_BankCode=${vnp_BankCode}&vnp_BankTranNo=${vnp_BankTranNo}&vnp_CardType=${vnp_CardType}&vnp_OrderInfo=${vnp_OrderInfo}&vnp_PayDate=${vnp_PayDate}&vnp_ResponseCode=${vnp_ResponseCode}&vnp_TmnCode=${vnp_TmnCode}&vnp_TransactionNo=${vnp_TransactionNo}&vnp_TransactionStatus=${vnp_TransactionStatus}&vnp_TxnRef=${vnp_TxnRef}&vnp_SecureHash=${vnp_SecureHash}`;

            console.log(e);
            let res = await Apis.get(e);

            console.log(res.data);

            console.log(res.data);
            setSignatureValid(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const checkPayment = async () => {
        try {
            console.log(q.get("vnp_OrderInfo"));
            let payStatus = q.get("vnp_OrderInfo").substring(0, 1);
            let prescriptionId = q.get("vnp_OrderInfo").split("-")[1];
            let paymentTxnRef = q.get("vnp_TxnRef");
            console.log(payStatus);
            console.log(prescriptionId);
            if (payStatus === "1") {
                let res = await authApi().post(endpoints['pay-service'], {
                    "service_payment_TxnRef": paymentTxnRef,
                    "prescriptionId": prescriptionId
                });
                console.log(res.data)
            }
            else if (payStatus === "2") {
                let res = await authApi().post(endpoints['pay-medicine'], {
                    "medicine_payment_TxnRef": paymentTxnRef,
                    "prescriptionId": prescriptionId
                });
                console.log(res.data)
            } else {
                console.log("Lệch rate");
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        checkPayment();
    }, [])

    return (
        <div className="Payment_Result_Wrapper">
            <div className="Payment_Result_Header">
                <h3 className="text-muted">KẾT QUẢ THANH TOÁN</h3>
                <div className="Payment_Result_Image">
                    <img src={success} alt="success" width={"20%"} />
                </div>
            </div>
            <div className="Payment_Result_Content">
                <div className="form-group">
                    <label>Mã giao dịch thanh toán:</label>
                    <label>{transactionRef}</label>
                </div>
                <div className="form-group">
                    <label>Số tiền:</label>
                    <label>{amount} VNĐ</label>
                </div>
                <div className="form-group">
                    <label>Mô tả giao dịch:</label>
                    <label style={{ whiteSpace: 'normal' }}>{orderInfo}</label>
                </div>
                <div className="form-group">
                    <label>Mã lỗi thanh toán:</label>
                    <label>{responseCode}</label>
                </div>
                <div className="form-group">
                    <label>Mã giao dịch tại CTT VNPAY-QR:</label>
                    <label>{transactionNo}</label>
                </div>
                <div className="form-group">
                    <label>Mã ngân hàng thanh toán:</label>
                    <label>{bankCode}</label>
                </div>
                <div className="form-group">
                    <label>Thời gian thanh toán:</label>
                    <label>{payDate}</label>
                </div>
                <div className="form-group">
                    <label>Tình trạng giao dịch:</label>
                    <label>
                        {signatureValid
                            ? transactionStatus === "00"
                                ? <Badge bg="success">Thành công</Badge>
                                : <Badge bg="warning">Không thành công</Badge>
                            : <Badge bg="danger">Invalid Signature</Badge>}
                    </label>
                </div>
                <div className="form-group">
                    <button><Link to="/">Quay lại trang chủ</Link></button>
                </div>
            </div>
            <p>&nbsp;</p>
            <footer className="footer">
                <p>&copy; IMPROOK_CARE 2023</p>
            </footer>
        </div>
    );
}

export default PaymentResult;