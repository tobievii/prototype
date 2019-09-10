import React, { Component } from 'react';
import { WidgetComponent } from "./widgetcomponent"
import { api } from "../../../api"
import { colors } from "../../../theme"

import { Line } from 'react-chartjs-2';

import { objectByString } from "../../../../../server/shared/shared"

export default class WidgetCanvas extends WidgetComponent {
    state = {
        options: {
            color: { type: "color", default: colors.widgetDefault, value: "" }
        },
        gettingdata: false,
        data: []
    }

    componentDidMount() {
        if (!this.state.gettingdata) {
            this.state.gettingdata = true;

            /** This is similar to mongodb query language */
            var query: any = {
                find: {
                    key: this.props.state.key,
                    [this.props.widget.datapath]: { $exists: true }
                },
                mask: {
                    [this.props.widget.datapath]: 1
                },
                sort: { "_timestamp": 1 },
                limit: 50
            }

            console.log("query", query)
            //query.find[this.props.widget.datapath] = { $exists: true }

            api.packets(query, (err, data: any) => {
                if (err) { console.log(err); }
                if (data) {
                    console.log(data);
                    this.setState({ data })
                }
            })
        }
    }

    render() {

        //if (this.props.widget.datapath) { return <div>{this.props.widget.datapath}</div> }
        if (this.state.data.length == 0) { return <div>loading...</div> }

        var labels = [];
        var data = [];



        for (var d of this.state.data) {
            //var value = objectByString(this.props.state, this.props.widget.datapath)
            labels.push(d["_timestamp"])
            data.push(objectByString(d, this.props.widget.datapath))
        }

        var graph = {
            labels: labels,
            datasets: [
                {
                    label: this.props.widget.dataname,
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: this.state.options.color.value,
                    borderColor: this.state.options.color.value,
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: this.state.options.color.value,
                    pointBackgroundColor: '#000',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: this.state.options.color.value,
                    pointHoverBorderColor: this.state.options.color.value,
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: data
                }
            ]
        };

        return (
            <Line data={graph} />
        )
    }
};

