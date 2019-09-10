import React, { Component } from 'react';
import { WidgetComponent } from "./widgetcomponent"
import { api } from "../../../api"

import { ResponsiveCalendar } from '@nivo/calendar'

export default class WidgetCalendar extends WidgetComponent {
    state = {
        options: {
            color: { type: "color", default: "#111111", value: "" },
            background: { type: "color", default: "#11cc88", value: "" },
            command: { type: "input", default: JSON.stringify({ "foo": true }), value: "" },
            buttonText: { type: "input", default: "SEND", value: "" },
        },
        gettingdata: false,
        data: []
    }

    componentDidUpdate() {
        if (!this.state.gettingdata) {
            console.log("calendar GETTING DATA")
            this.state.gettingdata = true;
            var key = this.props.state.key
            api.activity({ key }, (err, data: any) => {
                if (err) { console.log(err); }
                if (data) {
                    this.setState({ data })
                }
            })
        }
    }


    render() {
        var protoGraphTheme: any = {
            axis: {
                domain: {
                    line: {
                        strokeWidth: 0,
                        stroke: '#889eae',
                    },
                },
                ticks: {
                    line: {
                        stroke: '#889eae',
                    },
                    text: {
                        fill: '#6a7c89',
                    },
                },
                legend: {
                    fill: '#fff',
                },
            },
            grid: {
                line: {
                    stroke: 'rgba(125, 125, 125,0.15)',
                },
            },
            legends: {
                text: {
                    fontSize: 12,
                    fill: '#fff',
                    color: "#fff"
                },
            },
            tooltip: {
                container: {
                    fontSize: '13px',
                    background: 'rgba(18, 28, 33, 0.9)',
                    color: '#ddd',
                }
            },
            labels: {
                text: {
                    fill: '#eee',
                    fontSize: 12,
                    fontWeight: 500,
                },
            },
        }

        return (

            <ResponsiveCalendar
                data={this.state.data}
                from="2019-01-01"
                to="2019-12-30"
                emptyColor="rgba(125, 125, 125,0.05)"
                colors={[
                    "rgba(255, 57, 66,0.4)",
                    "rgba(255, 57, 66,0.5)",
                    "rgba(255, 57, 66,0.7)",
                    "rgba(255, 57, 66,1)"
                ]}
                margin={{
                    "top": 35,
                    "right": 35,
                    "bottom": 0,
                    "left": 35
                }}
                yearSpacing={35}
                yearLegendOffset={11}
                monthBorderWidth={1}
                monthBorderColor="rgba(125, 125, 125,0.15)"
                monthLegendOffset={7}
                daySpacing={3}
                dayBorderWidth={2}
                dayBorderColor="rgba(247, 57, 67,0)"
                theme={protoGraphTheme}
            />

        );
    }
};

