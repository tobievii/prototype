import React, { Component } from 'react';
import { WidgetComponent } from "./widgetcomponent"
import { api } from "../../../api"

export default class WidgetImage extends WidgetComponent {
    state = {
        options: {
            imageurl: { type: "input", default: "", value: "" },
            background: { type: "color", default: "#1d364d", value: undefined }
        }
    }

    // onClick() {
    //     var data = JSON.parse(this.state.options.command.value);
    //     api.post({ key: this.props.state.key, data })
    // }

    render() {
        return (
            <div style={{ height: "100%", textAlign: "center", background: this.state.options.background.value, whiteSpace: "nowrap" }}>
                <span style={{ display: "inline-block", height: "100%", verticalAlign: "middle" }}></span>
                <img src={this.state.options.imageurl.value} style={{ width: "100%", verticalAlign: "middle" }} />
                {/* <button
                    onClick={() => { this.onClick() }}
                    style={{
                        color: this.state.options.color.value,
                        background: this.state.options.background.value,
                        width: "100%",
                        height: "100%"
                    }}>
                    {this.state.options.buttonText.value}<br />
                    {this.state.options.command.value}
                </button> */}
            </div>
        );
    }
};

