// @ts-nocheck
import {
    Chart as ChartJS,
    ArcElement,
    Legend,
    Title,
    Tooltip,
    PointElement,
    LineElement,
    PieController,
    DoughnutController,
    BarController,
    Filler
  } from 'chart.js';
import React from 'react';
import { Chart, Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { IGetDeviceResult } from '../../models/device_mdoel';
import { IGetActivitiesResult } from '../../models/activity_model';

ChartJS.register(
    ArcElement,
    Legend,
    Title,
    Tooltip,
    PointElement,
    LineElement,
    ChartDataLabels,
    DoughnutController,
    BarController,
    PieController,
    Filler
);

type LaafiMonitorDeviceUsageChartProps = {
    promise: Promise<IGetDeviceResult>|null;
};

type LaafiMonitorDeviceUsageChartState = {
    data: {
        labels: string[],
        datasets: {
            data: number[],
            backgroundColor: string[]
        }[]
    }
};

class LaafiMonitorDeviceUsageChart extends React.Component<LaafiMonitorDeviceUsageChartProps, LaafiMonitorDeviceUsageChartState> {

    private chartRef = React.createRef<ChartJS>();

    private static colors = { 'Disable': '#F2994A', 'Assigned': '#69ADA7', 'UnAssigned': '#999999' }

    constructor(props: LaafiMonitorDeviceUsageChartProps) {
        super(props);

        this.state = {
            data: {
                labels: ['UnAssigned'],
                datasets: [
                    {
                      data: [1],
                      backgroundColor: ['#A2A2A2'],
                    }
                ]
            }
        };
    }

    componentDidMount(): void {
        this.update(this.props.promise);
    }

    componentDidUpdate(prevProps: Readonly<LaafiMonitorDeviceUsageChartProps>, prevState: Readonly<LaafiMonitorDeviceUsageChartState>, snapshot?: any): void {
        if (prevProps.promise != this.props.promise) {
            this.update(this.props.promise);
        }
    }

    update(promise: Promise<IGetDeviceResult>|null) {
        if (promise == null)
            return;            
        promise.then(value => {
            const data = {
                labels: value.totalSatus.map(v => v.id),
                datasets: [
                    {
                        data: value.totalSatus.map(v => v.total),
                        backgroundColor: value.totalSatus.map(v => LaafiMonitorDeviceUsageChart.colors[v.id])
                    }
                ]
            };

            this.setState({ data });
        });
    }

    render() {
        return (
            <div className='h-full'>
                <Chart ref={this.chartRef} type='doughnut' data={this.state.data} options={{
                    responsive: true,
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
                            display: false
                        }
                    }
                }} />
            </div>
        );
    }
}

class DeviceUsageChart3 extends React.Component {

    private chartRef = React.createRef<ChartJS>()

    private data = {
        labels: ['Enrolled', 'Disabled'],
        datasets: [
            {
              data: [3, 3],
              backgroundColor: ['#F2994A', '#F5DBC4'],
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
                    // maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'right',
                            maxWidth: 180,
                            labels: { boxWidth: 10 }
                        },
                        datalabels: { display: false }
                    }
                }} />
            </div>
        );
    }
}

type LaafiMonitorDeviceStatusChartProps = {
    promise: Promise<IGetDeviceResult>|null;
};

type LaafiMonitorDeviceStatusChartState = {
    data: {
        labels: string[],
        datasets: {
            data: number[],
            backgroundColor: string[]
        }[]
    }
};

class LaafiMonitorDeviceStatusChart extends React.Component<LaafiMonitorDeviceStatusChartProps, LaafiMonitorDeviceStatusChartState>  {

    private chartRef = React.createRef<ChartJS>();
    private static colors = { 'Online': '#69ADA7', 'Offline': '#D80303' };

    constructor(props: LaafiMonitorDeviceUsageChartProps) {
        super(props);

        this.state = {
            data: {
                labels: ['UnAssigned'],
                datasets: [
                    {
                      data: [1],
                      backgroundColor: ['#A2A2A2'],
                    }
                ]
            }
        };
    }

