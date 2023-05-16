import {
    Chart as ChartJS,
    ArcElement,
    Legend,
    Title,
    Tooltip
  } from 'chart.js';
import React from 'react';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Legend,
    Title,
    Tooltip
);

class DeviceUsageChart extends React.Component {

    private chartRef = React.createRef<ChartJS>()

    private data = {
        labels: ['Enrolled', 'Disabled'],
        datasets: [
            {
              data: [3, 3],
              backgroundColor: ['#69ADA7', '#E0F1E1'],
            }
        ]
    }

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className='h-full'>
                <Chart ref={this.chartRef} type='doughnut' data={this.data} options={{
                    // responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'right',
                            maxWidth: 180,
                            labels: {
                                boxWidth: 10
                            }
                        }
                    }
                }} />
            </div>
        );
    }
}

class DeviceUsageChart2 extends React.Component {

    private chartRef = React.createRef<ChartJS>()

    private data = {
        labels: ['Enrolled', 'Disabled'],
        datasets: [
            {
              data: [3.5, 3],
              backgroundColor: ['#69ADA7', '#F2994A'],
            }
        ]
    }

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className='h-full'>
                <Chart ref={this.chartRef} type='doughnut' data={this.data} options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'right',
                            maxWidth: 180,
                            labels: {
                                boxWidth: 10
                            }
                        }
                    }
                }} />
            </div>
        );
    }
}

class DeviceStatusChart extends React.Component {

    private chartRef = React.createRef<ChartJS>()

    private data = {
        labels: ['Enrolled', 'Unsassigned', 'Disabled'],
        datasets: [
            {
              data: [9, 8, 1],
              backgroundColor: ['#69ADA7', '#999999', '#D80303'],
            }
        ]
    }

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className='h-full'>
                <Chart ref={this.chartRef} type='doughnut' data={this.data} options={{
                    // responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'right',
                            maxWidth: 180,
                            labels: {
                                boxWidth: 10
                            }
                        }
                    }
                }} />
            </div>
        );
    }
}

export { DeviceUsageChart, DeviceUsageChart2, DeviceStatusChart };