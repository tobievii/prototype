import React, { Component } from "react";

import GridLayout from 'react-grid-layout';

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css"

import "./index.scss"

// https://github.com/STRML/react-grid-layout

export class Dashboard extends React.Component {

  state = {
    content : 1
  }

  componentDidMount = () => {
    setInterval( ()=>{
      this.setState({content : this.state.content + 1})
    },1000)
  }

  

  render() {
    // layout is an array of objects, see the demo for more complete usage
    var layout = [
      {i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
      {i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4},
      {i: 'c', x: 4, y: 0, w: 1, h: 2}
    ];
    return (
      <div>
        <div>
          {JSON.stringify(layout)}
        </div>
      <GridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
        <div className="dashboardBlock" key="a"> { this.state.content }</div>
        <div className="dashboardBlock" key="b">b</div>
        <div className="dashboardBlock" key="c">c</div>
      </GridLayout>
      </div>
    )
  }
}