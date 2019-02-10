import React, { Component } from "react";

export class Widget extends React.Component {


  render() {
    return (
      <div style={{ overflow: "hidden" }} style={{ height: "100%", position: "relative", paddingTop: 30 }}>
        <div className="widgetLabel" style={{ position: "absolute", top: 0, width: "100%" }}>

          <div style={{ float: "left", padding: "5px" }}>{this.props.label} </div>
          <div className="widgetOptions" style={{ float: "right", padding: "6px 6px 0 0" }}><i class="fas fa-wrench"></i></div>

        </div>

        <div className="widgetContents" style={{ height: "100%" }}>
          {this.props.children}
        </div>

        <div style={{ clear: "both" }}></div>
      </div>
    )
  }

}