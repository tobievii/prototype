import React, { Component } from "react";
import Modal from 'react-modal';
import { CodeBlock } from "./codeBlock.jsx"
import { ShareList } from './ShareList.jsx'
import Media from "react-media";
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: '50%',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: "none",
        backgroundColor: "rgba(0, 0, 0, 0.0)",
        maxHeight: 'calc(100vh - 210px)',
        overflowY: 'auto',
        padding: "0",
        width: "50%",
        height: "85%"
    },

    overlay: {
        background: "rgba(23, 47, 64, 0.85)",
        zIndex: 1002
    }
};

const customStylesMobile = {
    content: {
        top: '50%',
        left: '50%',
        right: '50%',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: "none",
        backgroundColor: "rgba(0, 0, 0, 0.0)",
        maxHeight: 'calc(100vh - 210px)',
        overflowY: 'auto',
        padding: "0",
        width: "100%",
        height: "85%"
    },

    overlay: {
        background: "rgba(23, 47, 64, 0.85)",
        zIndex: 1002
    }
};

export default class ModifyDevices extends Component {
    state = {
        mulitipleSelecmessage: "",
        serverGateways: [],
        preview: "",
        search: "",
        confirmation: ""
    }

    componentWillMount = () => {
        this.getgateways();
    }

    search = evt => {
        this.setState({ search: evt.target.value.toString() })
    }

    generateDifficult(count) {
        var _sym = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
        var str = '';
        for (var i = 0; i < count; i++) {
            var tmp = _sym[Math.round(Math.random() * (_sym.length - 1))];
            str += "" + tmp;
        }
        return str;
    }

    modification = () => {
        return (
            <div>  <div className="container-fluid" style={{ background: "#16202C" }}>
                <div className="row">
                    <div className="col" style={{ textAlign: "center", opacity: 0.8, padding: "7px", paddingBottom: "5px", fontSize: "18px" }}>{this.props.modification}</div>
                    <div className="col fas fa-times cross" style={{ flex: "0 0 40px", padding: "10px 8px 0px 12px", fontSize: "20px" }} onClick={() => { this.props.closeModel(); if (this.props.account.level > 0) { this.setState({ popupInfo: "default" }); } /*this.setState({ popupHeading: "ADD DEVICE" })*/ }}></div>
                </div>
            </div>
                <div style={{ color: "rgba(174, 231, 241, 0.55)" }}>
                    <div style={{ background: "#0E1A26", padding: "10px 30px" }}>
                        {this.props.modificationinfo}
                    </div>
                    {this.popupInfo()}
                </div>
                <div style={{ background: "#0E1A26", padding: "15px 30px", color: "rgba(174, 231, 241, 0.55)", textAlign: "right" }}>
                    Need help? Please contact our <span style={{ color: "red", opacity: 0.7 }}><a href="#">support</a></span>
                </div></div>
        );
    }
    getgateways = () => {
        fetch('/api/v3/iotnxt/gateways').then(response => response.json()).then((gateways) => {
            var finalGateways = [];
            if (gateways) {
                for (var g in gateways) {
                    if (gateways[g]._created_by) {
                        if (gateways[g]._created_by.publickey == this.props.account.publickey || gateways[g]._created_by == undefined || this.props.account.level >= 100) {
                            finalGateways.push(gateways[g])
                        }
                    } else if (this.props.account.level >= 100 || gateways[g]._created_by == undefined) {
                        finalGateways.push(gateways[g])
                    }

                    if (gateways[g].default) {
                        this.setState({ serverGatewayDefault: gateways[g] });
                    }
                }
                this.setState({ serverGateways: finalGateways });
            }
        }).catch(err => console.error(this.props.url, err.toString()))
    }

