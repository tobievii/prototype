import React, { Component } from 'react';
import { WidgetComponent } from "./widgetcomponent"
import { colors } from '../../../theme';
import { api } from '../../../api';

export default class WidgetInput extends WidgetComponent {
    state = {
        options: {
            color: { type: "color", default: "#ffffff", value: undefined },
            name: { type: "input", default: "default", value: "" }
        },
        inputval: ""
    }

    render() {
        return (
            <div style={{
                color: this.state.options.color.value,
                wordBreak: "break-all",
                height: "100%",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
            }}>
                <div style={{ flex: 0, boxSizing: "border-box", width: "100%", padding: colors.padding / 2 }}>
                    {this.state.options.name.value}:
                </div>

                <div style={{
                    flex: 1,
                    display: "flex",
                    boxSizing: "border-box"
                }}>

                    <div style={{ flex: 1 }}>
                        <input
                            onChange={(e) => { this.setState({ inputval: e.target.value }) }}
                            value={this.state.inputval}
                            style={{ width: "100%", height: "100%" }}></input>
                    </div>

                    <div style={{ flex: 0 }}>
                        <button style={{ height: "100%", width: "100%" }} onClick={e => {
                            var data = {}
                            data[this.state.options.name.value] = this.state.inputval;
                            api.post({ key: this.props.state.key, data })
                        }}><i className="fas fa-save"></i></button>
                    </div>

                </div>
            </div>
        );
    }
};

