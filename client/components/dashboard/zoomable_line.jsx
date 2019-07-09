import React, { Component } from 'react'
import { Widget } from "./widget.jsx"
import ReactApexChart from "react-apexcharts"

export class LineChart extends React.Component {
    dates = [];
    lasttimestamp = "";
    final = false;

    state = {
        color: "#111111",
        background: "#11cc88",
        hourly: JSON.stringify({ "hourly": false }),
        daily: JSON.stringify({ "daily": false }),
        monthly: JSON.stringify({ "monthly": false }),
    }

    options;

    setOptions = (options) => {
        this.setState(_.merge(this.state, options), () => {
            this.updatedOptions();
        })
        this.props.dash.setOptions(options);
    }

    constructor(props) {
        super(props);

        this.state = {
            options: {
                zoomable_line: {
                    stacked: true,
                    zoom: {
                        type: 'x',
                        enabled: true
                    },
                    toolbar: {
                        autoSelected: 'zoom'
                    }
                },
                chart: {
                    animations: {
                        enabled: true,
                        easing: 'easeinout',
                        speed: 800,
                        animateGradually: {
                            enabled: true,
                            delay: 150
                        },
                        dynamicAnimation: {
                            enabled: true,
                            speed: 350
                        }
                    }
                },
                stroke: {
                    show: true,
                    curve: 'smooth',
                    lineCap: 'butt',
                    colors: undefined,
                    width: 1,
                    dashArray: 0,
                },
                dataLabels: {
                    enabled: false
                },
                grid: {
                    show: true,
                    borderColor: 'rgba(169,169,169, 0.2)',
                    strokeDashArray: 0,
                    position: 'back',
                    xaxis: {
                        opacity: 0.15,
                        lines: {
                            show: true
                        }
                    },
                    yaxis: {
                        opacity: 0.15,
                        lines: {
                            show: true
                        }
                    },
                    padding: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    },
                },
                markers: {
                    size: 0,
                    style: 'full',
                },
                colors: ['#24e079'],
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        inverseColors: false,
                        opacityFrom: 0.5,
                        opacityTo: 0,
                        stops: [0, 90, 100]
                    },
                },
                yaxis: {
                    title: {
                        text: this.props.datapath
                    },
                },
                xaxis: {
                    type: 'datetime',
                    title: {
                        text: 'date'
                    },
                },

                tooltip: {
                    shared: true,
                }
            },
            series: undefined
        }
    }

    updatedOptions = () => {
        var options = [
            { name: "hourly", type: "radio", value: this.state.hourly },
            { name: "daily", type: "radio", value: this.state.daily },
            { name: "monthly", type: "radio", value: this.state.monthly },
        ]
        this.options = options;
    }

    componentDidMount() {
        if (this.props.data.options) {
            this.setState(_.merge(this.state, this.props.data.options));
        }
        this.updatedOptions();
    }

    // onClick = () => {
    //     //console.log(this.props)
    //     fetch("/api/v3/data/post", {
    //         method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
    //         body: JSON.stringify({ id: this.props.state.devid, data: JSON.parse(this.state.command) })
    //     }).then(response => response.json()).then(resp => {
    //         // console.log(resp);
    //     }).catch(err => console.error(err.toString()));
    // }

    componentWillMount = () => {
        this.getdata();
    }

    componentDidUpdate() {
        if (_.has(this, "props.state.payload." + this.props.datapath)) {
            if (this.props.state.payload.timestamp != this.lasttimestamp) {
                if (this.state.series) {
                    this.getdata();
                }
                this.lasttimestamp = this.props.state.payload.timestamp;
            }
        }
    }

    async getdata() {
        await fetch("/api/v3/packets", {
            method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify(
                {
                    key: this.props.state.key,
                    datapath: this.props.datapath
                }
            )
        }).then(response => response.json()).then(result => {
            this.dates = [];
            var verify = [];

            if (this.result == this.state.hourly) {// || this.state.getdata == this.state.daily || this.state.getdata == this.state.monthly) {
                if (result.length == 0) {
                    this.dates.push([{ String: true }]);
                } else {

                    for (var date in result) {
                        var f = {
                            x: new Date(result[date].x),
                            y: parseInt(result[date].y).toFixed(0)
                        }
                        if (this.result == this.state.daily) {
                            if (result.length == 0) {
                                this.dates.push([{ String: true }]);
                            } else {

                                for (var date in result) {
                                    var f = {
                                        x: parseInt((new Date("" + parseInt(result[date].x.substr(0, 4)) + "." + result[date].x.substr(5, 2) + "." + parseInt(result[date].x.substr(8, 2))).getTime())),
                                        y: parseInt(result[date].y).toFixed(0)
                                    }
                                }
                            }
                        }
                        if (this.result == this.state.monthly) {
                            if (result.length == 0) {
                                this.dates.push([{ String: true }]);
                            } else {

                                for (var date in result) {
                                    var f = {
                                        //x: new Date(result[date].x),
                                        //y: parseInt(result[date].y).toFixed(0)
                                    }
                                }
                            }
                        }


                        if (!Number.isNaN(parseInt(result[date].y))) {
                            // if (date == 0) {
                            //     console.log(result[date])
                            //     console.log("" + parseInt(result[date].x.substr(0, 4)) + "." + result[date].x.substr(5, 2) + "." + parseInt(result[date].x.substr(8, 2)))
                            // }

                            if (typeof result[date].y == "string") {
                                if (typeof parseInt(result[date].y) == "number") {
                                    this.dates.push([f.x, parseInt(f.y)]);
                                }
                                verify.push(false);
                            } else {
                                verify.push(true);
                                if (result[date].y == true) {
                                    result[date].y = 1;
                                } else if (result[date].y == false) {
                                    result[date].y = 0;
                                }
                                var innerArr = [f.x, f.y];
                                this.dates.push(innerArr)
                            }
                        } else {
                            verify.push(true);
                            if (result[date].y == true) {
                                f.y = 1;
                            } else if (result[date].y == false) {
                                f.y = 0;
                            }
                            var innerArr = [f.x, f.y];
                            this.dates.push(innerArr)
                        }
                    }
                }

                for (var n in verify) {
                    if (verify[n] == true) {
                        this.final = true;
                    }
                }
            }

            this.setState({
                series: [{
                    name: this.props.datapath,
                    data: this.dates
                }]
            });
        }).catch(err => console.error(err.toString()));
    }

    render() {
        if (this.state.series != null) {
            if ((this.state.series[0].data[0].String && this.final == false) || this.state.series[0].data[0].length == 0) {
                return <Widget label={this.props.data.dataname} options={this.options} dash={this.props.dash} setOptions={this.setOptions}><div>This widget doesn't use strings</div></Widget>
            } else {
                return (
                    <div>
                        <Widget label={this.props.data.dataname} options={this.options} dash={this.props.dash} setOptions={this.setOptions}>
                            <div id="chartz">
                                <ReactApexChart options={this.state.options} series={this.state.series} type="area" />
                            </div>
                        </Widget>
                    </div>
                )
            }
        } else {
            return null;
        }
    }
}