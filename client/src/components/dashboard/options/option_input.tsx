import React, { Component } from "react";
import { OptionMaster } from "./optionmaster"



export default class OptionsInput extends OptionMaster {
  state = {
    value: "test"
  }
  componentDidMount() {
    // this.state = { value: this.props.option.value }
    // this.onChange = this.onChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  apply() {
    // var option = {}
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
    //this.setState({ value: event.target.value });
  }

  render() {
    return (<div className="widgetMenuItem">

      <div className="row">
        <div className="col-4">
          {this.props.name}:
        </div>
        <div className="col-8">
          <input
            style={{ width: "100%" }}
            type="text"
            value={this.state.value}
            onKeyPress={this.onKeyPress}
            onChange={this.onChange} >
          </input>
        </div>
      </div>
    </div>)
  }
}