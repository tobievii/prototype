import React, { Component } from "react";
import moment from 'moment'

export class DeviceHistory extends React.Component {
    state = {
        logdata: [],
    }


    componentDidMount() {

        fetch("/api/v3/packets", {
            method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ log: true })
        }).then(response => response.json()).then(logdata => {
            this.setState({ logdata })
        }).catch(err => console.error(err.toString()));

    }

    render() {

        if (this.state.logdata) {
            var timeago = moment(this.state.logdata.timestamp).fromNow()
            var columSize = "110px"

            return (
                <div
                    label={"Logs"}
                    options={this.options}
                    dash={this.props.dash}
                >
                    {this.state.logdata.map(function (logdata, i) {
                        return ([

                            <div className="container-fluid" style={{ marginBottom: 2 }}>
                                <div className="row statesViewerItemMap">
                                    <div style={{ paddingLeft: "20px" }}>
                                        <h3 key={i}>{logdata.id}</h3>
                                        <div className="row dataPreview" style={{ flex: "0 0 " + columSize, textAlign: "right" }}>
                                            <div style={{ textSizeAdjust: "3", paddingRight: "10px" }} key={i}>{JSON.stringify(logdata.data)}</div>
                                        </div>
                                    </div>
                                    <div className="col" align="right" style={{ marginTop: "4px", paddingRight: 10 }}>
                                        <span style={{ fontSize: 12, color: "#fff" }}>{timeago}</span>
                                    </div>
                                </div>
                            </div>
                        ]);
                    })}
                </div>
            )
        } else {
            return (
                <div
                    label={"Logs"}
                    options={this.options}
                    dash={this.props.dash}
                >
                    No data to display
            </div>
            )
        }
    }
}