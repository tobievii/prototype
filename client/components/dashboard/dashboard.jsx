import React, { Component } from "react";

import GridLayout from 'react-grid-layout';

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css"

import "./index.scss"


import {Calendar} from "./nivo_calendar.jsx"
import {Line} from "./nivo_line.jsx"

// https://github.com/STRML/react-grid-layout

export class Dashboard extends React.Component {

  state = {
    
  }

  render() {
    // layout is an array of objects, see the demo for more complete usage
    var layout = [
      {i: 'c', x: 0, y: 0, w: 8, h: 4},
      {i: 'd', x: 0, y: 4, w: 8, h: 8}
    ];
    return (
      <div>
        
        
        
      <GridLayout className="layout" layout={layout} cols={40} rowHeight={30} width={"4000"}>
        <div className="dashboardBlock" key="c" >
          <Calendar deviceid={this.props.deviceid} /></div>
        {/* <div className="dashboardBlock" key="d" ><Line /></div> */}
      </GridLayout>
      </div>
    )
  }
}