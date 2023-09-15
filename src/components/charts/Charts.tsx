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
import { IGetDeviceResult } from '../../models/device_model';
import { IGetActivitiesResult } from '../../models/activity_model';
import { MAX_TEMPERATURE, MIN_TEMPERATURE } from '../../constants/temperature';
import { Utils } from '../../services/utils';
import annotationPlugin from 'chartjs-plugin-annotation';

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
    Filler,
    annotationPlugin
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

type TemperaturePieChartProps = {
    temperature?: number|null;
    thresMaxTemp?: number|null;
    thresMinTemp?: number|null;
    maxTemp?: number|null;
    minTemp?: number|null;
}

type TemperaturePieChartState = {
    data: {
        datasets: {
            cutout: number, 
            circumference: number,
            rotation: number,
            borderWidth: number[],
            data: number[],
            borderRadius: number,
            backgroundColor: string[],
        }[]
    }
}

class TemperaturePieChart extends React.Component<TemperaturePieChartProps, TemperaturePieChartState> {

    private chartRef = React.createRef<ChartJS>()

    constructor(props: TemperaturePieChartProps) {
        super(props);

        this.state = {
            data: TemperaturePieChart.getData(0)
        }
    }

    componentDidUpdate(prevProps: Readonly<TemperaturePieChartProps>, prevState: Readonly<TemperaturePieChartState>, snapshot?: any): void {
        if (prevProps.temperature != this.props.temperature
            || prevProps.minTemp != this.props.minTemp
            || prevProps.maxTemp != this.props.maxTemp
            || prevProps.thresMinTemp != this.props.thresMinTemp
            || prevProps.thresMaxTemp != this.props.thresMaxTemp
        ) {
            this.setState({ data: TemperaturePieChart.getData(this.props) });
        }
    }

    static getData(props: TemperaturePieChartProps) {
        const percent = Utils.toPercent(MIN_TEMPERATURE, MAX_TEMPERATURE, props.temperature ?? MIN_TEMPERATURE);
        return {
            datasets: [
                {
                  cutout: 98, 
                  circumference: 280,
                  rotation: -140,
                  borderWidth: [0, 0],
                  data: [percent, 1 - percent],
                  borderRadius: 1000,
                  backgroundColor: [this.getFillColor(props), '#23C4D81F'],
                }
            ]
        };
    }

    static getFillColor(props: TemperaturePieChartProps) {
        const t = props.temperature;
        if ((props.thresMinTemp && t <= props.thresMinTemp) || (props.thresMaxTemp && t >= props.thresMaxTemp))
            return '#FFD600';
        if ((props.minTemp && t <= props.minTemp) || (props.maxTemp && t >= props.maxTemp))
            return '#F44336';
        return '#69ADA7';
    }

