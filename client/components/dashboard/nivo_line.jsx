import React, { Component } from "react";
import protoGraphTheme from './theme.jsx'
import { Widget } from "./widget.jsx"

// Nivo calendar http://nivo.rocks/calendar

import { ResponsiveLine } from '@nivo/line'
//import "./index.scss"

export class NivoLine extends React.Component {
  state = {}

  componentDidMount() {
    if (this.props.state) {
      if (this.props.state.key) {

        this.fetchData(this.props.state.key, this.props.datapath)
      }
    }
  }

  fetchData(key, datapath) {
    fetch("/api/v3/packets", {
      method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ key, datapath })
    }).then(response => response.json()).then(result => {
      //console.log(result);

      var linedata = [{
        id: datapath,
        color: "rgb(0, 255, 255)",
        data: result
      }]

      this.setState({ linedata })
    }).catch(err => console.error(err.toString()));
  }


  renderLine() {



    return (
      <ResponsiveLine
        data={this.state.linedata}
        margin={{
          "top": 35,
          "right": 35,
          "bottom": 55,
          "left": 55
        }}
        xScale={{
          "type": "point"
        }}
        yScale={{
          "type": "linear",
          "stacked": true,
          "min": "auto",
          "max": "auto"
        }}
        minY="auto"
        maxY="auto"

        stacked={true}
        curve="natural"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          "orient": "bottom",
          "tickSize": 5,
          "tickPadding": 5,
          "tickRotation": 0,
          "legend": "transportation",
          "legendOffset": 36,
          "legendPosition": "middle"
        }}
        axisLeft={{
          "orient": "left",
          "tickSize": 5,
          "tickPadding": 5,
          "tickRotation": 0,
          "legend": "count",
          "legendOffset": -40,
          "legendPosition": "middle"
        }}
        dotSize={10}
        dotColor="inherit:darker(0.3)"
        colorBy={function (e) { return e.color }}
        dotBorderWidth={2}
        dotBorderColor="rgba(0,0,0,0)"
        enableDotLabel={true}
        dotLabel="y"
        dotLabelYOffset={-12}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        theme={protoGraphTheme}
      />

    )
  }

  render() {

    if (this.state.linedata) {
      return (<Widget label={this.props.data.dataname} options={this.options} dash={this.props.dash} >{this.renderLine()}</Widget>)
    } else {
      return (<Widget label={this.props.data.dataname} options={this.options} dash={this.props.dash} >Need data source.</Widget>)
    }

  }
}