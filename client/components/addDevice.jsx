import React, { Component } from "react";

import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: '50%',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: "none",
        // background: "rgba(23, 47, 64, 0.85)",
        background: "rgba(0, 0, 0, 0.1)",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        maxHeight: 'calc(100vh - 210px)',
        overflowY: 'auto',
        padding: "0"
    },
    //bacground of Pop up Modal on search
    overlay: {
        background: "rgba(23, 47, 64, 0.85)",
        zIndex: 1002
    }
};

export class AddDevice extends Component {

    state = {
        popupHeading: "ADD DEVICE BY:",
        popupHeadingPrev: "ADD DEVICE BY:",
        popupInfo: "default",
        popupInfoPrev: "default",
        devicesView: "dashboardDevices",
        ssid: "",
        wifipass: "",
        code: [],
        pairedDevices: [],
        bleDevices: []
    }

    constructor(props) {
        super(props);
    }

    // componentDidMount = () => {
    //     this.getPairedDevices();
    // }

    setView = (view) => {
        this.setState({ devicesView: view });
        this.props.mainView(view)
    }

    changeViews = (account) => {
        return (
            <div className="dropdown">
                <FontAwesomeIcon icon="eye" onClick={() => this.showDropdownMenu("views")} />
                {this.state.displayViews ? (
                    <div className="arrow-up">
                        <div className="dropdown-content" style={{ background: "#131e27", width: "max-content", left: "-1000%", marginTop: "45%" }}>
                            <div style={{ background: "#131e27", padding: "10px", opacity: "0.7" }}>
                                <div className="navLink" style={{ padding: "15px", fontSize: 15 }} onClick={() => this.setView("devices")}>
                                    <FontAwesomeIcon icon="tasks" />  DEVICES ONLY
                    </div>
                                <div className="navLink" style={{ padding: "15px", fontSize: 15 }} onClick={() => this.setView("dashboard")}>
                                    <FontAwesomeIcon icon="chart-bar" />   DASHBOARD ONLY
                    </div>
                                <div className="navLink" style={{ padding: "15px", fontSize: 15 }} onClick={() => this.setView("dashboardDevices")}>
                                    <FontAwesomeIcon icon="digital-tachograph" />  DASHBOARD WITH DEVICES
                    </div>
                            </div>
                        </div>
                    </div>
                ) :
                    (
                        null
                    )
                }
            </div>
        );
    }

