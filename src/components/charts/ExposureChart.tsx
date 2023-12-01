import React from "react";
import Chart from "react-google-charts";
import { Utils } from "../../services/utils";

type Props = {
    values: { id: string, value: number; date: string }[];
}

type State = {
    values: { id: string, value: number; date: string }[];
}

class ExposureChart extends React.Component<Props, State> {

    dataSource = [
        // { x: 0, y: 10 },
        // { x: 4, y: 0 },
        // { x: 8, y: 10 },
        // { x: 12, y: 0 },
        // { x: 16, y: 10 }
    ]

    constructor(props: Props) {
        super(props);

        this.state = {
            values: props.values
        };
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if (this.props.values !=  prevProps.values) {
            this.setState({ values: this.props.values });
        }
    }

    render() {
        const values = this.state.values;

        return (
            <Chart
                chartType="SteppedAreaChart"
                width="100%"
                height="400px"
                options={{ title: 'Exposure' }}
                data={[
                    ['Exposure', ''],
                    ['', 0]
                ]}
            />
        );
    }

}

export { ExposureChart };