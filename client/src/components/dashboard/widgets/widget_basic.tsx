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

        if (!this.props.value) {
            return <div>Blank widget. Please edit or remove.</div>
        }

        var datapath = ""

        if (this.props.widget.datapath) {
            if (this.props.widget.datapath.indexOf("data.") == 0) {
                datapath = this.props.widget.datapath.slice(5)
            }
        }

        return (
            <div style={{
                color: this.state.options.color.value,
                wordBreak: "break-all",
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}>

                <div style={{
                    flex: "1",
                    display: "flex",
                    justifyContent: "center", /* align horizontal */
                    alignItems: "center", /* align vertical */
                    fontSize: "150%",
                    textAlign: "center",
                    padding: colors.padding
                    //background: "rgba(0,0,0,0.2)"
                }}>{display}</div>

                <div style={{
                    flex: "0",
                    textAlign: "center",
                    padding: colors.padding,
                    opacity: 0.5,
                    width: "100%",
                    boxSizing: "border-box"
                }}>{datapath}</div>

            </div>
        );
    }
};

