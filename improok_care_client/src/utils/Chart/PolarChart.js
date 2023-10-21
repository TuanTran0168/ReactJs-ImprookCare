import React from 'react';
import { PolarArea } from 'react-chartjs-2';
import 'chart.js/auto';

function PolarChart(props) {
    // Dữ liệu và cấu hình biểu đồ
    const data = {
        labels: props.labels,
        datasets: [
            {
                label: props.titleLabel,
                data: props.data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // const options = {
    //     scales: {
    //         y: {
    //             beginAtZero: true,
    //         },
    //     },
    // };

    return (
        <div>
            <PolarArea data={data} />
        </div>
    );
}

export default PolarChart;