import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale
  } from 'chart.js';
import React from 'react';
import { Chart } from 'react-chartjs-2';
import { IGetActivitiesResult } from '../../models/activity_model';
import { months } from '../../constants/mouths';

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale
);


type Props = {
    promise: Promise<IGetActivitiesResult>|null;
};

type State = {
    data: {
        labels: string[],
        datasets: {
            data: number[],
            backgroundColor: string
        }[]
    }
}

class ActivityChart extends React.Component<Props, State> {

    private chartRef = React.createRef<ChartJS>()

    constructor(props: any) {
        super(props);

        this.state = {
            data: {
                labels: months,
                datasets: [
                    {
                      data: months.map(_ => 0),
                      backgroundColor: '#69ADA7',
                    }
                ]
            }
        }
    }

    componentDidMount(): void {
        this.update(this.props.promise);
    }

    componentDidUpdate(prevProps: Readonly<Props>): void {
        if (prevProps.promise != this.props.promise) {
            this.update(this.props.promise);
        }
    }

    update(promise: Promise<IGetActivitiesResult>|null) {
        if (promise == null)
            return;            
        promise.then(value => {

            const d = months.map(m => value.totalByMonth.find(d => d.id == m)?.total ?? 0);

            const data = {
                labels: months,
                datasets: [
                    {
                        data: d,
                        backgroundColor: '#69ADA7'
                    }
                ]
            };

            this.setState({ data });
        });
    }

    render() {
        return (
            <div className='h-full'>
                <Chart ref={this.chartRef} type='bar' data={this.state.data} options={{
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

class ActivityChart2 extends React.Component {

    private chartRef = React.createRef<ChartJS>()

    private data = {
        labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A'],
        datasets: [
            {
              data: [16, 20, 4, 15, 13, 10, 8, 14, 2],
              backgroundColor: '#49CDDD',
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
                    maintainAspectRatio: false,
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

export { ActivityChart, ActivityChart2 };