    popupInfo = () => {
        if (this.state.popupInfo == "default") {
            return (
                <div >
                    <button className="commanderBgPanel commanderBgPanelClickable" style={{ width: "90%", marginBottom: 10, padding: "8px 0px" }} onClick={() => this.changePopup("ADD DEVICE BY TYPE", "type")}>TYPE</button>
                    <button className="commanderBgPanel commanderBgPanelClickable" style={{ width: "90%", marginBottom: 10, padding: "8px 0px" }} onClick={() => this.changePopup("ADD DEVICE BY CONFIG", "configuration")}>CONFIGURATION</button>
                    <button className="commanderBgPanel commanderBgPanelClickable" style={{ width: "90%", marginBottom: 10, padding: "8px 0px" }} onClick={() => this.changePopup("ADD DEVICE BY SERIAL NUMBER", "serial")}>SERIAL NUMBER</button>
                    <button className="commanderBgPanel commanderBgPanelClickable" style={{ width: "90%", marginBottom: 10, padding: "8px 0px" }} onClick={() => this.changePopup("ADD DEVICE BY TEMPORARY CODE", "temp_code")}>TEMPORARY CODE</button>
                </div>
            )
        } else if (this.state.popupInfo == "type") {
            return (
                <div style={{ width: "380px" }} align="center">
                    <select className="commanderBgPanel commanderBgPanelClickable" style={{ width: "90%", marginBottom: 10, padding: "8px 0px", textAlign: "center", color: "white" }} placeholder="000000000000">
                        <option unselectable="true">SELECT DEVICE</option>
                        <option>TELTONIKA</option>
                        <option>ESP32</option>
                        <option>ARDUINO UNO</option>
                    </select>
                    <button className="commanderBgPanel commanderBgPanelClickable" style={{ width: "40%", marginBottom: 10, padding: "8px 0px" }} onClick={() => { }}>ADD</button>
                </div>
            )
        } else if (this.state.popupInfo == "configuration") {
            return (
                <div style={{ width: "380px" }}>
                    <button className="commanderBgPanel commanderBgPanelClickable" style={{ width: "90%", marginBottom: 10, padding: "8px 0px" }} onClick={() => { this.changePopup("ADD DEVICE BY WIFI CONFIG", "wifi") }}>WIFI</button>
                    <button className="commanderBgPanel commanderBgPanelClickable" style={{ width: "90%", marginBottom: 10, padding: "8px 0px" }} onClick={() => { this.changePopup("ADD DEVICE BY BLUETOOTH CONFIG", "bluetooth") }}>BLUETOOTH</button>
                </div>
            )
        } else if (this.state.popupInfo == "wifi") {
            return (
                <div>
                    SSID      : <input className="commanderBgPanel commanderBgPanelClickable" style={{ width: "70%", marginLeft: 43, marginBottom: 10, padding: "7px 0px", textAlign: "left", color: "white" }} onChange={this.ssid("ssid")} placeholder="NETWORK NAME"></input><br /><br />
                    PASSWORD  : <input type="password" className="commanderBgPanel commanderBgPanelClickable" style={{ width: "70%", marginLeft: 8, marginBottom: 10, padding: "7px 0px", textAlign: "left", color: "white" }} onChange={this.wifiPassword("password")} placeholder="PASSWORD"></input><br /><br />
                    <button className="commanderBgPanel commanderBgPanelClickable" onClick={this.bits} style={{ width: "40%", marginBottom: 10, padding: "8px 0px" }} onClick={() => { this.bits() }}>ADD</button>
                </div>
            )
        } else if (this.state.popupInfo == "bluetooth") {
            return (
                <div >
                    <button className="commanderBgPanel commanderBgPanelClickable" style={{ width: "90%", marginBottom: 10, padding: "8px 0px" }} onClick={() => { this.changePopup("SCAN BLUETOOTH DEVICES", "scanBluetooth") }}>SCAN FOR DEVICE</button>
                    <button className="commanderBgPanel commanderBgPanelClickable" style={{ width: "90%", marginBottom: 10, padding: "8px 0px" }} onClick={() => { this.changePopup("SELECT BLUETOOTH", "selectBluetooth"); this.getPairedDevices() }}>SELECT BLUETOOTH DEVICE</button>
                </div>
            )
        } else if (this.state.popupInfo == "scanBluetooth") {
            return (
                <div align="left" style={{ textAlign: "left" }}>
                    {
                        this.getBLEDevices()
                    }
                    <br /><br />
                    <button className="commanderBgPanel commanderBgPanelClickable" style={{ width: "40%", marginBottom: 10, padding: "5px 0px" }} onClick={this.getBlutoothDevices}>
                        REFRESH <i className="fas fa-redo NavLink"></i>
                    </button>
                </div>
            )
        } else if (this.state.popupInfo == "selectBluetooth") {
            return (
                <div style={{ width: "380px" }} align="center">
                    <select className="commanderBgPanel commanderBgPanelClickable" style={{ width: "90%", marginBottom: 10, padding: "8px 0px", textAlign: "center", color: "white" }} placeholder="Select device">
                        <option unselectable="true">SELECT DEVICE</option>
                        {
                            this.state.pairedDevices.map((device) => {
                                return (
                                    <option key={device.address}>{device.name}</option>
                                )
                            })
                        }
                    </select>
                </div>
            )
        } else if (this.state.popupInfo == "serial") {
            return (
                <div style={{ width: "380px" }} align="center">
                    <input className="commanderBgPanel commanderBgPanelClickable" style={{ width: "90%", marginBottom: 10, padding: "8px 0px", textAlign: "center", color: "white" }} placeholder="0000-0000-0000"></input>
                    <button className="commanderBgPanel commanderBgPanelClickable" style={{ width: "40%", marginBottom: 10, padding: "8px 0px" }} onClick={() => { }}>ADD</button>
                </div>
            )
        } else if (this.state.popupInfo == "temp_code") {
            return (
                <div style={{ width: "380px" }} align="center">
                    <input className="commanderBgPanel commanderBgPanelClickable" style={{ width: "90%", marginBottom: 10, padding: "8px 0px", textAlign: "center", color: "white" }} placeholder="000000000000"></input>
                    <button className="commanderBgPanel commanderBgPanelClickable" style={{ width: "40%", marginBottom: 10, padding: "8px 0px" }} onClick={() => { }}>ADD</button>
                </div>
            )
        } else if (this.state.popupInfo == "scanDevices") {
            return (
                <div style={{ width: "380px" }} align="center">
                    <div className="commanderBgPanel ">
                        <span>Scanning</span><span style={{}} className="spinner-demo spinner-demo2"></span>
                    </div>
                </div>
            )
        } else if (this.state.popupHeading == "WIFI information") {
            return (
                <div align="center">
                    <div className="commanderBgPanel commanderBgPanelClickable" >{
                        this.state.code.map((user, i) => {
                            return <div id={user} key={i} className="commanderBgPanel" style={{ float: "center" }}>{user}</div>
                        })
                    }
                    </div>
                </div>
            )
        } else {
            return <div></div>
        }
    }

