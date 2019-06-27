import React, { Component } from 'react';
import { Vector } from "../../../src/utils/vector"
import { Widget } from "./widget.jsx"

export class WidgetChart extends React.Component {

    state = {
    }

    options;

    setOptions = (options) => {
        this.setState(_.merge(this.state, options))
        this.props.dash.setOptions(options);
    }

    updatedOptions = () => {
        var options = [
            { name: "min", type: "input", value: this.state.min },
            { name: "max", type: "input", value: this.state.max },
            { name: "color", type: "color", value: this.state.color }
        ]
        this.options = options;
    }

    componentDidMount() {

        if (this.props.data.options) {
            this.setState(_.merge(this.state, this.props.data.options), () => {
                this.updatedOptions();
            });
        } else {
            this.updatedOptions();
        }

    }




    render() {

        return (
            <Widget label={this.props.data.dataname} options={this.options} dash={this.props.dash} setOptions={this.setOptions}>
                <span>chart</span>
            </Widget >
        );

    }
};