    componentDidMount(): void {
        this.update(this.props.promise);
    }

    componentDidUpdate(prevProps: Readonly<LaafiMonitorDeviceUsageChartProps>, prevState: Readonly<LaafiMonitorDeviceUsageChartState>, snapshot?: any): void {
        if (prevProps.promise != this.props.promise) {
            this.update(this.props.promise);
        }
    }

    update(promise: Promise<IGetDeviceResult>|null) {
        if (promise == null)
            return;            
        promise.then(value => {
            const data = {
                labels: value.totalConnected.map(v => v.id),
                datasets: [
                    {
                        data: value.totalConnected.map(v => v.total),
                        backgroundColor: value.totalConnected.map(v => LaafiMonitorDeviceStatusChart.colors[v.id])
                    }
                ]
            };

            this.setState({ data });
        });
    }

    render() {
        return (
            <div className='h-full'>
                <Chart ref={this.chartRef} type='doughnut' data={this.state.data} options={{
                    // responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'right',
                            maxWidth: 180,
                            labels: {
                                boxWidth: 10
                            }
                        }, datalabels: {
                            display: false
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
              borderRadius: 1000,
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
                        },
                        datalabels: {
                            display: false
                        }
                    }
                }} />
            </div>
        );
    }
}

class TemperatureChart2 extends React.Component {

    private chartRef = React.createRef<ChartJS>()

    private data = {
        datasets: [
            {
              cutout: 40, 
              circumference: 280,
              rotation: -140,
              borderWidth: [0, 0],
              data: [3.5, 3],
              borderRadius: 1000,
              backgroundColor: ['#24C5D9', '#d0f2f6'],
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
                            display: false,
                        },
                        datalabels: {
                            display: false
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
                    maintainAspectRatio: false,
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
                        },
                        datalabels: {
                            display: false
                        }
                    },
                }} />
            </div>
        );
    }
}

type ActivitesConnectionStatusChartProps = {
    promise: Promise<IGetActivitiesResult>|null;
};

type ActivitesConnectionStatusChartState = {
    data: {
        labels: string[],
        datasets: {
            data: number[],
            backgroundColor: string[]
        }[]
    }
};

class ActivitesConnectionStatusChart extends React.Component<ActivitesConnectionStatusChartProps, ActivitesConnectionStatusChartState> {

    private chartRef = React.createRef<ChartJS>()
    private static colors = { 'Actived': '#69ADA7', 'Stopped': '#D80303' /*#F2994A*/, 'Expired': '#999999' };

    constructor(props: ActivitesConnectionStatusChartProps) {
        super(props);

        this.state = {
            data: {
                labels: ['Expired'],
                datasets: [
                    {
                      data: [1],
                      backgroundColor: ['#A2A2A2'],
                    }
                ]
            }
        };
    }

    componentDidMount(): void {
        this.update(this.props.promise);
    }

    

    componentDidUpdate(prevProps: Readonly<ActivitesConnectionStatusChartProps>, prevState: Readonly<ActivitesConnectionStatusChartState>, snapshot?: any): void {
        if (prevProps.promise != this.props.promise) {
            this.update(this.props.promise);
        }
    }

    update(promise: Promise<IGetActivitiesResult>|null) {
        if (promise == null)
            return;            
        promise.then(value => {
            const data = {
                labels: value.totalStatus.map(v => v.id),
                datasets: [
                    {
                        data: value.totalStatus.map(v => v.total),
                        backgroundColor: value.totalStatus.map(v => ActivitesConnectionStatusChart.colors[v.id])
                    }
                ]
            };

            this.setState({ data });
        });
    }

