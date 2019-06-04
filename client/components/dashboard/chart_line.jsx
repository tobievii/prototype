import React, { Component } from "react";
import { Line } from 'react-chartjs-2';
import { Widget } from "./widget.jsx"
import { months } from "moment";

var dateFormat = require('dateformat');
var now = new Date();
//var day = ["Monday", "Tuesday", "Wednesday", "Thurday", "Friday", "Saturday", "Sunday"]

export class ChartLine extends React.Component {
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
      console.log(result);

      var linedata = [{
        id: datapath,
        color: "rgb(0, 255, 255)",
        data: result
      }]

      this.setState({ linedata })
    }).catch(err => console.error(err.toString()));
  }


  renderLine() {

    var labels = [];
    var data = [];

    for (var d of this.state.linedata[0].data) {

      //dateFormat(d.x, "dddd, mmmm dS, yyyy, h:MM:ss TT")
      //console.log(d.x)
      //console.log(dateFormat(d.x, "dddd, mmmm dS, yyyy, h:MM:ss TT"))
      var day = ["Monday", "Tuesday", "Wednesday", "Thurday", "Friday", "Saturday", "Sunday"]
      var month = ["January", "", "", "", "", "", "", "", "", "", "", ""]
      if (day) {
        labels.push(dateFormat(d.x, "dddd"))
        data.push(d.y)
      } else if (month)
        labels.push(dateFormat(d.x, "mmmm"))
      data.push(d.y)

    }

    var graph = {
      labels: labels,
      datasets: [
        {
          label: 'My First dataset',
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: data
        }
      ]
    };

    return (
      <Line data={graph} />
    )
  }

  render() {
    if (this.state.linedata) {
      return (<Widget label={this.props.data.dataname} options={this.options} dash={this.props.dash}>{this.renderLine()}</Widget>)
    } else {
      return (<Widget label={this.props.data.dataname} options={this.options} dash={this.props.dash}></Widget>)
    }
  }
}