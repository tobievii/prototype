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
            return <div style={{ opacity: 0.5, padding: colors.padding * 2, paddingTop: colors.padding * 5 }}>Blank widget. Please edit or remove.</div>
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
                flexDirection: "column",
            }}>

                <div style={{
                    flex: "1",
                    display: "flex",
                    justifyContent: "center", /* align horizontal */
                    alignItems: "center", /* align vertical */
                    fontSize: "150%",
                    textAlign: "center",
                    padding: 0,
                    margin: 0
                }}>{display}</div>

                <div style={{
                    flex: "0",
                    textAlign: "center",
                    opacity: 0.5,
                    width: "100%",
                    boxSizing: "border-box",
                    padding: 0,
                    margin: 0,
                    paddingBottom: colors.padding
                }}>{datapath}</div>

            </div>
        );
    }
};

