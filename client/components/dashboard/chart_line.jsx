// import React, { Component } from "react";
// import { Line } from 'react-chartjs-2';
// import { Widget } from "./widget.jsx"
import React, { Component } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import { AmchartsReact } from 'amchart4-react'

am4core.useTheme(am4themes_animated);

// var chartData = generateChartData();
// var chart = AmCharts.makeChart("chartdiv", {
//   "type": "serial",
//   "theme": "light",
//   "marginRight": 80,
//   "autoMarginOffset": 20,
//   "marginTop": 7,
//   "dataProvider": chartData,
//   "valueAxes": [{
//     "axisAlpha": 0.2,
//     "dashLength": 1,
//     "position": "left"
//   }],
//   "mouseWheelZoomEnabled": true,
//   "graphs": [{
//     "id": "g1",
//     "balloonText": "[[value]]",
//     "bullet": "round",
//     "bulletBorderAlpha": 1,
//     "bulletColor": "#FFFFFF",
//     "hideBulletsCount": 50,
//     "title": "red line",
//     "valueField": "visits",
//     "useLineColorForBulletBorder": true,
//     "balloon": {
//       "drop": true
//     }
//   }],
//   "chartScrollbar": {
//     "autoGridCount": false,
//     "graph": "g1",
//     "scrollbarHeight": 40
//   },
//   "chartCursor": {
//     "limitToGraph": "g1"
//   },
//   "categoryField": "date",
//   "categoryAxis": {
//     "parseDates": true,
//     "axisColor": "#DADADA",
//     "dashLength": 1,
//     "minorGridEnabled": true
//   },
//   "export": {
//     "enabled": true
//   }
// });

// chart.addListener("rendered", zoomChart);
// zoomChart();

// // this method is called when chart is first inited as we listen for "rendered" event
// function zoomChart() {
//   // different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
//   chart.zoomToIndexes(chartData.length - 40, chartData.length - 1);
// }

// // generate some random data, quite different range
// function generateChartData() {
//   var chartData = [];
//   var firstDate = new Date();
//   firstDate.setDate(firstDate.getDate() - 5);

//   for (var i = 0; i < 1000; i++) {
//     // we create date objects here. In your data, you can have date strings
//     // and then set format of your dates using chart.dataDateFormat property,
//     // however when possible, use date objects, as this will speed up chart rendering.
//     var newDate = new Date(firstDate);
//     newDate.setDate(newDate.getDate() + i);

//     var visits = Math.round(Math.random() * (40 + i / 5)) + 20 + i;

//     chartData.push({
//       date: newDate,
//       visits: visits
//     });
//   }
//   return chartData;
// }

export class ChartLine extends React.Component {
  state = {
    chart: null,
    dateAxis: null
  }

