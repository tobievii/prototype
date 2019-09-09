import React, { Component } from 'react';
import { WidgetComponent } from "./widgetcomponent"
import { colors } from "../../../theme"

import { api } from "../../../api"

export default class WidgetButton extends WidgetComponent {

    name = "widgetbutton"

    state = {
        color: "#111111",
        background: "#11cc88",
        command: JSON.stringify({ "foo": true }),
        buttonText: "SEND",
        options: {
            color: { type: "color", default: "#111111" },
            background: { type: "color", default: "#11cc88" },
            command: { type: "input", default: JSON.stringify({ "foo": true }) },
            buttonText: { type: "input", default: "SEND" },
        }
    }

    options() {
        return this.state.options
    }


    onClick() {
        var command = this.state.options.command.default;
        if (this.props.widget.options) {
            var db = this.props.widget.options;
            if (db.color) command = db.command
        }
        console.log("click!")
        var data = JSON.parse(command);
        console.log(data);
        api.post({ key: this.props.state.key, data })
    }

    render() {
        var color = this.state.options.color.default
        var background = this.state.options.background.default
        var command = this.state.options.command.default
        // widget options:
        if (this.props.widget.options) {
            var db = this.props.widget.options;
            if (db.color) color = db.color
            if (db.background) background = db.background
            if (db.command) command = db.command
        }

        return (

            <div style={{ height: "100%" }}>
                <button
                    onClick={() => { this.onClick() }}
                    style={{
                        color,
                        background: background,
                        width: "100%",
                        height: "100%"
                    }}>
                    {this.state.buttonText}<br />
                    {command}
                </button>
            </div>
        );

    }
};

