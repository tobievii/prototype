import React, { Component } from 'react';
import { Widget } from "./widget.jsx"

export class WidgetButton extends React.Component {

  state = {
    color: "#fff",
    background: "#0ff",
    command: JSON.stringify({ "foo": "bar" })
  }

  options;

  setOptions = (options) => {
    this.setState(_.merge(this.state, options))
    this.props.dash.setOptions(options);
  }

  updatedOptions = () => {
    var options = [
      { name: "color", type: "input", default: "#fff", value: this.state.color },
      { name: "background", type: "input", default: "#0ff", value: this.state.background },
      { name: "command", type: "input", default: JSON.stringify({ "foo": "bar" }), value: this.state.command }
    ]
    this.options = options;
  }

  componentDidMount() {
    if (this.props.data.options) {
      this.setState(_.merge(this.state, this.props.data.options));
    }
    this.updatedOptions();
  }

  onClick = () => {
    //console.log(this.props)
    fetch("/api/v3/data/post", {
      method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ id: this.props.state.devid, data: JSON.parse(this.state.command) })
    }).then(response => response.json()).then(resp => {
      console.log(resp);
    }).catch(err => console.error(err.toString()));
  }

  render() {
    return (<Widget label={this.props.data.dataname} options={this.options} dash={this.props.dash} setOptions={this.setOptions} >
      <button style={{ width: "100%", height: "100%", color: this.state.color, background: this.state.background, border: "none" }} onClick={this.onClick}>SEND</button>
    </Widget>
    );
  }
};

