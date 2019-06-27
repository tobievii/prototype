import React, { Component } from "react";

export class OptionsTime extends React.Component {

  state = {
    HHMM: "00:00"
  }

  componentWillMount() {
    // prep time to HH:MM string
    var inval;

    try {
      this.setState({ value: this.props.option.value })
      inval = new Date(this.props.option.value);
    } catch (e) {
      //console.log(e);
      var newdate = new Date();
      this.setState({ value: newdate.toTimeString() })
      inval = newdate;
    }

    if (inval == "Invalid Date") {
      inval = new Date();
    }

    var hours = inval.getHours().toString();
    if (hours.length == 1) { hours = "0" + hours; }
    var minutes = inval.getMinutes().toString();
    if (minutes.length == 1) { minutes = "0" + minutes; }
    var val = hours + ":" + minutes


    //console.log(val)

    this.setState({ HHMM: val })
  }

  apply() {
    var option = {}
    option[this.props.option.name] = this.state.value;
    this.props.setOptions(option)
  }

  onChange = (event) => {
    return (e) => {
      this.setState({ HHMM: e.target.value });
    }
  }

  onSet = () => {

    //var a = new Date()

    return (e) => {
      // console.log("set")
      // console.log(this.state.HHMM)

      var tempdate = new Date();
      tempdate.setHours(parseInt(this.state.HHMM.split(":")[0]))
      tempdate.setMinutes(parseInt(this.state.HHMM.split(":")[1]))
      tempdate.setSeconds(0);

      // console.log(tempdate)

      this.setState({ value: tempdate }, this.apply)
    }
  }

  render() {
    return (<div className="widgetMenuItem"
    // onDrag={this.noDrag}
    //onDragStart={this.noDrag} 
    >
      {this.props.option.name}<br />
      <input type="time" onChange={this.onChange()} value={this.state.HHMM} />
      <button onClick={this.onSet()}>set</button>

      {/* <input
        type="number"
        value={this.state.hour}
        onKeyPress={this.onKeyPress}
        onChange={this.onChange} >
      </input> */}

    </div>)
  }
}