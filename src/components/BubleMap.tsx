import React from "react";
import {
  Chart as ChartJS,
  PointElement
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import * as ChartGeo from 'chartjs-chart-geo';
import { Paper } from "@mui/material";

ChartJS.register(
  PointElement,
  ChartGeo.BubbleMapController,
  ChartGeo.ProjectionScale,
  ChartGeo.SizeScale,
  ChartGeo.GeoFeature
);

class BubleMap extends React.Component {
  chartRef: any;
  data: any;

  static options = {
    plugins: {
      legend: {
        display: false
      },
      datalabels: {
        align: 'top',
        formatter: (v: any) => {
          return v.description;
        }
      }
    },
    scales: {
      projection: {
        axis: 'x',
        projection: 'albersUsa', 
      },
      size: {
        axis: 'x',
        size: [1, 20],
      },
    }
  };

  constructor(props: any) {
    super(props);
    this.chartRef = React.createRef<ChartJS>();
  }

  componentDidMount() {
      Promise.all([
          fetch('https://unpkg.com/world-atlas/countries-110m.json')
          .then((r) => r.json()),
        ]).then(([data]) => {

          // console.log(us);
          

          const green = [
            {
              name: 'Alabama',
              latitude: -22.9027800,
              longitude: -22.9027800
            }
          ];

          const red = [
            {
              name: 'Alabama',
              latitude: 12.35,
              longitude: 12.35
            }
          ];

          const countries = (ChartGeo.topojson.feature(data, data.objects.countries) as any).features;

          // [{
          //   label: 'Countries',
          //   data: countries.map((d) => ({feature: d, value: Math.random()})),
          // }]

          this.data = {
            labels: countries.map((d: any) => d.properties.name),
            
            datasets: [{
              // label: 'Countries',
              outline: countries,
              // showOutline: true,
              backgroundColor: '#F44336',
              data: green.map((d) => Object.assign(d, {value: 0.1})),
            }, {
              // label: 'Countries',
              outline: countries,
              // showOutline: true,
              backgroundColor: '#4CAF50',
              data: red.map((d) => Object.assign(d, {value: 0.1})),
            }]
          }

          this.setState({})
        });

  }

  render() {
    if (!this.data)
      return <p>Chargement...</p>

    return (
      <Paper sx={{ height: '100%' }}>
        <Chart ref={this.chartRef} type='bubbleMap' data={this.data} options={{
          showOutline: true,
          // showGraticule: true,
          // clipMap: 'outline+graticule',
          // outline: [{
          //   outlineBackgroundColor: 'steelblue',
          //   outlineBorderColor: 'steelblue',
          // }],
          plugins: {
            legend: {
              display: false
            },
          },
          scales: {
            projection: {
              axis: 'x',
              projection: 'equalEarth'
            },
          }
        }} />
      </Paper>
    );
  }

}

export { BubleMap };