    options = () => {
        if (this.props.modification == "SET IOTNXT GATEWAY") {
            return (this.state.serverGateways.map(devices => <option key={devices.GatewayId} value={devices.GatewayId + "|" + devices.HostAddress} className="optiondropdown" style={{ width: "90%" }} >{devices.GatewayId + "|" + devices.HostAddress}</option>))
        }

        else if (this.props.modification == "SCRIPT PRESET") {
            var temp = this.props.devices.filter((users) => { return users.workflowCode !== undefined })
            return (temp.map(devices => <option key={devices.devid} value={devices.devid} className="optiondropdown" style={{ width: "90%" }} >{devices.devid}</option>))

        }
        else if (this.props.modification == "DASHBOARD PRESET") {
            var temp = this.props.devices.filter((users) => { return users.layout !== undefined })
            return (temp.map(devices => <option key={devices.devid} value={devices.devid} className="optiondropdown" style={{ width: "90%" }} >{devices.devid}</option>))
        }
    }

    modificationPreview = () => {
        if (this.props.modification == "SCRIPT PRESET") {
            for (var i in this.props.devices) {
                if (this.state.search == this.props.devices[i].devid) {
                    return (
                        <div ><CodeBlock type={"modify"} language='javascript' value={this.props.devices[i].workflowCode} /></div>)
                }
            }
        }
    }

