import React, { Component } from "react";

export class DeviceHistory extends React.Component {
    state = {
        logdata: []
    }

    lasttimestamp = "";

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
            return (<div label={"Logs"} options={this.options} dash={this.props.dash}>{JSON.stringify(this.state.logdata)}</div>)
        } else {
            return (<div label={"Logs"} options={this.options} dash={this.props.dash}>No data to display</div>)
        }
    }
}