  componentDidMount() {
    // if (this.props.state) {
    //   if (this.props.state.key) {
    //     this.fetchData(this.props.state.key, this.props.datapath)
    //   }
    // }
    const chart = am4core.create("lineChart", am4charts.XYChart);

    this.createChart(chart);

    this.setState(() => ({ chart }))
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  createChart = (chart) => {

    chart.data = this.props.data;

    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.labels.template.fill = am4core.color("#ffffff");

    this.setState(() => ({ dateAxis }))

    const dateAxis2 = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis2.renderer.grid.template.location = 0;
    dateAxis2.renderer.labels.template.fill = am4core.color("#ffffff");

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.labels.template.fill = am4core.color("#e59165");
    valueAxis.renderer.minWidth = 60;

    const valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis2.tooltip.disabled = true;
    valueAxis2.renderer.grid.template.strokeDasharray = "2,3";
    valueAxis2.renderer.labels.template.fill = am4core.color("#dfcc64");
    valueAxis2.renderer.minWidth = 60;

    const axisRange = dateAxis.axisRanges.create();
    axisRange.date = new Date(2015, 0, 5);
    axisRange.grid.stroke = am4core.color("#A96478");
    axisRange.grid.strokeWidth = 2;
    axisRange.grid.strokeOpacity = 1;
    axisRange.label.fill = axisRange.grid.stroke;
    axisRange.label.verticalCenter = "bottom";
    console.log('axis', axisRange);

    const series = chart.series.push(new am4charts.LineSeries());
    series.name = "2016";
    series.dataFields.dateX = "date1";
    series.dataFields.valueY = "price1";
    series.tooltipText = "[bold]{valueY}[/]";
    series.fill = am4core.color("#e59165");
    series.stroke = am4core.color("#e59165");

    let axisTooltip = dateAxis.tooltip;
    axisTooltip.background.fill = am4core.color("#e59165");
    axisTooltip.background.strokeWidth = 0;
    axisTooltip.background.cornerRadius = 3;
    axisTooltip.background.pointerLength = 0;
    axisTooltip.dy = 5;

    const series2 = chart.series.push(new am4charts.LineSeries());
    series2.name = "2017";
    series2.dataFields.dateX = "date2";
    series2.dataFields.valueY = "price2";
    series2.yAxis = valueAxis2;
    series2.xAxis = dateAxis2;
    series2.tooltipText = "[bold]{valueY}[/]";
    series2.fill = am4core.color("#dfcc64");
    series2.stroke = am4core.color("#dfcc64");

    let axisTooltip2 = dateAxis2.tooltip;
    axisTooltip2.background.fill = am4core.color("#dfcc64");
    axisTooltip2.background.strokeWidth = 0;
    axisTooltip2.background.cornerRadius = 3;
    axisTooltip2.background.pointerLength = 0;
    axisTooltip2.dy = 5;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.stroke = am4core.color("#000000");
    chart.cursor.lineX.strokeWidth = 2;
    chart.cursor.lineX.strokeDasharray = "";
    chart.cursor.lineY.strokeOpacity = 0;

    const scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    scrollbarX.series.push(series2);
    chart.scrollbarX = scrollbarX;

    chart.legend = new am4charts.Legend();
    chart.legend.parent = chart.plotContainer;
    chart.legend.zIndex = 100;

    chart.exporting.menu = new am4core.ExportMenu();

    valueAxis2.renderer.grid.template.strokeOpacity = 0.07;
    dateAxis2.renderer.grid.template.strokeOpacity = 0.07;
    dateAxis.renderer.grid.template.strokeOpacity = 0.07;
    valueAxis.renderer.grid.template.strokeOpacity = 0.07;
  }

  render() {
    return (
      <div>
        <div id="lineChart" style={{ width: "100%", height: "500px" }} />
        {this.state.chart ?
          <AmchartsReact
            chart={this.state.chart}
            xAxis={this.state.dateAxis}
            color={am4core.color("#838383")}
          />
          : null}
      </div>
    );
  }
}

//   fetchData(key, datapath) {
//     fetch("/api/v3/packets", {
//       method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
//       body: JSON.stringify({ key, datapath })
//     }).then(response => response.json()).then(result => {
//       //console.log(result);

//       var linedata = [{
//         id: datapath,
//         color: "rgb(0, 255, 255)",
//         data: result
//       }]

//       this.setState({ linedata })
//     }).catch(err => console.error(err.toString()));
//   }


//   renderLine() {

//     var labels = [];
//     var data = [];

//     for (var d of this.state.linedata[0].data) {
//       labels.push(d.x)
//       data.push(d.y)
//     }

//     var graph = {
//       labels: labels,
//       datasets: [
//         {
//           label: 'My First dataset',
//           fill: false,
//           lineTension: 0.1,
//           backgroundColor: 'rgba(75,192,192,0.4)',
//           borderColor: 'rgba(75,192,192,1)',
//           borderCapStyle: 'butt',
//           borderDash: [],
//           borderDashOffset: 0.0,
//           borderJoinStyle: 'miter',
//           pointBorderColor: 'rgba(75,192,192,1)',
//           pointBackgroundColor: '#fff',
//           pointBorderWidth: 1,
//           pointHoverRadius: 5,
//           pointHoverBackgroundColor: 'rgba(75,192,192,1)',
//           pointHoverBorderColor: 'rgba(220,220,220,1)',
//           pointHoverBorderWidth: 2,
//           pointRadius: 1,
//           pointHitRadius: 10,
//           data: data
//         }
//       ]
//     };

//     return (
//       <Line data={graph} />
//     )
//   }

//   render() {
//     // if (this.state.linedata) {
//     //   return (<Widget label={this.props.data.dataname} options={this.options} dash={this.props.dash}>

//     //     {this.renderLine()}
//     //   </Widget>)
//     // } else {
//     return (<Widget label={this.props.data.dataname} options={this.options} dash={this.props.dash}>


//     </Widget>)
//   }
// }
//}