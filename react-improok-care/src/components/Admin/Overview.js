import { useEffect, useState } from "react";
import BarChart from "../../utils/Chart/BarChart";
import PieChart from "../../utils/Chart/PieChart";
import Apis, { endpoints } from "../../configs/Apis";

const Overview = () => {
    const [statsLabelsUserByBooking, setStatsLabelsUserByBooking] = useState([]);
    const [statsDataUserByBooking, setStatsDataUserByBooking] = useState([]);
    const [statsLabelsMedicinePrescriptionAllPaid, setStatsLabelsMedicinePrescriptionAllPaid] = useState([]);
    const [statsDataMedicinePrescriptionAllPaid, setStatsDataMedicinePrescriptionAllPaid] = useState([]);
    const [statsDataServicePriceAllPaid, setStatsDataServicePriceAllPaid] = useState([]);
    const [statsLabelsServicePriceAllPaid, setStatsLabelsServicePriceAllPaid] = useState([]);

    const tempStatsDataUserByBooking = [];
    const tempStatsLabelsUserByBooking = [];

    const tempStatsDataMedicinePrescriptionAllPaid = [];
    const tempStatsLabelsMedicinePrescriptionAllPaid = [];

    const tempStatsDataServicePriceAllPaid = [];
    const tempStatsLabelsServicePriceAllPaid = [];

    let isLoad = 0;

    useEffect(() => {
        if (isLoad === 0) {
            statsBookingByUser();
            statsServicePriceAllpaid();
            statsMedicinePrescriptionAllpaid();
            isLoad = 1;
        }
    }, [])

    const statsBookingByUser = async () => {
        try {
            let res = await Apis.get(endpoints['stats-booking-by-user']);
            console.log(res.data)
            res.data.map(item => {
                tempStatsDataUserByBooking.push(item[2]);
                tempStatsLabelsUserByBooking.push(item[1]);
                console.log(item[1]);
            })
            setStatsDataUserByBooking(tempStatsDataUserByBooking);
            setStatsLabelsUserByBooking(tempStatsLabelsUserByBooking);
            // for (let item in res.data) {
            //     setStatsDataUserByBooking(item[2]);
            //     setStatsLabelsUserByBooking(item[1]);
            //     console.log(item[1]);
            // }
        } catch (error) {
            console.log(error);
        }
    }

    const statsMedicinePrescriptionAllpaid = async () => {
        try {
            let res = await Apis.get(endpoints['stats-medicine-prescription-allpaid']);
            console.log(res.data)
            res.data.map(item => {
                tempStatsDataMedicinePrescriptionAllPaid.push(item[1]);
                tempStatsLabelsMedicinePrescriptionAllPaid.push(item[0]);
                console.log(item[1]);
            })
            setStatsDataMedicinePrescriptionAllPaid(tempStatsDataMedicinePrescriptionAllPaid);
            setStatsLabelsMedicinePrescriptionAllPaid(tempStatsLabelsMedicinePrescriptionAllPaid);
            // for (let item in res.data) {
            //     setStatsDataUserByBooking(item[2]);
            //     setStatsLabelsUserByBooking(item[1]);
            //     console.log(item[1]);
            // }
        } catch (error) {
            console.log(error);
        }
    }

    const statsServicePriceAllpaid = async () => {
        try {
            let res = await Apis.get(endpoints['stats-service-price-allpaid']);
            console.log(res.data)
            res.data.map(item => {
                tempStatsDataServicePriceAllPaid.push(item[2]);
                tempStatsLabelsServicePriceAllPaid.push(item[1]);
                console.log(item[1]);
            })
            setStatsDataServicePriceAllPaid(tempStatsDataServicePriceAllPaid);
            setStatsLabelsServicePriceAllPaid(tempStatsLabelsServicePriceAllPaid);
            // for (let item in res.data) {
            //     setStatsDataUserByBooking(item[2]);
            //     setStatsLabelsUserByBooking(item[1]);
            //     console.log(item[1]);
            // }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="Overview_Stats">
                <div className="Stats_Booking">
                    <div>
                        <BarChart labels={statsLabelsUserByBooking} titleLabel="Biểu đồ thống kê lượt Booking" data={statsDataUserByBooking} />
                    </div>
                </div>
                <div className="Stats_Revenue">
                    <div>
                        <PieChart labels={statsLabelsMedicinePrescriptionAllPaid} titleLabel="Biểu đồ thống kê số tiền thuốc của bác sĩ" data={statsDataMedicinePrescriptionAllPaid} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Overview;