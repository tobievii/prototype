import React, { Component } from 'react';
//import Gauge from 'react-svg-gauge';

import { Vector } from "../../../src/utils/vector"

export class ProtoGuage extends React.Component {

    state = {
        value: 0,
        min: -25,
        max: 120,
        valueanim: 0,
        typeError: false
    }

    animtimer;

    componentDidMount() {
        this.animtimer = setInterval(() => {
            // var targetval = this.state.value + 5

            // if (targetval > this.state.max) {
            //     this.setState({ value: this.state.min })
            // } else {
            //     this.setState({ value: targetval })
            // }
            if (this.props.value) {

                if (typeof this.props.value != "number") {
                    console.log("guage requires value of type number")
                    this.setState({ typeError: true })
                } else {
                    //ANIMATE GAUGE
                    if (this.state.valueanim != this.props.value) {
                        var difference = this.props.value - this.state.valueanim
                        var step = difference / 10;
                        var valueanim = this.state.valueanim + step;
                        this.setState({ valueanim: valueanim })
                    }
                }

                //SET VALUE
                if (this.state.value != this.props.value) {
                    this.setState({ value: parseFloat(this.props.value) })
                }
            }
        }, 1000 / 30)
    }

    componentWillUnmount() {
        clearInterval(this.animtimer);
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

        // console.log(start)
        // start_xy = this.polar_to_cartesian(x, y, radius, end_angle);
        // end_xy = this.polar_to_cartesian(x, y, radius, start_angle);
        return "M " + (start.x + center.x).toFixed(3) + " " + (start.y + center.y).toFixed(3) + " A " + radius + " " + radius + " 0 " + largeArcFlag + " 1 " + (end.x + center.x) + " " + (end.y + center.y);
    };

    degrees(degrees) {
        return ((Math.PI * 2) / 360) * degrees
    }

    drawguageSvg(min, value, max) {
        if (this.state.typeError) {
            return null;
        } else {
            var range = max - min;
            var valr = value - min;
            var ratio = valr / range;

            var graphdegree = ((180 + 35 + 35) * ratio) - 35
            return (<path className="value" fill="none" stroke="#0ff" strokeWidth="2.5" d={this.svg_arc_path(50, 50, 40, this.degrees(-35), this.degrees(graphdegree))}></path>)
        }

    }



    render() {
        // see https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d#Path_commands



        return (
            <div>
                {/* <Gauge value={this.props.value} width={150} height={125} topLabelStyle={{ display: "none" }} color="#fff" /> */}
                {/* <svg viewBox="0 0 100 100" className="gauge">
                    <path
                        className="dial"
                        fill="none"
                        stroke="#eee"
                        strokeWidth="2"
                        d="M 21.716 78.284 A 40 40 0 1 1 78.284 78.284"></path>
                    <text
                        x="50"
                        y="50"
                        fill="#999"
                        className="value-text"
                        fontSize="100%"
                        fontFamily="sans-serif"
                        fontWeight="normal"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        dominantBaseline="central">35</text>
                    <path className="value" fill="none" stroke="#666" strokeWidth="2.5" d="M 21.716 78.284 A 40 40 0 0 1 23.634 19.92"></path>
                </svg> */}
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
                        dominantBaseline="central">{this.state.value.toFixed(3)}</text>
                    <path className="value" fill="none" stroke="#666" strokeWidth="2.5" d={this.svg_arc_path(50, 50, 40, this.degrees(-35), this.degrees(180 + 35))}></path>
                    {this.drawguageSvg(-20, this.state.valueanim, 120)}
                </svg>
            </div >
        );
    }
};

