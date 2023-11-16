import React from "react";
import { AnnotationDirective, AnnotationsDirective, Category, ChartAnnotation, ChartComponent, ChartTheme, Highlight, IAnimationCompleteEventArgs, ILoadedEventArgs, Inject, Legend, SeriesCollectionDirective, SeriesDirective, SplineSeries, Tooltip } from "@syncfusion/ej2-react-charts";
import { Utils } from "../../services/utils";

type Props = {
    values: { id: string, value: number; date: string }[];
}

type State = {
    values: { id: string, value: number; date: string }[];
}

const SAMPLE_CSS = `
.control-fluid {
    padding: 0px !important;
}
#charts_Series_0_Point_2_Symbol {
    -webkit-animation: opac 1s ease-out infinite;
    animation: opac 1s ease-out infinite;
}

#charts_Series_2_Point_0_Symbol {
    -webkit-animation: opac 1s ease-out infinite;
    animation: opac 1s ease-in-out infinite;
}

@keyframes opac {
    0% {
        stroke-opacity: 1;
        stroke-width: 0px;
    }
    100% {
        stroke-opacity: 0;
        stroke-width: 10px;
    }
}`;


class SplineTemperatureChart extends React.Component<Props, State> {

    private chartInstance?: ChartComponent|null;

    minTemp = [
        // { x: Number.NEGATIVE_INFINITY, y: 3 },
        // { x: Number.POSITIVE_INFINITY, y: 3 }
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

        console.log(data);

        return (
            <div className="control-pane">
                <style>{SAMPLE_CSS}</style>
                <div className="control-section">
                    <ChartComponent
                        id='device-temperature-chart'
                        style={{ textAlign: 'center' }}
                        ref={chart => this.chartInstance = chart}
                        primaryXAxis={{ valueType: 'Category', interval: 1, majorGridLines: { width: 0 } }}
                        primaryYAxis={{ labelFormat: '{value}°C', lineStyle: { width: 0 }, majorTickLines: { width: 0 }, minorTickLines: { width: 0 } }}
                        legendSettings={{ enableHighlight: true }}
                        chartArea={{ border: { width: 0 } }}
                        tooltip={{ enable: true }}
                        title="Temperature"
                        width="100%"
                        load={this.load.bind(this)}
                        loaded={this.onChartLoad.bind(this)}
                        animationComplete={this.animationComplete.bind(this)}
                    >
                        <Inject services={[SplineSeries, Legend, Category, Tooltip, ChartAnnotation, Highlight]} />
                        {/* <AnnotationsDirective>
                            <AnnotationDirective content='<div id="chart_cloud"><img src="src/chart/images/cloud.png" style={{width: "41px"; height: "41px"}} /></div>' x='Sun' y={2} coordinateUnits='Point' verticalAlignment='Top'>
                            </AnnotationDirective>
                            <AnnotationDirective content='<div id="chart_cloud"><img src="src/chart/images/sunny.png"   style={{width: "41px"; height: "41px"}}/></div>' x='Tue' y={33} coordinateUnits='Point' verticalAlignment='Top'>
                            </AnnotationDirective>
                        </AnnotationsDirective> */}
                        <SeriesCollectionDirective>
                            <SeriesDirective dataSource={this.minTemp} xName="x" yName="y" name="Min temperature" type="Spline" marker={{ visible: true, width: 10, height: 10 }} />
                            <SeriesDirective dataSource={this.minTemp} xName="x" yName="y" name="Tres. Min temperature" type="Spline" marker={{ visible: true, width: 10, height: 10 }} />
                            <SeriesDirective dataSource={data} xName="x" yName="y" name="Temperature" type="Spline" marker={{ visible: true, width: 10, height: 10 }} />
                            <SeriesDirective dataSource={this.minTemp} xName="x" yName="y" name="Tres. Max temperature" type="Spline" marker={{ visible: true, width: 10, height: 10 }} />
                            <SeriesDirective dataSource={this.minTemp} xName="x" yName="y" name="Max temperature" type="Spline" marker={{ visible: true, width: 10, height: 10 }} />
                        </SeriesCollectionDirective>
                    </ChartComponent>
                </div>
            </div>
        );
    }

    public onChartLoad(args: ILoadedEventArgs): void {
        let chart = document.getElementById('device-temperature-chart');
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



export { SplineTemperatureChart };