    render() {
        return (
            <div className='h-full'>
                <Chart ref={this.chartRef} type='pie' data={this.state.data} options={{
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

class TemperatureCurveChart extends React.Component {

    constructor(props: any) {
        super(props);

        this.state = {
            data: {
                labels: [],
                datasets: []
            }
        };
    }

    componentDidMount(): void {
        const ctx = document.getElementById('canvas').getContext("2d");
        const gradient = ctx.createLinearGradient(0, 0, 0, 220);
        gradient.addColorStop(0, '#ff6384');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        // const {height: graphHeight} = myChartRef.canvas;
        // let gradientLine = myChartRef
        //     .createLinearGradient(0, 0, 0, graphHeight);
        // gradientLine.addColorStop(0, "rgb(255, 0, 110, 0.2)");
        // gradientLine.addColorStop(0.5, "rgb(255, 0, 110, 0.35)");
        // gradientLine.addColorStop(1, "rgb(255, 0, 110, 0.7)");

        const data = {
            labels: ['15h26m45s', '15h27m45s', '15h28m13s', '15h29m45s', '15h30m45s', '15h31m45s', '15h32m45s', '15h33m45s', '15h34m45s'],
            datasets: [
                {
                    data: [39, 39, 39, 39, 39, 39, 39, 39, 39],
                    borderColor: '#ff6384',
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0,
                },
                {
                    data: [34, 34, 34, 34, 34, 34, 34, 34, 34],
                    borderColor: '#ff6384',
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0,
                },
                {
                    data: [37, 38, 38, 41, 42, 42, 39, 40, 38],
                    borderColor: '#ff6384',
                    backgroundColor: gradient,
                    fill: 'origin',
                    pointRadius: 0,
                    cubicInterpolationMode: 'monotone',
                    tension: 0.4
                },
            ]
        };

        this.setState({ data });
    }

    render() {
        return (
            <div className='h-full'>
                <Line id={'canvas'} data={this.state.data} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            ticks: {
                                // display: false
                                font: {
                                    size: 12
                                }
                            },
                            grid: {
                                display: false,
                                drawBorder: false,
                            },
                            
                            // gridLines: { display: false }
                        },
                        y: {
                            grid: {
                                // display: false,
                                drawBorder: false,
                                // drawOnChartArea: false
                            },
                            // ticks: {
                                // beginAtZero:true
                                // display: false
                                // maxTicksLimit: 6
                            // },
                            suggestedMin: 30,
                            suggestedMax: 45
                        }
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                        datalabels: {
                            display: false
                        }
                    }
                }} />
            </div>
        );
    }
}

class GroupedBarChart extends React.Component {

    private chartRef = React.createRef<ChartJS>()

    private data = {
        labels: ["0", "1", "2", "3"],
        datasets: [
            {
                backgroundColor: '#69ADA7',
                data: [640, 670, 40, 190]
            }, {
                backgroundColor: '#3C4858',
                data: [400, 60, 280, 0]
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
                    responsive: true,
                    scales: {
                        x: {
                            grid: {
                                display: false
                            },
                            // ticks: {
                            //     display: false
                            // }
                        },
                        y: {
                            // ticks: {
                            //     display: false
                            // }
                            suggestedMax: 800
                        }
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                        datalabels: {
                            display: false
                        }
                    },
                }} />
            </div>
        );
    }
}

class GroupedBarChart2 extends React.Component {

    private chartRef = React.createRef<ChartJS>()

    private data = {
        labels: ["0", "1", "2", "3"],
        datasets: [
            {
                backgroundColor: '#00A6F9',
                data: [640, 670, 40, 190]
            }, {
                backgroundColor: '#192F5D',
                data: [400, 60, 280, 620]
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
                    responsive: true,
                    scales: {
                        x: {
                            grid: {
                                display: false
                            },
                            // ticks: {
                            //     display: false
                            // }
                        },
                        y: {
                            // ticks: {
                            //     display: false
                            // }
                            suggestedMax: 800
                        }
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                        datalabels: {
                            display: false
                        }
                    },
                }} />
            </div>
        );
    }
}

export {
    LaafiMonitorDeviceUsageChart,
    LaafiMonitorDeviceStatusChart,
    DeviceUsageChart3,
    TemperatureChart,
    TemperatureChart2,
    TemperatureLineChart,
    ActivitesConnectionStatusChart,
    TemperatureCurveChart,
    GroupedBarChart,
    GroupedBarChart2
};