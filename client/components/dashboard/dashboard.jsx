import React, { Component } from "react";

import GridLayout from 'react-grid-layout';

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css"
import "./index.scss"



import { Calendar } from "./nivo_calendar.jsx"
import { Line } from "./nivo_line.jsx"

import * as _ from "lodash"

// https://github.com/STRML/react-grid-layout

import { Widget } from "./widget.jsx"

import { ThreeDWidget } from "./three.jsx"

export class Dashboard extends React.Component {

  state = {
    grid: {
      width: 4000,
      cols: 40,
      rowHeight: 30
    },
    layout: [
      { i: "0", x: 0, y: 0, w: 8, h: 4, type: "Calendar", dataname: "calendar" },
      { i: '1', x: 0, y: 4, w: 8, h: 6, type: "Line" , dataname : "line" },
      { i: 'asdf', x: 8, y: 4, w: 4, h: 4, type: "ThreeDWidget" , dataname : "3dplaceholder" }
    ],
  }

  onDragOver = (e) => {
    let event = e
    event.stopPropagation();
    event.preventDefault();
    //console.log("dragOver")
  }

  onDrop = (e, f) => {
    //console.log({e,f});
    var location = {
      x: Math.round(e.clientX/ (this.state.grid.width/this.state.grid.cols)),
      y: Math.round(e.clientY/this.state.grid.rowHeight/2) - 1
    }

    console.log("drop")
    console.log(e.datapath)
    console.log(location)

    var layout = _.clone(this.state.layout)
    layout.push({ i: this.generateDifficult(32), x: location.x, y: location.y, w: 2, h: 3, type: "Blank", datapath: e.datapath, dataname: e.dataname })


    this.setState({ layout: layout })
  }

  generateDashboard = () => {
    return (
      <GridLayout className="layout" layout={this.state.layout} cols={this.state.grid.cols} rowHeight={this.state.grid.rowHeight} width={this.state.grid.width} compactType={null} >
        {
          this.state.layout.map((data, i) => {
            if (data.type == "Calendar") {
              return (
                <div className="dashboardBlock" key={data.i} >
                  <Calendar deviceid={this.props.deviceid} />
                </div>
              )
            }

            if (data.type == "Line") {
              return (
                <div className="dashboardBlock" key={data.i} >
                  <Line />
                </div>
              )
            }

            if (data.type == "Blank") {
              return (
                <div className="dashboardBlock" key={data.i} >
                  <Widget label={data.dataname} >
                    { this.objectByString(this.props.view, data.datapath.slice(5) ).toString() }
                  </Widget>
                </div>
              )
            }

            if (data.type == "ThreeDWidget") {
              return (
                <div className="dashboardBlock" key={data.i} >
                  <Widget label={data.dataname} >
                    <ThreeDWidget />
                  </Widget>
                </div>                
              )
            }

          })
        }
      </GridLayout>
    )
  }

  render() {
    
    // layout is an array of objects, see the demo for more complete usage
    // var layout = [
    //   {i: 'c', x: 0, y: 0, w: 8, h: 4},
    //   {i: 'd', x: 0, y: 4, w: 8, h: 8}
    // ];
    return (
      <div onDragOver={(e) => this.onDragOver(e)} onDrop={(e) => this.onDrop(e, "complete")} >
        {this.generateDashboard()}
      </div>
    )
  }

  generateDifficult(count) {
    var _sym = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
    var str = '';
    for (var i = 0; i < count; i++) {
      var tmp = _sym[Math.round(Math.random() * (_sym.length - 1))];
      str += "" + tmp;
    }
    return str;
  }

  objectByString = (o,s) =>{
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
  }
}

