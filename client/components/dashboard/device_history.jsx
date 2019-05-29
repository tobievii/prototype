import React, { Component } from "react";
import moment from 'moment'
import socketio from "socket.io-client";
export class DeviceHistory extends React.Component {
    state = {
        logdata: [],
    }
    // socket = undefined;

    // constructor(props) {
    //     super(props)
    //     this.socket = socketio({ transports: ['websocket', 'polling'] });
    //     this.socket.on("connect", a => {
    //         this.socket.emit("join", this.props.username)
    //         fetch("/api/v3/packets", {
    //             method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
    //             body: JSON.stringify({ log: true })
    //         }).then(response => response.json()).then(logdata => {
    //             this.setState({ logdata })
    //         }).catch(err => console.error(err.toString()));
    //         this.socket.on("post", (logdata) => {
    //             this.handleDevicePacket(logdata)
    //         })
    //     })
    // }

    // handleDevicePacket = (packet) => {
    //     var devices = _.clone(this.state.devicesServer)
    //     var found = 0;
    //     for (var dev in devices) {
    //         if (devices[dev].devid == packet.id) {
    //             found = 1;
    //             devices[dev]["_last_seen"] = packet.timestamp;
    //             devices[dev].payload = _.merge(devices[dev].payload, packet)
    //         } else if (devices[dev].devid == packet.devid) {
    //             if (packet.boundaryLayer != undefined) {
    //                 found = 1;
    //                 devices[dev]["_last_seen"] = packet._last_seen;
    //                 devices[dev].payload.timestamp = packet._last_seen;
    //                 devices[dev].boundaryLayer = packet.boundaryLayer;
    //             } else {
    //                 found = 1;
    //                 devices[dev]["_last_seen"] = packet._last_seen;
    //                 devices[dev].payload.timestamp = packet._last_seen;
    //                 packet.selectedIcon = true;
    //                 devices[dev] = _.merge(devices[dev].boundaryLayer, packet);
    //             }
    //         }
    //     }

    //     if (found == 0) {
    //         // console.log("recieved data for device not on our list yet.")
    //     } else {
    //         // update
    //         if (this.state.search.length > 0) {
    //             this.setState({ devicesServer: devices })
    //         } else {
    //             this.setState({ devicesServer: devices })
    //             this.setState({ devicesView: devices }, () => {
    //             })
    //             //this.sort();
    //         }
    //     }
    // }


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
            var columSize = "110px"

            return (
                <div
                    label={"Logs"}
                    options={this.options}
                    dash={this.props.dash}
                    style={{ height: "100%", overflowY: "scroll" }}
                >
                    {this.state.logdata.map(function (logdata, i) {
                        var timeago = moment(logdata.timestamp).fromNow()
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
                    })
                    }
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