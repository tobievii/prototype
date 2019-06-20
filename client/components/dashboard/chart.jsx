import React, { Component } from 'react'
import { Widget } from "./widget.jsx"
import ReactApexChart from "react-apexcharts"

export class LineChart extends React.Component {
    dates = [];

    constructor(props) {
        super(props);

        this.state = {
            options: {
                chart: {
                    stacked: false,
                    zoom: {
                        type: 'x',
                        enabled: true
                    },
                    toolbar: {
                        autoSelected: 'zoom'
                    }
                },
                plotOptions: {
                    line: {
                        curve: 'smooth',
                    }
                },
                dataLabels: {
                    enabled: false
                },

                markers: {
                    size: 0,
                    style: 'full',
                },
                colors: ['#24e079'],
                // title: {
                //     text: 'Stock Price Movement',
                //     align: 'left'
                // },
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
                    // title: {
                    //     text: 'Price'
                    // },
                },
                xaxis: {
                    type: 'datetime',
                    // title: {
                    //     text: 'HEllo'
                    // }
                },

                tooltip: {
                    shared: true,
                }
            },
            series: undefined
        }
    }

    componentWillMount = () => {
        this.getdata();
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
            for (var date in result) {
                // if (date == 0) {
                //     console.log(result[date])
                //     console.log("" + parseInt(result[date].x.substr(0, 4)) + "." + result[date].x.substr(5, 2) + "." + parseInt(result[date].x.substr(8, 2)))
                // }
                if (result[date].y == true) {
                    result[date].y = 1;
                } else if (result[date].y == false) {
                    result[date].y = 0;
                }

                var f = {
                    x: parseInt((new Date("" + parseInt(result[date].x.substr(0, 4)) + "." + result[date].x.substr(5, 2) + "." + parseInt(result[date].x.substr(8, 2))).getTime())),
                    y: parseInt(result[date].y).toFixed(0)
                }
                var innerArr = [f.x, f.y];
                this.dates.push(innerArr)
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
            return (
                <div>
                    <Widget label={this.props.data.dataname} dash={this.props.dash}>
                        <div id="chartz">
                            <ReactApexChart options={this.state.options} series={this.state.series} type="area" />
                        </div>
                    </Widget>
                </div>
            );

        } else {
            return null;
        }
    }
}