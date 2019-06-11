// import React, { Component } from "react";
import React, { Component } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Widget } from "./widget.jsx"

import { AmchartsReact } from 'amchart4-react'

am4core.useTheme(am4themes_animated);

export class ChartLine extends React.Component {
  state = {
    chart: null,
    dateAxis: null
  }

  constructor(props) {
    super(props)

    console.log(props)
  }

  componentDidMount() {
    this.createData();
  }

  createLine = (chart) => {
    const middleLine = chart.plotContainer.createChild(am4charts.AxisLine);
    middleLine.strokeOpacity = 1;
    middleLine.stroke = am4core.color("#000000");
    middleLine.strokeDasharray = "";
    middleLine.zIndex = 1;
    return middleLine;
  }

  // componentDidMount() {
  //   if (this.props.state) {
  //     if (this.props.state.key) {
  //       this.createData(this.props.state.key, this.props.datapath)
  //       const chart = am4core.create("chartLine", am4charts.XYChart);
  //       console.log(chart);
  //       this.createChart(chart);

  //       this.setState(() => ({ chart }))
  //     }
  //   }
  // }
  // createData(key, datapath) {
  //   fetch("/api/v3/packets", {
  //     method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
  //     body: JSON.stringify({ key, datapath })
  //   }).then(response => response.json()).then(result => {
  //     //console.log(result);

  //     var linedata = [{
  //       id: datapath,
  //       color: "rgb(0, 255, 255)",
  //       data: result
  //     }]

  //     this.setState({ linedata })
  //   }).catch(err => console.error(err.toString()));
  // }

  componentWillUnmount() {
    if (this.state.chart) {
      this.state.chart.dispose();
    }
  }

  createData = () => {
    const data1 = [];
    let price1 = 1000;
    for (let i = 0; i < 10; i++) {
      price1 += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 100);
      data1.push({ date1: new Date(2015, 0, i), price1 });
    }
    console.log(data1)
    var data = [];
    fetch("/api/v3/packets", {
      method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(
        {
          key: this.props.state.key,
          datapath: this.props.datapath
        }
      )
    }).then(response => response.json()).then(result => {
      var test = []
      for (var date in result) {
        var f = {
          date1: new Date(parseInt(result[date].x), 0, date),
          price1: result[date].y
        }
        test.push(f)
      }
      console.log(test)
      data = result;
      this.createChart(test)
    }).catch(err => console.error(err.toString()));
  }

  createChart = (result) => {
    const chart = am4core.create("chartLine", am4charts.XYChart);
    chart.data = result;

    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.labels.template.fill = am4core.color("#e59165");

    this.setState(() => ({ dateAxis }))

    const dateAxis2 = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis2.renderer.grid.template.location = 0;
    dateAxis2.renderer.labels.template.fill = am4core.color("#dfcc64");

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
    // axisRange.value = 1200;
    axisRange.grid.stroke = am4core.color("#A96478");
    axisRange.grid.strokeWidth = 2;
    axisRange.grid.strokeOpacity = 1;
    // axisRange.label.text = "middle";
    axisRange.label.fill = axisRange.grid.stroke;
    axisRange.label.verticalCenter = "bottom";

    const series = chart.series.push(new am4charts.LineSeries());
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
    //series.strokeWidth = 3;
    // series.columns.template.events.on("hit", function (ev) {
    //   console.log("clicked on ", ev.target);
    // }, this);

    const series2 = chart.series.push(new am4charts.LineSeries());
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

    // const line = this.createLine(chart);
    // console.log(line);

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.stroke = am4core.color("#000000");
    chart.cursor.lineX.strokeWidth = 2;
    chart.cursor.lineX.strokeDasharray = "";
    chart.cursor.lineY.strokeOpacity = 0;

    // chart.cursor.behavior = "selectX";

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
    this.setState(() => ({ chart }))

  }

  render() {
    return (
      <div>
        <div id="chartLine" />
        {this.state.chart ?
          <Widget label={this.props.data.dataname} dash={this.props.dash}>
            <AmchartsReact
              chart={this.state.chart}
              xAxis={this.state.dateAxis}
              color={am4core.color("#838383")}
            />
          </Widget>
          : <Widget label={this.props.data.dataname} dash={this.props.dash}></Widget>}
      //: null}
      </div>
    );
  }
}