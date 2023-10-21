import React from 'react';
import { Radar } from 'react-chartjs-2';
import 'chart.js/auto';

function RadarChart(props) {
    // Dữ liệu và cấu hình biểu đồ
    const data = {
        labels: props.labels,
        datasets: [
            {
                label: props.titleLabel,
                data: props.data,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <Radar data={data} />
        </div>
    );
}

export default RadarChart;