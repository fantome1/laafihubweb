import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale
  } from 'chart.js';
import React from 'react';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale
);

class ActivityChart extends React.Component {

    private chartRef = React.createRef<ChartJS>()

    private data = {
        labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A'],
        datasets: [
            {
              data: [16, 20, 4, 15, 13, 10, 8, 14, 2],
              backgroundColor: '#69ADA7',
            }
        ]
    }

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className='h-full'>
                <Chart ref={this.chartRef} type='bar' data={this.data} options={{
                    // responsive: true,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            ticks: { display: false }
                        }
                    }
                }} />
            </div>
        );
    }
}

export { ActivityChart };