import React, { Component } from 'react';
import { WidgetComponent } from "./widgetcomponent"
import { api } from "../../../api"
import { colors } from "../../../theme"

//import { Line } from 'react-chartjs-2';
import { AreaChart, AreaSeries, Area, Stripes, Gradient, GradientStop, Line } from 'reaviz';

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
                sort: { "_id": -1 },
                limit: 50
            }

            console.log("query", query)
            //query.find[this.props.widget.datapath] = { $exists: true }

            api.packets(query, (err, data: any) => {
                if (err) { console.log(err); }
                if (data) {
                    console.log(data);
                    data = data.reverse(); // flip order
                    this.setState({ data })
                }
            })

            api.on("packet", (packet) => {
                if (Array.isArray(packet) == false) {
                    if (packet.key == this.props.state.key) {
                        var data: any = this.state.data;
                        data.push(packet);
                        this.setState({ data })
                    }
                }
            })

        }
    }



    render() {

        //if (this.props.widget.datapath) { return <div>{this.props.widget.datapath}</div> }
        if (this.state.data.length == 0) { return <div></div> }

        var labels = [];
        var data = [];



        for (var d of this.state.data) {
            //var value = objectByString(this.props.state, this.props.widget.datapath)
            var entry = {
                key: new Date(d["timestamp"]),
                data: parseFloat(objectByString(d, this.props.widget.datapath))
            }

            if (!Number.isNaN(entry.data)) {
                data.push(entry)
            }


        }


        var style = {
            width: "100%", height: "100%"
        }

        // For documentation see: 
        // see https://reaviz.io/?path=/docs/docs-chart-types-area-chart--page

        //var color = select('Color Scheme', schemes, 'cybertron');

        return (
            <AreaChart style={style}
                data={data}

                series={
                    <AreaSeries

                        area={
                            <Area
                                mask={<Stripes />}
                                style={{ fill: this.state.options.color.value }}
                                gradient={
                                    <Gradient
                                        stops={[
                                            <GradientStop offset="10%" stopOpacity={0} />,
                                            <GradientStop offset="80%" stopOpacity={1} />
                                        ]}
                                    />
                                }
                            />
                        }
                        line={<Line strokeWidth={3} style={{ stroke: this.state.options.color.value }} />}
                    />
                }
            />


            // <AreaChart style={style}
            //     data={data}

            //     series={
            //         <AreaSeries

            //             area={
            //                 <Area
            //                     mask={<Stripes />}
            //                     //style={{ fill: this.state.options.color.value }}
            //                     gradient={
            //                         <Gradient
            //                             stops={[
            //                                 <GradientStop offset="10%" stopOpacity={0} />,
            //                                 <GradientStop offset="80%" stopOpacity={1} />
            //                             ]}
            //                         />
            //                     }
            //                 />
            //             }
            //             line={<Line strokeWidth={3} style={{ stroke: this.state.options.color.value }} />}
            //         />
            //     }
            // />

        )
    }
};

