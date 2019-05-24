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
        padding: "0",
        width: "765px",
        height: "470px"
    },
    //bacground of Pop up Modal on search
    overlay: {
        background: "rgba(23, 47, 64, 0.85)",
        zIndex: 1002
    }
};

export default class AddDevice extends Component {

    state = {
        popupHeading: "ADD DEVICE BY",
        popupInfo: "default",
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

    orOption = () => {
        if (this.state.popupInfo == "default") {
            return (
                <div style={{ background: "#0E1A26", padding: "10px 30px", fontSize: "25px", textAlign: "center" }}>
                    OR
            </div>
            )
        } else {
            return null
        }
    }

    addDevice = () => {
        if (this.props.account.level < 1) {
            this.setState({ popupInfo: "public" })
        } else if (this.state.search == "Efento") {
            this.setState({ popupInfo: "Efento" })
        } else {
            return null;
        }
    }

    search = evt => {
        this.setState({ search: evt.target.value.toString() })
    }

    popupInfo = () => {
        if (this.state.popupInfo == "default") {
            return (
                <div className="container-fluid" style={{ background: "#16202C", padding: "10px 30px" }}>
                    <div style={{}}>
                        Search for your device, service and/or protocol:
                </div>
                    <div className="row addDevice">
                        <div className="col" style={{ padding: "12px 10px 0px 0px", cursor: "pointer", textAlign: "center" }}>
                            <i className="fas fa-search" style={{ fontSize: "22px" }}></i>
                        </div>

                        <div className="col" style={{ padding: "3px 0px 0px 0px", cursor: "pointer" }}>
                            <input list="devices" className="commanderBgPanel commanderBgPanelClickable" style={{ width: "60%", padding: "8px 8px", color: "white" }} onChange={this.search} placeholder="Type to filter options" />
                            <datalist id="devices">
                                <option value="Arduino (Serialport)" className="commanderBgPanel commanderBgPanelClickable" style={{ width: "90%" }} />
                                <option value="ESP32 (Wifi + MQTT)" className="commanderBgPanel commanderBgPanelClickable" style={{ width: "90%" }} />
                                <option value="IoT.nxt raptor" className="commanderBgPanel commanderBgPanelClickable" style={{ width: "90%" }} />
                                <option value="Teltonika" className="commanderBgPanel commanderBgPanelClickable" style={{ width: "90%" }} />
                                <option value="Efento" className="commanderBgPanel commanderBgPanelClickable" style={{ width: "90%" }} />
                            </datalist>
                        </div>

                        <div className="col" style={{ padding: 0, cursor: "pointer" }}>
                            <button className="commanderBgPanel commanderBgPanelClickable sucess" style={{ width: "100%", marginBottom: 10, marginTop: 3, fontSize: "19px" }} onClick={() => { this.addDevice() }}>
                                NEXT <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>

                    </div>

                </div>
            )
        } else if (this.state.popupInfo == "public") {
            return (
                <div style={{ height: "190px" }} align="center">
                    <div style={{ width: "100%", marginBottom: 10, marginTop: 100, padding: "8px 0px", textAlign: "center", color: "white" }}>
                        Please login/register above to be able to add a device.
                    </div>
                    <button className="commanderBgPanel commanderBgPanelClickable" style={{ width: "100px", marginBottom: 10, padding: "8px 0px", marginRight: 5 }} onClick={() => { this.props.login() }}>LOGIN</button>
                    <button className="commanderBgPanel commanderBgPanelClickable" style={{ width: "100px", marginBottom: 10, padding: "8px 0px" }} onClick={() => { this.props.register() }}>REGISTER</button>
                </div>
            )
        } else if (this.state.popupInfo == "Efento") {

            return (
                <div style={{ width: "190px", paddingLeft: "20px", paddingBottom: "20px" }}>
                    <br></br>
                    <h5>Efento</h5>
                    <br></br>
                    API Key:
                    <br></br>
                    {this.props.account.apikey}
                    <br></br>
                    <br></br>
                    Port:
                    <br></br>
                    5618
                    <br></br>
                </div>
            )
        }

        // else if (this.state.popupInfo == "type") {
        //     return (
        //         <div style={{ width: "380px" }} align="center">
        //             <select className="commanderBgPanel commanderBgPanelClickable" style={{ width: "90%", marginBottom: 10, padding: "8px 0px", textAlign: "center", color: "white" }} placeholder="000000000000">
        //                 <option unselectable="true">SELECT DEVICE</option>
        //                 <option>TELTONIKA</option>
        //                 <option>ESP32</option>
        //                 <option>ARDUINO UNO</option>
        //             </select>
        //             <button className="commanderBgPanel commanderBgPanelClickable" style={{ width: "40%", marginBottom: 10, padding: "8px 0px" }} onClick={() => { }}>ADD</button>
        //         </div>
        //     )
        // } else if (this.state.popupInfo == "configuration") {
        //     return (
        //         <div style={{ width: "380px" }}>
        //             <button className="commanderBgPanel commanderBgPanelClickable" style={{ width: "90%", marginBottom: 10, padding: "8px 0px" }} onClick={() => { this.changePopup("ADD DEVICE BY WIFI CONFIG", "wifi") }}>WIFI</button>
        //             <button className="commanderBgPanel commanderBgPanelClickable" style={{ width: "90%", marginBottom: 10, padding: "8px 0px" }} onClick={() => { this.changePopup("ADD DEVICE BY BLUETOOTH CONFIG", "bluetooth") }}>BLUETOOTH</button>
        //         </div>
        //     )
        // } else if (this.state.popupInfo == "wifi") {
        //     return (
        //         <div>
        //             SSID      : <input className="commanderBgPanel commanderBgPanelClickable" style={{ width: "70%", marginLeft: 43, marginBottom: 10, padding: "7px 0px", textAlign: "left", color: "white" }} onChange={this.ssid("ssid")} placeholder="NETWORK NAME"></input><br /><br />
        //             PASSWORD  : <input type="password" className="commanderBgPanel commanderBgPanelClickable" style={{ width: "70%", marginLeft: 8, marginBottom: 10, padding: "7px 0px", textAlign: "left", color: "white" }} onChange={this.wifiPassword("password")} placeholder="PASSWORD"></input><br /><br />
        //             <button className="commanderBgPanel commanderBgPanelClickable" onClick={this.bits} style={{ width: "40%", marginBottom: 10, padding: "8px 0px" }} onClick={() => { this.bits() }}>ADD</button>
        //         </div>
        //     )
        // } else if (this.state.popupInfo == "bluetooth") {
        //     return (
        //         <div >
        //             <button className="commanderBgPanel commanderBgPanelClickable" style={{ width: "90%", marginBottom: 10, padding: "8px 0px" }} onClick={() => { this.changePopup("SCAN BLE DEVICES", "scanBluetooth") }}>SCAN FOR DEVICE</button>
        //             <button className="commanderBgPanel commanderBgPanelClickable" style={{ width: "90%", marginBottom: 10, padding: "8px 0px" }} onClick={() => { this.changePopup("SELECT PAIRED BLE", "selectBluetooth"); /*this.getPairedDevices()*/ }}>SELECT BLUETOOTH DEVICE</button>
        //         </div>
        //     )
        // } else if (this.state.popupInfo == "scanBluetooth") {
        //     return (
        //         <div align="left" style={{ textAlign: "left" }}>
        //             {
        //                 this.getBLEDevices()
        //             }
        //             <br /><br />
        //             <button className="commanderBgPanel commanderBgPanelClickable" style={{ width: "40%", marginBottom: 10, padding: "5px 0px" }} onClick={this.getBlutoothDevices}>
        //                 REFRESH <i className="fas fa-redo NavLink"></i>
        //             </button>
        //         </div>
        //     )
        // } else if (this.state.popupInfo == "selectBluetooth") {
        //     return (
        //         <div style={{ width: "380px" }} align="center">
        //             <select className="commanderBgPanel commanderBgPanelClickable" style={{ width: "90%", marginBottom: 10, padding: "8px 0px", textAlign: "center", color: "white" }} placeholder="Select device">
        //                 <option unselectable="true">SELECT DEVICE</option>
        //                 {
        //                     this.state.pairedDevices.map((device) => {
        //                         return (
        //                             <option key={device.address}>{device.name}</option>
        //                         )
        //                     })
        //                 }
        //             </select>
        //         </div>
        //     )
        // } else if (this.state.popupInfo == "serial") {
        //     return (
        //         <div style={{ width: "380px" }} align="center">
        //             <input className="commanderBgPanel commanderBgPanelClickable" style={{ width: "90%", marginBottom: 10, padding: "8px 0px", textAlign: "center", color: "white" }} placeholder="0000-0000-0000"></input>
        //             <button className="commanderBgPanel commanderBgPanelClickable" style={{ width: "40%", marginBottom: 10, padding: "8px 0px" }} onClick={() => { }}>ADD</button>
        //         </div>
        //     )
        // } else if (this.state.popupInfo == "temp_code") {
        //     return (
        //         <div style={{ width: "380px" }} align="center">
        //             <input className="commanderBgPanel commanderBgPanelClickable" style={{ width: "90%", marginBottom: 10, padding: "8px 0px", textAlign: "center", color: "white" }} placeholder="000000000000"></input>
        //             <button className="commanderBgPanel commanderBgPanelClickable" style={{ width: "40%", marginBottom: 10, padding: "8px 0px" }} onClick={() => { }}>ADD</button>
        //         </div>
        //     )
        // } else if (this.state.popupInfo == "scanDevices") {
        //     return (
        //         <div style={{ width: "380px" }} align="center">
        //             <div className="commanderBgPanel ">
        //                 <span>Scanning</span><span style={{}} className="spinner-demo spinner-demo2"></span>
        //             </div>
        //         </div>
        //     )
        // } else if (this.state.popupHeading == "WIFI information") {
        //     return (
        //         <div align="center">
        //             <div className="commanderBgPanel commanderBgPanelClickable" >{
        //                 this.state.code.map((user, i) => {
        //                     return <div id={user} key={i} className="commanderBgPanel" style={{ float: "center" }}>{user}</div>
        //                 })
        //             }
        //             </div>
        //         </div>
        //     )

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

    serialDevice = () => {
        if (this.state.popupInfo == "default") {
            return (
                <div className="container-fluid" style={{ background: "#16202C", padding: "10px 30px" }}>
                    <div style={{}}>
                        Add device by SERIAL NUMBER or TEMPORARY CODE:
                    </div>
                    <div className="row addDevice">
                        <div className="col" style={{ padding: "12px 10px 0px 0px", cursor: "pointer", textAlign: "center" }}>
                            <i className="fas fa-search" style={{ fontSize: "22px" }}></i>
                        </div>

                        <div className="col" style={{ padding: "3px 0px 0px 0px", cursor: "pointer" }}>
                            <input className="commanderBgPanel commanderBgPanelClickable" style={{ width: "90%", padding: "8px 8px", color: "white" }} placeholder="Enter code" />
                        </div>

                        <div className="col" style={{ padding: 0, cursor: "pointer" }}>
                            <button className="commanderBgPanel commanderBgPanelClickable sucess" style={{ width: "100%", marginBottom: 10, marginTop: 3, fontSize: "19px" }} onClick={() => { this.addDevice() }}>
                                ADD <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>

                    </div>

                </div>
            )
        } else {
            return null
        }
    }

    getBlutoothDevices = () => {
        // fetch("/api/v3/scanbluetoothDevices", {
        //     method: "GET", headers: { "Accept": "application/json", "Content-Type": "application/json" },
        // }).then(response => response.json()).then(resp => {
        //     this.setState({ bleDevices: resp })
        // }).catch(err => {
        //     console.error(err.toString())
        // });
    }

    getPairedDevices = () => {
        // fetch("/api/v3/getPairedDevices", {
        //     method: "GET", headers: { "Accept": "application/json", "Content-Type": "application/json" },
        // }).then(response => response.json()).then(resp => {
        //     this.setState({ pairedDevices: resp })
        // }).catch(err => {
        //     console.error(err.toString())
        // });
    }

    // changePopup = (heading, info) => {
    //     // commenting this out till setSteps are uncovered. 
    //     // this.setState({ popupHeadingPrev: this.state.popupHeading }, () => {
    //     //     this.setState({ popupInfoPrev: this.state.popupInfo });
    //     // })
    //     if (this.props.account.level > 0) {
    //         this.setState({ popupHeading: heading }, () => {
    //             this.setState({ popupInfo: info });
    //         })
    //     } else {
    //         this.setState({ popupHeading: "Registration Required" }, () => {
    //             this.setState({ popupInfo: "public" });
    //         })
    //     }
    // }

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
                    <Modal style={customStyles} isOpen={this.props.isOpen}>
                        <div style={{ background: "#1C2834", padding: 12, width: "100%" }}>
                            <span style={{ float: "right" }} className={"fas fa-times cross"} onClick={() => { this.props.closeModel(); if (this.props.account.level > 0) { this.setState({ popupInfo: "default" }); } /*this.setState({ popupHeading: "ADD DEVICE" })*/ }}></span>
                            <span style={{ marginRight: "40%", textAlign: "center" }}>{this.state.popupHeading}</span>
                        </div>
                        <div style={{ color: "rgba(174, 231, 241, 0.55)" }}>
                            {/* <div className='protoPopup'> */}
                            <div style={{ background: "#0E1A26", padding: "10px 30px" }}>
                                There are many ways to link data depending on what hardware you are using.
                                <p>This wizard will help guide you through the process.</p>
                            </div>
                            {this.popupInfo()}
                            {this.orOption()}
                            {this.serialDevice()}
                        </div>
                        <div style={{ background: "#0E1A26", padding: "10px 30px", color: "rgba(174, 231, 241, 0.55)", textAlign: "right" }}>
                            Need help? Please contact our <span style={{ color: "red", opacity: 0.7 }}><a href="#">support</a></span>
                        </div>
                    </Modal>
                </center>
            </div >
        )
    }
}