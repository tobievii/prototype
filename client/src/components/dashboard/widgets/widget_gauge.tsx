import React, { Component } from 'react';
import { Vector } from "../../../../../server/shared/vector"
import { WidgetComponent } from "./widgetcomponent"
import { colors } from "../../../theme"

export default class WidgetGauge extends WidgetComponent {
    state = {
        options: {
            min: { type: "input", default: 0, value: -1 },
            max: { type: "input", default: 100, value: 101 },
            color: { type: "color", default: "#00ff00", value: "#0000ff" }
        }
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
        if ((end_angle - start_angle) > Math.PI) { largeArcFlag = "1" }
        return "M " + (start.x + center.x).toFixed(3) + " " + (start.y + center.y).toFixed(3) + " A " + radius + " " + radius + " 0 " + largeArcFlag + " 1 " + (end.x + center.x) + " " + (end.y + center.y);
    };

    degrees(degrees) { return ((Math.PI * 2) / 360) * degrees }

    drawguageSvg(min, value, max) {
        if (value > max) { value = max };
        if (value < min) { value = min }
        var range = max - min;
        var valr = value - min;
        var ratio = valr / range;
        var graphdegree = ((180 + 35 + 35) * ratio) - 35
        return (<path
            className="value"
            fill="none"
            stroke={this.state.options.color.value}
            strokeWidth="1"
            d={this.svg_arc_path(50, 50, 40, this.degrees(-35), this.degrees(graphdegree))} />)
    }

    render() {
        var value = 0;
        if (this.props.value) { value = parseInt(this.props.value) }
        var undermin = (value <= this.state.options.min.value) ? true : false
        var overmax = (value >= this.state.options.max.value) ? true : false

        return (
            <div style={{ margin: "0 auto" }}>
                {(overmax)
                    ? <div style={{ color: colors.warning, position: "absolute" }}><i className="fas fa-exclamation-triangle" /> OVER MAX!</div>
                    : <div></div>}

                {(undermin)
                    ? <div style={{ color: colors.warning, position: "absolute" }}><i className="fas fa-exclamation-triangle" /> UNDER MIN!</div>
                    : <div></div>}

                <div style={{ paddingTop: 10, overflow: "hidden", width: "80%", margin: "0 auto" }}>
                    <svg viewBox="0 0 100 90" className="gauge">
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
                            dominantBaseline="central">MIN:{Math.round(this.state.options.min.value)}</text>

                        <text x="100" y="80"
                            fill="#aaa"
                            className="value-text"
                            fontSize="40%"
                            fontWeight="normal"
                            textAnchor="end"
                            //alignmentBaseline="top"
                            dominantBaseline="central">MAX:{Math.round(this.state.options.max.value)}</text>



                        <path className="value" fill="none" stroke="rgba(255,255,255,0.1)"
                            strokeWidth="1" d={this.svg_arc_path(50, 50, 40, this.degrees(-35), this.degrees(180 + 35))} />
                        {this.drawguageSvg(this.state.options.min.value, value, this.state.options.max.value)}
                    </svg>
                </div>
            </div>
        );

    }
};

