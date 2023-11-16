import React from "react";
import { Category, ChartAnnotation, ChartComponent, ChartTheme, Highlight, IAnimationCompleteEventArgs, ILoadedEventArgs, Inject, Legend, SeriesCollectionDirective, SeriesDirective, StepAreaSeries, Tooltip } from "@syncfusion/ej2-react-charts";
import { Utils } from "../../services/utils";

type Props = {
    values: { id: string, value: number; date: string }[];
}

type State = {
    values: { id: string, value: number; date: string }[];
}

class StepAreaExposureChart extends React.Component<Props, State> {

    private chartInstance?: ChartComponent|null;

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
        const data = values.map(v => ({ x: Utils.formatTime(new Date(v.date)), y: v.value }));        

        return (
            <div className="control-pane">
                {/* <style>{SAMPLE_CSS}</style> */}
                <div className="control-section">
                    <ChartComponent
                        id='device-exposure-chart'
                        style={{ textAlign: 'center' }}
                        ref={chart => this.chartInstance = chart}
                        primaryXAxis={{ valueType: 'Double', majorGridLines: { width: 0 }, edgeLabelPlacement: 'Shift' }}
                        primaryYAxis={{ labelFormat: '{value}%', valueType: 'Double', lineStyle: { width: 0 }, majorTickLines: { width: 0 }, minorTickLines: { width: 0 } }}
                        legendSettings={{ enableHighlight: true }}
                        chartArea={{ border: { width: 0 } }}
                        tooltip={{ enable: true }}
                        title="Exposure"
                        width="100%"
                        load={this.load.bind(this)}
                        loaded={this.onChartLoad.bind(this)}
                        animationComplete={this.animationComplete.bind(this)}
                    >
                        <Inject services={[StepAreaSeries, Legend, Category, Tooltip, ChartAnnotation, Highlight]} />
                        <SeriesCollectionDirective>
                            <SeriesDirective dataSource={this.dataSource} xName="x" yName="y" name="Exposure" type="StepArea" width={2} border={{ width: 2 }} />
                        </SeriesCollectionDirective>
                    </ChartComponent>
                </div>
            </div>
        );
    }

    public onChartLoad(args: ILoadedEventArgs): void {
        let chart = document.getElementById('device-exposure-chart');
        chart!.setAttribute('title', '');
    };

    public animationComplete(args: IAnimationCompleteEventArgs): void {
        this.chartInstance!.removeSvg();
        this.chartInstance!.animateSeries = false;
        this.chartInstance!['renderElements']();
    };

    public load(args: ILoadedEventArgs): void {
        let selectedTheme: string = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Material';
        args.chart.theme = (selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, "Dark").replace(/contrast/i,'Contrast') as ChartTheme;
    };

}

export { StepAreaExposureChart };