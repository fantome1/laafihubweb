import React from "react";
import Chart from "react-google-charts";
import { Utils } from "../../services/utils";

type Props = {
    values: { id: string, value: number; date: string }[];
}

type State = {
    values: { id: string, value: number; date: string }[];
}

class TemperatureLineChart extends React.Component<Props, State> {

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
        const data = [
            ['Temperature', ''],
            ...(values.length == 0
                ? [['', 0]]
                : values.map(v => [Utils.formatTime(new Date(v.date)), v.value ]))
        ];

        return (
            <Chart
                chartType='Line'
                width='100%'
                height='400px'
                options={{ title: "Température",  }}
                data={data}
            />
        );
    }

}

export { TemperatureLineChart };