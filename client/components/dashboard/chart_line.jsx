// import React, { Component } from "react";
import React, { Component } from 'react';
// import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Widget } from "./widget.jsx"

// import { AmchartsReact } from 'amchart4-react'

// am4core.useTheme(am4themes_animated);

var ts2 = 1484418600000;
var dates = [];
var dataSeries = "test";
var spikes = [5, -5, 3, -3, 8, -8]
for (var i = 0; i < 120; i++) {
  ts2 = ts2 + 86400000;
  var innerArr = [ts2, dataSeries[1][i].value];
  dates.push(innerArr)
  console.log(dataSeries, "this");
  console.log(innerArr, "lots of numbers");
  console.log(dates, "at least");

}
<div id="html">
  &lt;div id=&quot;chart&quot;&gt;&#10;            &lt;ReactApexChart options={this.state.options} series={this.state.series} type=&quot;area&quot; height=&quot;350&quot; /&gt;&#10;          &lt;/div&gt;
  </div>

export class ChartLine extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          stacked: false,
          zoom: {
            type: 'x',
            enabled: true
          },
          toolbar: {
            autoSelected: 'zoom'
          }
        },
        plotOptions: {
          line: {
            curve: 'smooth',
          }
        },
        dataLabels: {
          enabled: false
        },

        markers: {
          size: 0,
          style: 'full',
        },
        colors: ['#0165fc'],
        title: {
          text: 'Stock Price Movement',
          align: 'left'
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 90, 100]
          },
        },
        yaxis: {
          min: 20000000,
          max: 250000000,
          labels: {
            formatter: function (val) {
              return (val / 1000000).toFixed(0);
            },
          },
          title: {
            text: 'Price'
          },
        },
        xaxis: {
          type: 'datetime',
        },

        tooltip: {
          shared: false,
          y: {
            formatter: function (val) {
              return (val / 1000000).toFixed(0)
            }
          }
        }
      },
      series: [{
        name: 'XYZ MOTORS',
        data: dates
      }],
    }
  }

  render() {
    return (
      <div>
        {/* <Widget label={this.props.data.dataname} dash={this.props.dash}></Widget> */}
        <div id="chartLine" />
        <ReactApexChart options={this.state.options} series={this.state.series} type="area" height="350" />





        {/* {this.state.chart ?
          <AmchartsReact
            chart={this.state.chart}
            xAxis={this.state.dateAxis}
            color={am4core.color("#1b394d")}
          />
          // : <Widget label={this.props.data.dataname} dash={this.props.dash}></Widget>}
          : null} */}
        <div id="html-dist">
        </div>
      </div>

    );
  }
}
const domContainer = document.querySelector('#app');
ReactDOM.render(React.createElement(ChartLine), domContainer);