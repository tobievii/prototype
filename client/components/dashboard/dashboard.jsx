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
      //{ i: '1', x: 0, y: 4, w: 8, h: 6, type: "Line", dataname: "line" },
      //{ i: 'asdf', x: 8, y: 0, w: 4, h: 8, type: "ThreeDWidget" , dataname : "3dplaceholder" }
    ],
  }

  draggingUnique = "";

  onDragOver = (e, f) => {
    let event = e
    e.stopPropagation();
    e.preventDefault();
    //console.log("dragOver")

    var location = {
      x: Math.round(e.clientX / (this.state.grid.width / this.state.grid.cols)),
      y: Math.round(e.clientY / this.state.grid.rowHeight / 2) - 1
    }

    if (this.draggingUnique != "") {

      var needsUpdate = false;

      for (var widget of this.state.layout) {

        if (widget.i == this.draggingUnique) {
          if (widget.x != location.x) { needsUpdate = true; }
          if (widget.y != location.y) { needsUpdate = true; }
        }
      }


      if (needsUpdate) {
        console.log("needsUpdate")
        var layout = _.clone(this.state.layout)

        var layout = layout.filter(w => {
          if (w.i == this.draggingUnique) {
            w.x = location.x
            w.y = location.y
            return w;
          } else { return w }
        })

        // for (var widget of layout) {
        //   if (widget.i == this.draggingUnique) {

        //   }
        // }

        var temp = this.draggingUnique;
        this.draggingUnique = "";
        console.log(layout);
        this.setState({ layout }, () => {
          console.log("updated")
          this.draggingUnique = temp;
        })
      }


    } else {
      e.exists = true;

      // console.log("drop")
      // console.log(e.datapath)
      // console.log(location)

      var layout = _.clone(this.state.layout)
      var unique = this.generateDifficult(32)


      this.draggingUnique = unique;

      layout.push({ i: unique, x: location.x, y: location.y, w: 2, h: 3, type: "Blank", datapath: e.datapath, dataname: e.dataname })
      this.setState({ layout: layout })
    }


  }

  onDrop = (e, f) => {
    this.draggingUnique = "";

    // var location = {
    //   x: Math.round(e.clientX / (this.state.grid.width / this.state.grid.cols)),
    //   y: Math.round(e.clientY / this.state.grid.rowHeight / 2) - 1
    // }

    // console.log("drop")
    // console.log(e.datapath)
    // console.log(location)

    // var layout = _.clone(this.state.layout)
    // layout.push({ i: this.generateDifficult(32), x: location.x, y: location.y, w: 2, h: 3, type: "Blank", datapath: e.datapath, dataname: e.dataname })
    // this.setState({ layout: layout })
  }



  generateDashboard = () => {

    if (!this.props.state) {
      return (<div>loading..</div>)
    } else {
      return (
        <GridLayout isRearrangeable={false} useCSSTransforms={true} preventCollision={true} className="layout" layout={this.state.layout} cols={this.state.grid.cols} rowHeight={this.state.grid.rowHeight} width={this.state.grid.width} compactType={"vertical"} >
          {
            this.state.layout.map((data, i) => {
              if (data.type == "Calendar") {
                return (
                  <div className="dashboardBlock" key={data.i} >
                    <Widget label={data.dataname} >
                      <Calendar state={this.props.state} />
                    </Widget>

                  </div>
                )
              }

              if (data.type == "Line") {
                return (
                  <div className="dashboardBlock" key={data.i} >

                    <Widget label={data.dataname} >
                      <Line />
                    </Widget>
                  </div>
                )
              }

              if (data.type == "Blank") {
                return (
                  <div className="dashboardBlock" key={data.i} >
                    <Widget label={data.datapath} >
                      {this.objectByString(this.props.state.payload, data.datapath.slice(5)).toString()}
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


              return (
                <div>default</div>
              )

            })
          }
        </GridLayout>
      )
    }
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

  objectByString = (o, s) => {
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

