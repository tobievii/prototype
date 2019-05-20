import React, { Component } from "react";

export class OptionsDropdown extends React.Component {


  constructor(props) {
    super(props)
    this.state = { value: this.props.option.value }
    this.onChange = this.onChange.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
  }

  apply() {
    var option = {}
    option[this.props.option.name] = this.state.value;
    this.props.setOptions(option)
  }

  onChange = (event) => {
    console.log(event.target.value)
    this.setState({ value: event.target.value }, () => {
      this.apply();
    });
  }

  render() {
    return (<div className="widgetMenuItem" >

      <div className="row" >
        <div className="col-4" >{this.props.option.name}:</div>
        <div className="col-8" >
          <select name={this.props.option.name} onChange={this.onChange} value={this.props.option.value}>
            {this.props.option.options.map((op, i) => {
              return (<option key={i} value={op}>{op}</option>)
            })}
          </select>
        </div>
      </div>

    </div>)
  }
}