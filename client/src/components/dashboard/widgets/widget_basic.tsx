import React, { Component } from 'react';
import { WidgetComponent } from "./widgetcomponent"
import { colors } from '../../../theme';

export default class WidgetBasic extends WidgetComponent {
    state = {
        options: {
            color: { type: "color", default: "#ffffff", value: undefined }
        }
    }

    render() {

        var display = ""

        switch (typeof this.props.value) {
            case "object": {
                display = JSON.stringify(this.props.value)
                break;
            }
            case "string": {
                display = this.props.value;
                break;
            }

            case "number": {
                display = this.props.value.toString()
                break;
            }
        }

        return (
            <div style={{
                color: this.state.options.color.value,
                wordBreak: "break-all"
            }}>
                <div style={{ textAlign: "center", padding: colors.padding, opacity: 0.5 }}>
                    {this.props.widget.datapath}
                </div>
                <div style={{ fontSize: "150%", textAlign: "center", padding: colors.padding }}>
                    {display}
                </div>

            </div>
        );
    }
};

