import React, { Component } from "react";

export class Widget extends React.Component {


  state = {
    menuVisible: false
  }

  removeWidget = () => {
    console.log("remove")
    if (this.props.remove) { this.props.remove() }
  }

  menu() {
    if (this.state.menuVisible) {
      return (<div className="widgetMenu" style={{
        position: "absolute",
        zIndex: 100,
        width: 100,
        height: 100,
        fontSize: 14
      }} >
        <div className="widgetMenuItem" onClick={this.removeWidget} ><i className="fas fa-trash-alt"></i> REMOVE</div>
      </div>)
    } else {
      return null;
    }

  }

  showMenu = () => {
    return (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.state.menuVisible) {
        this.setState({ menuVisible: false })
      } else {
        this.setState({ menuVisible: true })

      }
    }
  }

  onDrag = () => {
    return (e) => {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  render() {
    return (
      <div style={{ overflow: "hidden" }} style={{ height: "100%", position: "relative", paddingTop: 30 }}>
        <div className="widgetLabel" style={{ position: "absolute", top: 0, width: "100%" }}>

          <div style={{ float: "left", padding: "5px" }}>{this.props.label} </div>

          <div className="widgetOptions" style={{ float: "right" }}>
            <div className="widgetOptionsButton" style={{ padding: "4px 6px 4px 6px" }} ><i className="fas fa-wrench" onDrag={this.onDrag()} onClick={this.showMenu()}></i></div>
            {this.menu()}
          </div>

        </div>

        <div className="widgetContents" style={{ height: "100%" }}>
          {this.props.children}
        </div>

        <div style={{ clear: "both" }}></div>
      </div>
    )
  }

}