import React, { Component } from "react";

export class OptionsRadio extends React.Component {
    state = { value: this.props.option.value }

    constructor(props) {
        super(props)
    }

    apply() {
        var option = this.props.option;
        option["value"] = this.state.value;
        this.props.setOptions(option)
    }

    onChange = (event) => {
        this.setState({ value: !this.state.value }, () => { this.apply(); })
    }

    render() {
        return (
            <div className="widgetMenuItem">
                <div className="row">
                    <div className="col-4">
                        {this.props.option.name}:
                    </div>
                    <div className="col-8">
                        <input
                            style={{ width: "100%" }}
                            type="radio"
                            value={this.state.value}
                            name={"zoomable"}
                            onChange={this.onChange}
                            checked={this.state.value}
                        />
                    </div>
                </div>
            </div>)
    }
}