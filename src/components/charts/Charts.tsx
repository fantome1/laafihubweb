// @ts-nocheck
import {
    Chart as ChartJS,
    ArcElement,
    Legend,
    Title,
    Tooltip,
    PointElement,
    LineElement
  } from 'chart.js';
import React from 'react';
import { Chart } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
    ArcElement,
    Legend,
    Title,
    Tooltip,
    PointElement,
    LineElement,
    ChartDataLabels
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

class TemperatureChart extends React.Component {

    private chartRef = React.createRef<ChartJS>()

    private data = {
        datasets: [
            {
              cutout: 98, 
              circumference: 280,
              rotation: -140,
              borderWidth: [0, 0],
              data: [3.5, 3],
              backgroundColor: ['#69ADA7', '#23C4D81F'],
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
                            display: false,
                        }
                    }
                }} />
            </div>
        );
    }
}

class TemperatureLineChart extends React.Component {

    private chartRef = React.createRef<ChartJS>()

    private data = {
        labels: [1, 4, 2.3, 1.5, 1.4, 1.2, 1],
        datasets: [
            {
            //   fill: true,
              tension: 0.1,
              borderColor: '#69ADA7',
              data: [1, 4, 2.3, 1.5, 1.4, 1.2, 1.1, 1]
            }
        ]
    }

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className='h-full'>
                <Chart ref={this.chartRef} type='line' data={this.data} options={{
                    responsive: true,
                    scales: {
                        x: {
                            ticks: {
                                display: false
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                display: false
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false,
                        }
                    }
                }} />
            </div>
        );
    }
}

class ConnectionStatusChart extends React.Component {

    private chartRef = React.createRef<ChartJS>()

    private data = {
        labels: ['Connected', 'Not connected'],
        datasets: [
            {
              data: [240, 120],
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
                <Chart ref={this.chartRef} type='pie' data={this.data} options={{
                    responsive: true,
                    tooltips: {
                        enabled: true
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'right',
                            maxWidth: 180,
                            labels: {
                                boxWidth: 10
                            }
                        },
                        datalabels: {
                            color: '#fff',
                            formatter: (value, ctx) => {
                                // let dataArr = ctx.chart.data.datasets[0].data;
                                // const sum = dataArr.reduce((s, v) => s + v, 0);
                                // const percent = (value * 100 / sum).toFixed(2);
                                // return `${value} (${percent}%)`;
                                return value;
                            }
                        }
                    }
                }} />
            </div>
        );
    }
}

export { DeviceUsageChart, DeviceUsageChart2, DeviceStatusChart, TemperatureChart, TemperatureLineChart, ConnectionStatusChart };