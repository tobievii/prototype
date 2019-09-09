import React, { Component } from 'react';
import { Vector } from "../../../../../server/shared/vector"

import { WidgetComponent } from "./widgetcomponent"

export default class WidgetGauge extends WidgetComponent {

    name = "Gauge"

    state = {
        value: 50,
        min: 0,
        max: 100,
        valueanim: 0,
        typeError: false,
        options: {
            min: { type: "input", default: 0 },
            max: { type: "input", default: 100 },
            color: { type: "color", default: "#00ff00" }
        }
    }

    options() {
        return this.state.options
    }

    polar_to_cartesian = function (cx, cy, radius, angle) {
        var radians;
        radians = (angle - 90) * Math.PI / 180.0;
        return [Math.round((cx + (radius * Math.cos(radians))) * 100) / 100, Math.round((cy + (radius * Math.sin(radians))) * 100) / 100];
    };

    svg_arc_path = function (x, y, radius, start_angle, end_angle) {
        var center = new Vector({ x, y })
        var start = new Vector({ x: -radius })
        var end = new Vector({ x: -radius })
        start.rotate(new Vector({ z: 1 }), start_angle)
        end.rotate(new Vector({ z: 1 }), end_angle)

        var largeArcFlag = "0"
        if ((end_angle - start_angle) > Math.PI) {
            largeArcFlag = "1"
        }

        return "M " + (start.x + center.x).toFixed(3) + " " + (start.y + center.y).toFixed(3) + " A " + radius + " " + radius + " 0 " + largeArcFlag + " 1 " + (end.x + center.x) + " " + (end.y + center.y);
    };

    degrees(degrees) {
        return ((Math.PI * 2) / 360) * degrees
    }

    drawguageSvg(min, value, max, color) {



        if (this.state.typeError) {
            return null;
        } else {
            var range = max - min;
            var valr = value - min;
            var ratio = valr / range;

            var graphdegree = ((180 + 35 + 35) * ratio) - 35
            return (<path className="value" fill="none" stroke={color} strokeWidth="1" d={this.svg_arc_path(50, 50, 40, this.degrees(-35), this.degrees(graphdegree))}></path>)
        }

    }



    render() {

        var min = this.state.options.min.default
        var max = this.state.options.max.default
        var color = this.state.options.color.default

        // widget options:
        if (this.props.widget.options) {
            var db = this.props.widget.options;
            if (db.min) min = db.min
            if (db.color) color = db.color
            if (db.max) max = db.max
        }
        //

        var value = 0;
        if (this.props.value) { value = parseInt(this.props.value) }

        return (
            //<Widget label={this.props.data.dataname} options={this.options} dash={this.props.dash} setOptions={this.setOptions}>
            <div style={{ width: "80%", height: "80%", margin: "0 auto" }}>
                <svg viewBox="0 0 100 100" className="gauge">
                    <text
                        x="50"
                        y="50"
                        fill="#fff"
                        className="value-text"
                        fontSize="100%"
                        fontWeight="normal"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        dominantBaseline="central">{value}</text>

                    <text x="0" y="80"
                        fill="#aaa"
                        className="value-text"
                        fontSize="40%"
                        fontWeight="normal"
                        textAnchor="start"
                        //alignmentBaseline="top"
                        dominantBaseline="central">MIN:{Math.round(min)}</text>

                    <text x="100" y="80"
                        fill="#aaa"
                        className="value-text"
                        fontSize="40%"
                        fontWeight="normal"
                        textAnchor="end"
                        //alignmentBaseline="top"
                        dominantBaseline="central">MAX:{Math.round(max)}</text>

                    <path className="value" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" d={this.svg_arc_path(50, 50, 40, this.degrees(-35), this.degrees(180 + 35))}></path>
                    {this.drawguageSvg(min, value, max, color)}
                </svg>
            </div>
        );

    }
};

