import React, { Component } from "react";

export class OptionsBool extends React.Component {


  componentWillMount() {
    this.setState({ value: this.props.option.value })
  }

  apply() {
    var option = {}
    option[this.props.option.name] = this.state.value;
    this.props.setOptions(option)
  }


  onChange = (event) => {
    this.setState({ value: !this.state.value }, () => {
      this.apply();
    });
  }

  componentWillUpdate = (a, b, c) => {
    console.log("update")
    console.log([a, b, c]);
    console.log(this.props.option.value)
  }

  render() {
    return (<div className="widgetMenuItem" onDrag={this.noDrag}
      onDragStart={this.noDrag} >
      {this.props.option.name}:
      <input
        type="checkbox"
        defaultChecked={this.state.value}
        onChange={this.onChange} >
      </input>
    </div>)
  }
}