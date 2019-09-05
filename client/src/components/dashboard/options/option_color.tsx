import React, { Component } from "react";
import { OptionMaster } from "./optionmaster"



export default class OptionsColor extends OptionMaster {
  state = { value: "#FFFFFF" }

  apply() {
    var option = {}
    // option[this.props.option.name] = this.state.value;
    // this.props.setOptions(option)
  }

  onKeyPress = (e) => {
    if (e.key == "Enter") {
      this.apply();
    }
  }

  onChange = (event) => {
    //console.log(event.target.value)
    this.setState({ value: event.target.value }, () => {
      this.apply();
    });
  }

  render() {
    return (<div className="widgetMenuItem" style={{ display: "flex", flexDirection: "row" }} >
      <div style={{ padding: "10px 5px 10px 0px" }}>
        {this.props.name}
      </div>
      <input
        style={{
          display: "block", borderTopLeftRadius: 5, borderBottomLeftRadius: 5,
          background: this.state.value, border: 0, height: "35px", padding: 2, margin: 0,
          width: "35px"
        }}
        type="color"
        value={this.state.value}
        // onKeyPress={this.onKeyPress}
        onChange={this.onChange} />

      <input type="text" value={this.state.value} onChange={this.onChange} />
    </div>)
  }
}