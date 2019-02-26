import React, { Component } from "react";

import GridLayout from 'react-grid-layout';

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css"


import { Calendar } from "./nivo_calendar.jsx"
import { Line } from "./nivo_line.jsx"

import * as _ from "lodash"

// https://github.com/STRML/react-grid-layout

import { Widget } from "./widget.jsx"

import { ThreeDWidget } from "./three.jsx"
import { ProtoGuage } from "./guage.jsx"
import { MapDevices } from "../map.jsx"

var mapDetails = {
  un: undefined,
  acc: undefined,
  dc: undefined,
  ds: undefined
}

export class Dashboard extends React.Component {

  settingLayout = false;

  state = {
    grid: {
      width: 4000,
      cols: 40,
      rowHeight: 30
    }
  }

  draggingUnique = "";



  saveDashboard = () => {


  }

  onDragOver = (e, f) => {
    // let event = e
    e.stopPropagation();
    e.preventDefault();


    // var location = {
    //   x: Math.round(e.clientX / (this.state.grid.width / this.state.grid.cols)),
    //   y: Math.round(e.clientY / this.state.grid.rowHeight / 2) - 1
    // }

    // if (this.draggingUnique != "") {

    //   var needsUpdate = false;

    //   for (var widget of this.state.layout) {

    //     if (widget.i == this.draggingUnique) {
    //       if (widget.x != location.x) { needsUpdate = true; }
    //       if (widget.y != location.y) { needsUpdate = true; }
    //     }
    //   }


    //   if (needsUpdate) {

    //     var layout = _.clone(this.state.layout)

    //     var layout = layout.filter(w => {
    //       if (w.i == this.draggingUnique) {
    //         w.x = location.x
    //         w.y = location.y
    //         return w;
    //       } else { return w }
    //     })

    //     // for (var widget of layout) {
    //     //   if (widget.i == this.draggingUnique) {

    //     //   }
    //     // }

    //     var temp = this.draggingUnique;
    //     this.draggingUnique = "";

    //     this.setState({ layout }, () => {

    //       this.draggingUnique = temp;
    //     })
    //   }


    // } else {
    //   e.exists = true;



    //   var layout = _.clone(this.state.layout)
    //   var unique = this.generateDifficult(32)


    //   this.draggingUnique = unique;

    //   layout.push({ i: unique, x: location.x, y: location.y, w: 2, h: 3, type: "Blank", datapath: e.datapath, dataname: e.dataname })
    //   this.setState({ layout: layout })
    // }


  }


  onDrop = (e, f) => {

    // pixel location
    var droplocation = {
      x: e.pageX - e.target.getBoundingClientRect().x,
      y: e.pageY - e.target.getBoundingClientRect().y
    }

    // calculate row/column location for widget
    var location = {
      x: Math.max(0, Math.round(droplocation.x / (this.state.grid.width / this.state.grid.cols) - 0.5)),
      y: Math.max(0, Math.round(droplocation.y / this.state.grid.rowHeight / 2) - 1)
    }

    // add widget to layout
    var layout = _.clone(this.state.layout)
    layout.push({ i: this.generateDifficult(32), x: location.x, y: location.y, w: 2, h: 5, type: "Guage", datapath: e.datapath, dataname: e.dataname })
    this.setState({ layout: layout }, () => { })
  }

  gridOnDragStart = () => {
    //console.log("drag start"); 
  }
  gridOnDrag = () => {
    //console.log("drag"); 
  }
  gridOnDragStop = () => {
    //console.log("drag stop"); 
  }
  gridOnResizeStart = () => {
    //console.log("resize start"); 
  }
  gridOnResize = () => {
    //console.log("resize "); 
  }
  gridOnResizeStop = () => {
    //console.log("resize stop"); 
  }

