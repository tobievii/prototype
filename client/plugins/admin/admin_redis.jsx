import React, { Component } from "react";

export class Redis extends React.Component {
    state = {
        redisEnable: false,
        host: "host",
        port: "port",
        AuthPass: ""
    }

    componentWillMount = () => {
        fetch("/api/v3/admin/redis", { method: "GET", headers: { "Accept": "application/json", "Content-Type": "application/json" } }).then(response => response.json()).then(data => {
            if (data.err) { }
            if (data.result) {
                this.setState(data.result)
            }
        }).catch(err => console.error(err.toString()));
    }

    checkBox = (flag) => {
        return evt => {
            var newState = {}
            newState[flag] = !this.state[flag]
            this.setState(newState);
        }
    }

    handleFormChange = id => {
        return evt => {
            var newsetting = {}
            newsetting[id] = evt.target.value
            this.setState(newsetting)
        }
    }

    updateOptions = () => {
        fetch("/api/v3/admin/redis", {
            method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify(this.state)
        }).then(response => response.json()).then(data => {
        }).catch(err => console.error(err.toString()));
    }

    setupRedis = () => {
        if (this.state.redisEnable) {
            return (<div className="adminBlocksSub">
                <FormInput label="host" value={this.state.host} onChange={this.handleFormChange("host")} />
                <FormInput label="port" value={this.state.port} onChange={this.handleFormChange("port")} />
                <FormInput label="auth pass" value={this.state.AuthPass} onChange={this.handleFormChange("AuthPass")} />
                <div style={{ clear: "both" }} />
            </div>)
        } else {
            return null;
        }

    }

    redisCheckBox = () => {
        if (this.state.redisEnable == true) {
            return (
                <i className="fas fa-check-square"
                    checked={this.state.redisEnable}
                    onClick={this.checkBox("redisEnable")} />
            )
        }
        else if (this.state.redisEnable == false) {
            return (
                <i className="far fa-square"
                    checked={this.state.redisEnable}
                    onClick={this.checkBox("redisEnable")} />
            )
        }
    }

    render() {
        if (this.props.level >= 100) {
            return (
                <div className="adminBlocks" >
                    <div><h4>REDIS</h4></div>
                    <div>{this.redisCheckBox()} Enable Redis</div>
                    {this.setupRedis()}
                    <button className="btn-spot" style={{ float: "right", marginTop: 10 }} onClick={this.updateOptions} >APPLY</button>
                    <div style={{ clear: "both" }} />
                </div>
            )
        } else {
            return null;
        }
    }

}


export class FormInput extends React.Component {
    render() {
        return (
            <div className="row" style={{ marginBottom: 3 }}>
                <div className="col-3" style={{ textAlign: "right", paddingTop: 10 }}  >{this.props.label}:</div>
                <div className="col-9">
                    <input style={{ width: "100%" }} value={this.props.value} spellCheck="false" onChange={this.props.onChange} />
                </div>
            </div>
        )
    }
}
