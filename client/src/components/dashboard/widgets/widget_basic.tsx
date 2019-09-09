import React, { Component } from 'react';
import { WidgetComponent } from "./widgetcomponent"

export default class WidgetBasic extends WidgetComponent {
    state = {
        options: {
            color: { type: "color", default: "#ffffff", value: undefined }
        }
    }

    render() {
        return (
            <div style={{ color: this.state.options.color.value, wordBreak: "break-all" }}>
                {JSON.stringify(this.props.value)}
            </div>
        );
    }
};