    assignModify = () => {
        var devices = this.props.devices.filter((device) => { return device.selected == true; })
        if (this.props.modification == "SET IOTNXT GATEWAY") {
            var GatewayId = this.state.search.split("|")[0]
            var HostAddress = this.state.search.split("|")[1]
            for (var i in this.state.serverGateways) {
                if (GatewayId == this.state.serverGateways[i].GatewayId && HostAddress == this.state.serverGateways[i].HostAddress) {
                    var devices = this.props.devices.filter((device) => { return device.selected == true; })
                    for (var i in devices) {
                        fetch('/api/v3/iotnxt/setgatewaydevice', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                key: devices[i].key,
                                id: devices[i].devid,
                                GatewayId: GatewayId,
                                HostAddress: HostAddress
                            })
                        }).then(response => response.json()).then((data) => {
                            if (data.nModified == 1) {
                                this.setState({ confirmation: "Gateway Successfully Modified" })
                                this.props.closeModel()
                            }
                            else {
                                this.setState({ confirmation: "Could not modify Gateway" })
                            }
                        }).catch(err => console.error(this.props.url, err.toString()))
                    }
                }
                else {
                    null;
                }
            }
        }

        else if (this.props.modification == "SCRIPT PRESET") {
            for (var dev in this.props.devices) {
                if (this.state.search == this.props.devices[dev].devid) {
                    for (var i in devices) {
                        if (this.props.devices[dev].devid != devices[i].devid) {
                            fetch("/api/v3/workflow", {
                                method: "POST",
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({ id: devices[i].devid, code: this.props.devices[dev].workflowCode })
                            })
                                .then(response => response.json()).then(serverresponse => {
                                    if (serverresponse.result == "success") {
                                        this.setState({ confirmation: "Workflow script code Successfully Modified" })
                                        this.props.closeModel()
                                    }
                                    else {
                                        this.setState({ confirmation: "Could not modify Workflow script code" })
                                    }
                                }).catch(err => console.error(err.toString()));
                        }
                        else { null }
                    }
                }
                else { null; }
            }
        }

        else if (this.props.modification == "DASHBOARD PRESET") {
            for (var dev in this.props.devices) {
                if (this.state.search == this.props.devices[dev].devid) {
                    for (var r in devices) {
                        if (this.props.devices[dev].devid != devices[r].devid) {
                            var dashboard = _.clone(this.props.devices[dev].layout)
                            for (var l in dashboard) {
                                if (dashboard[l].i !== "0") {
                                    dashboard[l].i = this.generateDifficult(32)
                                }
                                else { null }
                            }
                            for (var d in devices[r].layout) {
                                if (devices[r].layout[d].i !== "0") {
                                    dashboard.push(devices[r].layout[d])
                                }
                                else { null }
                            }

                            fetch("/api/v3/dashboard", {
                                method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                                body: JSON.stringify({ key: devices[r].key, layout: dashboard })
                            }).then(response => response.json()).then(result => {
                                if (result.nModified == 1) {
                                    this.setState({ confirmation: "Dashboard preset Successfully Modified" })
                                    this.props.closeModel()
                                }
                                else {
                                    this.setState({ confirmation: "Could not modify Dashboard preset" })
                                }
                            }).catch(err => {
                                console.error(err.toString())
                                if (cb) { cb(err, undefined); }
                            });
                        }
                        else { null }
                    }
                }
                else { null }
            }
        }
    }

    popupInfo = () => {
        return (
            <Media query="(max-width: 599px)">
                {matches =>
                    matches ? (
                        <div className="container-fluid" style={{ background: "#16202C", padding: "10px 30px" }}>
                            {this.modificationPreview()}
                            <div>
                                Search for your device or gateway :
                </div>
                            <div className="row addDevice">
                                <div className="col" style={{ padding: "12px 10px 0px 0px", cursor: "pointer", textAlign: "center" }}>
                                    <i className="fas fa-search" style={{ fontSize: "22px" }}></i>
                                </div>
                                <div className="col" style={{ padding: "3px 0px 0px 0px", cursor: "pointer", width: "80%" }}>
                                    <select style={{ width: "100%", padding: "8px 8px", color: "white" }} onChange={this.search} defaultValue={'DEFAULT'}>
                                        <option value='DEFAULT' style={{ color: "gray" }} disabled>Select option...</option>
                                        {this.options()}
                                    </select>
                                </div>
                                <div className="row" style={{ cursor: "pointer", cursor: "not-allowed" }}>
                                    <a className="commanderBgPanel commanderBgPanelClickable sucess" style={{ width: "100%", marginBottom: 10, marginTop: 3, fontSize: "13px" }} onClick={this.assignModify}>
                                        ASSIGN <i className="fas fa-chevron-right"></i>
                                    </a>
                                </div>
                            </div>
                            <div style={{ color: "red" }}>{this.state.confirmation}</div>
                        </div >
                    ) : (
                            <div className="container-fluid" style={{ background: "#16202C", padding: "10px 30px" }}>
                                {this.modificationPreview()}
                                <div>
                                    Search for your device or gateway :
            </div>
                                <div className="row addDevice">
                                    <div className="col" style={{ padding: "12px 10px 0px 0px", cursor: "pointer", textAlign: "center" }}>
                                        <i className="fas fa-search" style={{ fontSize: "22px" }}></i>
                                    </div>

                                    <div className="col" style={{ padding: "3px 0px 0px 0px", cursor: "pointer" }}>
                                        <select style={{ width: "60%", padding: "8px 8px", color: "white" }} onChange={this.search} defaultValue={'DEFAULT'}>
                                            <option value='DEFAULT' style={{ color: "gray" }} disabled>Select option...</option>
                                            {this.options()}
                                        </select>
                                    </div>
                                    <div className="col" style={{ padding: 0, cursor: "pointer", cursor: "not-allowed" }}>
                                        <a className="commanderBgPanel commanderBgPanelClickable sucess" style={{ width: "100%", marginBottom: 10, marginTop: 3, fontSize: "19px" }} onClick={this.assignModify}>
                                            ASSIGN <i className="fas fa-chevron-right"></i>
                                        </a>
                                    </div>
                                </div>
                                <div style={{ color: "red" }}>{this.state.confirmation}</div>
                            </div >
                        )
                }
            </Media>
        )
    }

    render() {
        return (
            <div >
                <center>
                    <Media query="(max-width: 599px)">
                        {matches =>
                            matches ? (
                                <Modal style={customStylesMobile} isOpen={this.props.isOpen}>
                                    {this.modification()}
                                </Modal>
                            ) : (
                                    <Modal style={customStyles} isOpen={this.props.isOpen}>
                                        {this.modification()}
                                    </Modal>
                                )
                        }
                    </Media>
                    <ShareList account={this.props.account} isOpen={this.props.isOpenshare} username={this.props.username} closeModel={this.props.closeModel} type={"multi"} chosen={this.props.devices.filter((device) => { return device.selected == true })} />
                </center>
            </div >
        )
    }
}