    getBLEDevices = () => {
        if (this.state.bleDevices.length < 1) {
            return (
                <h3>Scan for devices below...</h3>
            )
        } else {
            return (
                this.state.bleDevices.map((device) => {
                    return (
                        <div key={device.address} className="commanderBgPanel commanderBgPanelClickable" style={{ width: "100%", marginBottom: 10, padding: "8px 0px" }} onClick={() => { }}><i className="fas fa-laptop"></i>  {device.name}</div>
                    )
                })
            )
        }
    }

    getBlutoothDevices = () => {
        this.changePopup("SCAN BLUETOOTH DEVICES", "scanDevices");
        fetch("/api/v3/scanbluetoothDevices", {
            method: "GET", headers: { "Accept": "application/json", "Content-Type": "application/json" },
        }).then(response => response.json()).then(resp => {
            this.setState({ bleDevices: resp })
            this.changePopup("SCAN BLUETOOTH DEVICES", "scanBluetooth");
        }).catch(err => {
            console.error(err.toString())
            this.changePopup("SCAN BLUETOOTH DEVICES", "scanBluetooth");
        });
    }

    getPairedDevices = () => {
        this.changePopup("SCAN BLUETOOTH DEVICES", "scanDevices");
        fetch("/api/v3/getPairedDevices", {
            method: "GET", headers: { "Accept": "application/json", "Content-Type": "application/json" },
        }).then(response => response.json()).then(resp => {
            this.setState({ pairedDevices: resp })
            this.changePopup("SELECT BLUETOOTH", "selectBluetooth")
        }).catch(err => {
            console.error(err.toString())
            this.changePopup("SELECT BLUETOOTH", "selectBluetooth")
        });
    }


    goBack = () => {
        this.setState({ popupHeading: this.state.popupHeadingPrev }, () => {
            this.setState({ popupInfo: this.state.popupInfoPrev });
        })
    }

    changePopup = (heading, info) => {
        // commenting this out till setSteps are uncovered. 
        // this.setState({ popupHeadingPrev: this.state.popupHeading }, () => {
        //     this.setState({ popupInfoPrev: this.state.popupInfo });
        // })
        this.setState({ popupHeading: heading }, () => {
            this.setState({ popupInfo: info });
        })
    }

    ssid = (ssid) => {
        return (evt) => {
            this.setState({ ssid: evt.target.value })
        }
    }

    wifiPassword = (wifipass) => {
        return (evt) => {
            this.setState({ wifipass: evt.target.value })
        }
    }

    bits = () => {
        var data = Buffer.from(JSON.stringify({ wifi: { ssid: this.state.ssid, pass: this.state.wifipass } }))

        for (var a = 0; a < data.length; a++) {
            var byte = data[a].toString(2)
            for (var b = 0; b <= 8 - byte.length; b++) {
                byte = "0" + byte;
            }
            this.state.code.push(byte)
        }
        this.changePopup("WIFI information", this.state.code);
    }

    render() {
        return (
            <div >
                <center>
                    <Modal style={customStyles} isOpen={this.props.isOpen} onRequestClose={this.toggle}>
                        <div style={{ background: "#131e27", padding: 12, width: "100%" }}>
                            <span className={"fas fa-times navLink cross"} onClick={() => { this.props.closeModel() }} style={{ paddingRight: 10, float: "right" }}></span>
                            <span className={"fas fa-arrow-circle-left navLink"} onClick={() => { this.goBack() }} style={{}}></span>
                            <span style={{ float: "right", marginRight: "40%" }}>{this.state.popupHeading}</span>
                        </div>
                        <center>
                            <div className='protoPopup'>
                                {this.popupInfo()}
                            </div>
                        </center>
                    </Modal>
                </center>
            </div >
        )
    }
}