    render() {
        return (
            <div className='h-full'>
                <Chart ref={this.chartRef} type='doughnut' data={this.state.data} options={{
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

type CountPieChartProps = {
    count: number|null;
    total: number|null;
}

type CountPieChartState = {
    data: {
        datasets: {
            cutout: number, 
            circumference: number,
            rotation: number,
            borderWidth: number[],
            data: number[],
            borderRadius: number,
            backgroundColor: string[],
        }[]
    }
}


class CountPieChart extends React.Component<CountPieChartProps, CountPieChartState> {

    private chartRef = React.createRef<ChartJS>()

    // private data = {
    //     datasets: [
    //         {
    //           cutout: 40, 
    //           circumference: 280,
    //           rotation: -140,
    //           borderWidth: [0, 0],
    //           data: [3.5, 3],
    //           borderRadius: 1000,
    //           backgroundColor: ['#24C5D9', '#d0f2f6'],
    //         }
    //     ]
    // }

    constructor(props: CountPieChartProps) {
        super(props);

        this.state = {
            data: {
                datasets: [
                    {
                        cutout: 40, 
                        circumference: 280,
                        rotation: -140,
                        borderWidth: [0, 0],
                        data: [0, 1],
                        borderRadius: 1000,
                        backgroundColor: ['#24C5D9', '#d0f2f6'],
                    }
                ]
            }
        }
    }

    componentDidUpdate(prevProps: Readonly<CountPieChartProps>, prevState: Readonly<any>, snapshot?: any): void {
        if (prevProps.count != this.props.count
            || prevProps.total != this.props.total
        ) {
            this.setState({
                data: {
                    datasets: [
                        {
                            cutout: 40, 
                            circumference: 280,
                            rotation: -140,
                            borderWidth: [0, 0],
                            data: [this.props.count ?? 0, (this.props.total ?? 0) - (this.props.count ?? 0)],
                            borderRadius: 1000,
                            backgroundColor: ['#24C5D9', '#d0f2f6'],
                        }
                    ]
                }
            });
        }
    }

    render() {
        return (
            <div className='h-full'>
                <Chart ref={this.chartRef} type='doughnut' data={this.state.data} options={{
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

type TemperatureLineChartProps = {
    data: ({ id: string, value: number, date: string }|null)[];
    minTemp?: number;
    maxTemp?: number;
    minTempTres?: number;
    maxTempTres?: number;
}

type TemperatureLineChartState = {
    annotation: [],
    data: any;
}

class TemperatureLineChart extends React.Component<TemperatureLineChartProps, TemperatureLineChartState> {

    private chartRef = React.createRef<ChartJS>()

    constructor(props: TemperatureLineChartProps) {
        super(props);

        this.state = {
            annotation: [],
            data: {
                labels: [],
                datasets: [
                    {
                      fill: true,
                      // tension: 0.1,
                      borderWidth: 2,
                      borderColor: '#69ADA7',
                      pointRadius: 0,
                      //   backgroundColor: '#AA69ADA7',
                      data: []
                    }
                ]
            }
        }
    }

    componentDidMount(): void {
        this.update()
    }

    componentDidUpdate(prevProps: Readonly<TemperatureLineChartProps>, prevState: Readonly<TemperatureLineChartState>, snapshot?: any): void {
        console.log(this.props);
        
        if (prevProps.data != this.props.data) {
            this.update();
        }

        if (this.props.minTemp != undefined
            && this.props.maxTemp != undefined
            && this.props.minTempTres != undefined
            && this.props.maxTempTres != undefined
            && prevProps.minTemp != this.props.minTemp
            && prevProps.maxTemp != this.props.maxTemp
            && prevProps.minTempTres != this.props.minTempTres
            && prevProps.maxTempTres != this.props.maxTempTres
        ) {            
            this.setState({ annotation: [
                { type: 'line', yMin: this.props.minTempTres, yMax: this.props.minTempTres, borderColor: '#F9A825', borderWidth: 1 },
                { type: 'line', yMin: this.props.maxTempTres, yMax: this.props.maxTempTres, borderColor: '#F9A825', borderWidth: 1 },
                { type: 'line', yMin: this.props.minTemp, yMax: this.props.minTemp, borderColor: '#F44336', borderWidth: 1 },
                { type: 'line', yMin: this.props.maxTemp, yMax: this.props.maxTemp, borderColor: '#F44336', borderWidth: 1 }
            ] });
        }
    }

    update() {
        const colors = this.getColors();
        const ctx = document.getElementById('temperature-line-chart').getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 260);
        gradient.addColorStop(0, colors.start);
        gradient.addColorStop(1, colors.end);

        const values = [...this.props.data];
        // const values = [{ value: 10, date: 'a a' },{ value: -15, date: 'a a' }, { value: -8, date: 'a a' }, { value: 4, date: 'a a' }, { value: 15, date: 'a a' }, { value: 20, date: 'a a' }, { value: 30, date: 'a a' },];

        const r = 40 - values.length;
        for (let i=0; i<r; ++i) {
            values.push(null)
        }

        this.setState({ data: {
            labels: values.map(v => v == null ? null : v.date.split(' ')[1].substring(0, 5)),
            // labels: Array.from({ length: 100 }, _ => Math.trunc(Math.random() * 100)),
            datasets: [
                {
                  fill: true,
                  // tension: 0.1,
                  borderWidth: 1,
                  borderColor: colors.color,
                  pointRadius: 0,
                  // pointColor : "#fff",
                  // pointStrokeColor : "#ff6c23",
                  // pointHighlightFill: "#fff",
                  // pointHighlightStroke: "#ff6c23",
                  backgroundColor: gradient,
                  data: values.map(v => v?.value)
                //   data: Array.from({ length: 100 }, _ => Math.trunc(Math.random() * 100))
                }
            ]
        } })
    }

    getColors() {
        const value = this.props.data[this.props.data.length - 1];

        if (value <= this.props.minTemp || value >= this.props.maxTemp)
            return { color: '#F44336', start: 'rgba(244, 67, 54, 0.4)', end: 'rgba(244, 67, 54, 0)' };
        if (value <= this.props.minTempTres || value >= this.props.maxTempTres)
            return { color: '#F9A825', start: 'rgba(249, 168, 37, 0.4)', end: 'rgba(249, 168, 37, 0)' };
        return { color: '#54b054', start: 'rgba(84, 176, 84, 0.4)', end: 'rgba(84, 176, 84, 0)' };
    }

    render() {
        return (
            <div className='h-full'>
                <Chart ref={this.chartRef} type='line' data={this.state.data} id='temperature-line-chart' options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            ticks: {
                                // display: false,
                                // autoSkip: true,
                                stepSize: 1,
                                maxTicksLimit: 40,
                            },
                            grid: {
                                display: false,
                                // lineWidth: 10
                            }
                        },
                        y: {
                            beginAtZero: true,
                            // stacked: true,
                            // ticks: {
                            //     display: false
                            // },
                            grid: {
                                color: 'rgb(255, 255, 255, 0.08)'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                        datalabels: {
                            display: false
                        },
                        annotation: {
                            annotations: this.state.annotation
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


type TemperatureCurveChartProps = {
    suggestedMin: number;
    suggestedMax: number;
    data: { date: Date|null, value: number }[];
    min?: number|null;
    max?: number|null;
}

type TemperatureCurveChartState = {
    data: any;
}

class TemperatureCurveChart extends React.Component<TemperatureCurveChartProps, TemperatureCurveChartState> {

    constructor(props: TemperatureCurveChartProps) {
        super(props);

        this.state = {
            data: {
                labels: [],
                datasets: []
            }
        };
    }

    componentDidMount(): void {
        this.update();
    }

    componentDidUpdate(prevProps: Readonly<TemperatureCurveChartProps>, prevState: Readonly<TemperatureCurveChartState>, snapshot?: any): void {
        // FIXME ameliorer
        if (prevProps.data != this.props.data) {
            this.update();
        } else {
            console.log('indentique');
            
        }
    }

    update() {
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
        const values = [...this.props.data];
        const rCount = 20 - values.length;
        for (let i=0; i<rCount; ++i)
            values.push(null);

        console.log(values);

        const data = {
            labels: values.map(v => v == null ? '' : v.date == null ? 'current' : Utils.formatTime(v.date)),
            datasets: [
                // {
                //     data: values.map(_ => this.props.min),
                //     borderColor: '#ff6384',
                //     borderDash: [5, 5],
                //     fill: false,
                //     pointRadius: 0,
                // },
                // {
                //     data: values.map(_ => this.props.max),
                //     borderColor: '#ff6384',
                //     borderDash: [5, 5],
                //     fill: false,
                //     pointRadius: 0,
                // },
                {
                    data: values.map(v => v?.value),
                    borderColor: '#ff6384',
                    backgroundColor: gradient,
                    fill: 'origin',
                    pointRadius: 2,
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
                                },
                                stepSize: 1,
                                maxTicksLimit: 20
                            },
                            grid: {
                                display: false,
                                drawBorder: false,
                            }
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
                            suggestedMin: this.props.suggestedMin,
                            suggestedMax: this.props.suggestedMax
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
    TemperaturePieChart,
    CountPieChart,
    TemperatureLineChart,
    ActivitesConnectionStatusChart,
    TemperatureCurveChart,
    GroupedBarChart,
    GroupedBarChart2
};