  gridOnLayoutChange = (layout) => {
    var updated = false; //should we update the server? default false.

    var newlayout = _.clone(this.state.layout)
    for (var widgetup of layout) {
      for (var widget of newlayout) {
        if (widget.i == widgetup.i) {
          // update on location/size changes
          if (widget.x != widgetup.x) { widget.x = widgetup.x; updated = true; }
          if (widget.y != widgetup.y) { widget.y = widgetup.y; updated = true; }
          if (widget.w != widgetup.w) { widget.w = widgetup.w; updated = true; }
          if (widget.h != widgetup.h) { widget.h = widgetup.h; updated = true; }
        }
      }
    }

    //if there are fewer or more widgets then we update the server
    if (layout.length != this.state.layout) {
      updated = true;
    }

    if (updated) {
      // update the server
      fetch("/api/v3/dashboard", {
        method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ key: this.props.state.key, layout: newlayout })
      }).then(response => response.json()).then(result => { console.log(result) })
        .catch(err => console.error(err.toString()));
    }

  }

  showMap = () => {
    mapDetails.un = this.props.username;
    mapDetails.acc = this.props.acc;
    mapDetails.dc = this.props.state;
    mapDetails.ds = this.props.devices;
  }

  widgetRemove = (id) => {
    return (e) => {
      console.log(id)
      var temp = this.state.layout.filter(item => { if (item.i != id) return item })
      this.setState({ layout: temp })
    }
  }

  generateDashboard = () => {


    if (!this.props.state) {
      return (<div>loading..</div>)
    } else {
      var draggble = true;
      this.state.layout.map((data, i) => {
        if (data.type == "map") {
          draggble = false;
        } else {
          draggble = true;
        }
      })
      return (
        <GridLayout
          isDraggable={draggble}
          onDragStart={this.gridOnDragStart}
          onDrag={this.gridOnDrag}
          onDragStop={this.gridOnDragStop}
          onResizeStart={this.gridOnResizeStart}
          onResize={this.gridOnResize}
          onLayoutChange={this.gridOnLayoutChange}
          useCSSTransforms={false}
          onResizeStop={this.gridOnResizeStop}
          layout={this.state.layout}
          cols={this.state.grid.cols}
          rowHeight={this.state.grid.rowHeight}
          width={this.state.grid.width}>
          {
            this.state.layout.map((data, i) => {
              if (data.type == "Calendar") {
                return (
                  <div className="dashboardBlock" key={data.i} >
                    <Widget label={data.dataname} remove={this.widgetRemove(data.i)}>
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
                    <Widget label={data.datapath.split("root.data.")[1]} remove={this.widgetRemove(data.i)} >
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
              if (data.type == "Guage") {
                return (
                  <div className="dashboardBlock" key={data.i}  >
                    <Widget label={data.dataname} remove={this.widgetRemove(data.i)}>
                      <ProtoGuage value={this.objectByString(this.props.state.payload, data.datapath.split("root.")[1])} />
                    </Widget>
                  </div>
                )
              }
              if (data.type == "map") {
                { this.showMap() }
                return (
                  <div key={data.i} >
                    <Widget label={data.dataname} >
                      <MapDevices username={mapDetails.un} acc={mapDetails.acc} deviceCall={mapDetails.dc} devices={this.props.devices} widget={true} />
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

  loading() {
    console.log("loading")
    if (this.props.state) {

      if (this.props.state.layout) {

        if (this.settingLayout == false) {
          this.settingLayout = true;
          //console.log(this.props.state.layout)
          this.setState({ layout: this.props.state.layout }, () => { console.log("state") })
        }

        return (<div>state</div>)
      } else {

        if (this.settingLayout == false) {
          this.settingLayout = true;
          this.setState({ layout: [{ i: "0", x: 0, y: 0, w: 8, h: 4, type: "Calendar", dataname: "calendar" }] }, () => { console.log("state") })
        }

        return (<div>loading</div>)
      }



    } else {
      //console.log("no props yet")
      return (<div>no props</div>)
    }

  }

  render() {
    if (this.state.layout) {
      return (
        <div style={{ background: "rgba(255,0,0,0.1)", minHeight: 50, textAlign: "center" }} onDragOver={(e) => this.onDragOver(e)} onDrop={(e) => this.onDrop(e, "complete")} >
          {this.generateDashboard()}
        </div>
      )
    } else {
      return this.loading()
    }

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
