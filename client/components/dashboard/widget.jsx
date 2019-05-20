import React, { Component } from "react";

import { OptionsInput } from "./options/options_input.jsx"
import { OptionsColor } from "./options/options_color.jsx"
import { OptionsTextarea } from "./options/options_textarea.jsx"
import { OptionsCode } from "./options/options_code.jsx"
import { OptionsBool } from "./options/options_bool.jsx"
import { OptionsTime } from "./options/options_time.jsx"
import { OptionsDropdown } from "./options/options_dropdown.jsx"

export class Widget extends React.Component {
  state = {
    menuVisible: false,
    boundaryVisible: false
  }

  // componentWillUpdate = (update) => {
  //   console.log()
  // }



  removeWidget = () => {
    if (this.props.dash.remove) { this.props.dash.remove() }
  }

  optionsPanel = () => {
    if (this.props.options) {
      return (<div>{this.props.options.map((option, i) => {

        if (option.type == "input") { return (<OptionsInput key={i} option={option} setOptions={this.props.setOptions} />) }
        if (option.type == "color") { return (<OptionsColor key={i} option={option} setOptions={this.props.setOptions} />) }
        if (option.type == "textarea") { return (<OptionsTextarea key={i} option={option} setOptions={this.props.setOptions} />) }
        if (option.type == "code") { return (<OptionsCode key={i} option={option} setOptions={this.props.setOptions} />) }
        if (option.type == "bool") { return (<OptionsBool key={i} option={option} setOptions={this.props.setOptions} />) }
        if (option.type == "time") { return (<OptionsTime key={i} option={option} setOptions={this.props.setOptions} />) }
        if (option.type == "dropdown") { return (<OptionsDropdown key={i} option={option} setOptions={this.props.setOptions} />) }

        return (<div key={i}></div>)

      })}</div>)
    } else {
      return (<div className="widgetMenuItem">Widget has no options.</div>)
    }

  }

  menu() {
    if (this.state.menuVisible) {
      return (<div className="widgetMenu" style={{
        position: "absolute",
        zIndex: 100,
        width: "auto",
        minWidth: 250,
        fontSize: 14
      }} >

        <div className="row">
          <div className="col-6">
            <div className="widgetMenuItem" style={{ width: "100%" }} >
              <select
                value={this.props.dash.type}
                onChange={(e) => { this.props.dash.change("type", e.target.value) }}
              >
                <option>Calendar</option>
                <option>NivoLine</option>
                <option>ChartLine</option>
                <option>Blank</option>
                <option>ThreeDWidget</option>
                <option>Gauge</option>
                <option>mesh</option>
                <option>map</option>
                <option>form</option>
                <option>scheduler</option>
                <option>widgetButton</option>
              </select></div>
          </div>
          <div className="col-6">
            <div className="widgetMenuItem widgetMenuItemButton" onClick={this.removeWidget} style={{ width: "100%" }} >
              <i className="fas fa-trash-alt"></i> REMOVE
            </div>
          </div>
        </div>
        {this.optionsPanel()}
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


  devicePathButton = (name) => {
    if (name == "map") {
      if (this.props.deviceSelected == false || this.props.deviceSelected == undefined) {
        return (
          <div style={{ padding: "4px 6px 4px 6px", color: "grey", opacity: "0.3", cursor: "not-allowed" }}><i className="fas fa-route" title="Select a device"></i></div>
        )
      } else {
        return (
          <div className="widgetOptionsButton" style={{ padding: "4px 6px 4px 6px" }}><i className="viewButton fas fa-route" title="Show Boundary" onClick={() => { this.showPathHistory() }}></i></div>
        )
      }
    } else {
      return (
        <div style={{ display: "none" }}></div>
      )
    }
  }

  showPathHistory = () => {
    if (this.state.boundaryVisible == false) {
      this.props.showBoundary();
      this.setState({ boundaryVisible: true })
    } else if (this.state.boundaryVisible == true) {
      this.props.showBoundary();
      this.setState({ boundaryVisible: false })
    }
  }

  getWrench = () => {
    if (this.props.widget == false && this.props.label == "map") {
      return (
        <div></div>
      )
    } else {
      return (
        <div>
          <div className="widgetOptionsButton"
            onClick={this.showMenu()}
            style={{ padding: "4px 6px 4px 6px" }} >
            <i className="fas fa-wrench"  ></i></div>
          {this.menu()}
        </div>
      )
    }
  }
  // This must move into the map widget!
  // mapWidget = () => {
  //   var p = this.props.children.type;
  //   var color = "";
  //   if (this.props.children.type.name == "MapDevices") {
  //     if (this.state.boundaryVisible == true) {
  //       color = "white";
  //     } else {
  //       color = "grey";
  //     }
  //     return (
  //       <div className="widgetOptionsButton" style={{ padding: "4px 6px 4px 6px", color: color }} ><i className="fas fa-route" title="Show Boundary" onClick={this.showBoundary}></i></div>
  //     )
  //   } else {
  //     return;
  //   }
  // }

  getwidgetoptions = (options) => {
    this.setState({ options })
  }

  render = () => {
    return (
      < div style={{ overflow: "hidden" }
      } style={{ height: "100%", position: "relative", paddingTop: 30 }}>

        <div className="widgetTitleBar" >
          <div className="widgetGrab" >{this.props.label} </div>
          {this.devicePathButton(this.props.label)}
          <div className="widgetOptions">
            {this.getWrench()}
          </div>
        </div>

        <div className="widgetContents" height="100%" width="100%" style={{ height: "100%", width: "100%" }}>
          {this.props.children}
        </div>

        <div style={{ clear: "both" }}></div>
      </div >
    )
  }

}
