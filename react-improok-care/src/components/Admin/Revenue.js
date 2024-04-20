import { useEffect, useState } from "react";
import BarChart from "../../utils/Chart/BarChart";
import Apis, { endpoints } from "../../configs/Apis";

const Revenue = () => {
    const [statsDataMedicinePrescriptionPaid, setStatsDataMedicinePrescriptionPaid] = useState([]);
    const [statsLabelsMedicinePrescriptionPaid, setStatsLabelsMedicinePrescriptionPaid] = useState([]);

    const [statsDataMedicinePrescriptionUnpaid, setStatsDataMedicinePrescriptionUnpaid] = useState([]);
    const [statsLabelsMedicinePrescriptionUnpaid, setStatsLabelsMedicinePrescriptionUnpaid] = useState([]);

    const [statsDataServicePricePaid, setStatsDataServicePricePaid] = useState([]);
    const [statsLabelsServicePricePaid, setStatsLabelsServicePricePaid] = useState([]);

    const [statsDataServicePriceUnpaid, setStatsDataServicePriceUnpaid] = useState([]);
    const [statsLabelsServicePriceUnpaid, setStatsLabelsServicePriceUnpaid] = useState([]);

    const tempStatsDataMedicinePrescriptionPaid = [];
    const tempStatsLabelsMedicinePrescriptionPaid = [];

    const tempStatsDataMedicinePrescriptionUnpaid = [];
    const tempStatsLabelsMedicinePrescriptionUnpaid = [];

    const tempStatsDataServicePricePaid = [];
    const tempStatsLabelsServicePricePaid = [];

    const tempStatsDataServicePriceUnpaid = [];
    const tempStatsLabelsServicePriceUnpaid = [];

    const statsMedicinePrescriptionPaid = async () => {
        try {
            let res = await Apis.get(endpoints['stats-medicine-prescription-paid']);
            console.log(res.data)
            res.data.map(item => {
                tempStatsDataMedicinePrescriptionPaid.push(item[1]);
                tempStatsLabelsMedicinePrescriptionPaid.push(item[0]);
                console.log("Đây là statsMedicinePrescriptionPaid")
                console.log(item[1]);
            })
            setStatsDataMedicinePrescriptionPaid(tempStatsDataMedicinePrescriptionPaid);
            setStatsLabelsMedicinePrescriptionPaid(tempStatsLabelsMedicinePrescriptionPaid);
        } catch (error) {
            console.log(error);
        }
    }

    const statsMedicinePrescriptionUnpaid = async () => {
        try {
            let res = await Apis.get(endpoints['stats-medicine-prescription-unpaid']);
            console.log(res.data)
            res.data.map(item => {
                tempStatsDataMedicinePrescriptionUnpaid.push(item[1]);
                tempStatsLabelsMedicinePrescriptionUnpaid.push(item[0]);
                console.log(item[1]);
            })
            setStatsDataMedicinePrescriptionUnpaid(tempStatsDataMedicinePrescriptionUnpaid);
            setStatsLabelsMedicinePrescriptionUnpaid(tempStatsLabelsMedicinePrescriptionUnpaid);
        } catch (error) {
            console.log(error);
        }
    }

    const statsServicePricePaid = async () => {
        try {
            let res = await Apis.get(endpoints['stats-service-price-paid']);
            console.log(res.data)
            res.data.map(item => {
                tempStatsDataServicePricePaid.push(item[2]);
                tempStatsLabelsServicePricePaid.push(item[1]);
                console.log(item[1]);
            })
            setStatsDataServicePricePaid(tempStatsDataServicePricePaid);
            setStatsLabelsServicePricePaid(tempStatsLabelsServicePricePaid);
        } catch (error) {
            console.log(error);
        }
    }

    const statsServicePriceUnpaid = async () => {
        try {
            let res = await Apis.get(endpoints['stats-service-price-unpaid']);
            console.log(res.data)
            res.data.map(item => {
                tempStatsDataServicePriceUnpaid.push(item[2]);
                tempStatsLabelsServicePriceUnpaid.push(item[1]);
                console.log(item[1]);
            })
            setStatsDataServicePriceUnpaid(tempStatsDataServicePriceUnpaid);
            setStatsLabelsServicePriceUnpaid(tempStatsLabelsServicePriceUnpaid);
        } catch (error) {
            console.log(error);
        }
    }

    let isLoad = 0;

    useEffect(() => {
        if (isLoad === 0) {
            statsMedicinePrescriptionPaid();
            statsMedicinePrescriptionUnpaid();
            statsServicePricePaid();
            statsServicePriceUnpaid();
            isLoad = 1;
        }
    }, [])

    return (
        <>
            <div className="Stats_Revenue_Detail">
                <div className="Stats_Service_Price">
                    <div className="Stats_Service_Price_Paid">
                        <BarChart labels={statsLabelsServicePricePaid} titleLabel="Biểu đồ thống kê số tiền khám đã trả" data={statsDataServicePricePaid} />
                    </div>
                    <div className="Stats_Service_Price_Unpaid">
                        <BarChart labels={statsLabelsServicePriceUnpaid} titleLabel="Biểu đồ thống kê số tiền khám chưa trả" data={statsDataServicePriceUnpaid} />
                    </div>
                </div>
                <div className="Stats_Medicine_Prescription">
                    <div className="Stats_Medicine_Prescription_Paid">
                        <BarChart labels={statsLabelsMedicinePrescriptionPaid} titleLabel="Biểu đồ thống kê số tiền thuốc đã trả" data={statsDataMedicinePrescriptionPaid} />
                    </div>
                    <div className="Stats_Medicine_Prescription_Unpaid">
                        <BarChart labels={statsLabelsMedicinePrescriptionUnpaid} titleLabel="Biểu đồ thống kê số tiền thuốc chưa trả" data={statsDataMedicinePrescriptionUnpaid} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Revenue;