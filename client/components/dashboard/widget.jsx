import React, { Component } from "react";

export class Widget extends React.Component {

  state = {
    menuVisible: false,
    boundaryVisible: false
  }

  removeWidget = () => {
    if (this.props.remove) { this.props.remove() }
  }

  optionsPanel = () => {
    console.log(this.props.children)
    return (<div>OPTIONS</div>)
  }

  menu() {
    if (this.state.menuVisible) {
      return (<div className="widgetMenu" style={{
        position: "absolute",
        zIndex: 100,
        width: 200,
        fontSize: 14
      }} >
        <div className="widgetMenuItem widgetMenuItemButton" onClick={this.removeWidget} >
          <i className="fas fa-trash-alt"></i> REMOVE</div>

        <div className="widgetMenuItem" >Change Type:
          <select onChange={(e) => {
            // console.log(e.target.value);
            this.props.change("type", e.target.value)
          }}>
            <option unselectable="true">select</option>
            <option>Calendar</option>
            <option>NivoLine</option>
            <option>ChartLine</option>
            <option>Blank</option>
            <option>ThreeDWidget</option>
            <option>Gauge</option>
            <option>map</option>
            <option>button</option>
          </select></div>

        <div className="widgetMenuItem">{this.optionsPanel()}</div>
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

  showBoundary = () => {
    if (this.state.boundaryVisible == false) {
      this.props.showBoundary(true);
      this.setState({ boundaryVisible: true })
    } else if (this.state.boundaryVisible == true) {
      this.props.showBoundary(false);
      this.setState({ boundaryVisible: false })
    }
  }

  mapWidget = () => {
    var p = this.props.children.type;
    var color = "";

    if (this.props.children.type.name == "MapDevices") {
      if (this.state.boundaryVisible == true) {
        color = "white";
      } else {
        color = "grey";
      }
      return (
        <div className="widgetOptionsButton" style={{ padding: "4px 6px 4px 6px", color: color }} ><i className="fas fa-route" title="Show Boundary" onClick={this.showBoundary}></i></div>
      )
    } else {
      return;
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

          <div className="widgetOptions" style={{ float: "right" }}>
            {this.mapWidget()}
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