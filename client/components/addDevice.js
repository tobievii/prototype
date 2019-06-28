import React, { Component } from "react";
import Modal from 'react-modal';
import {CopyToClipboard} from 'react-copy-to-clipboard';

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
        bleDevices: [],
        value: 
        [
            {
                "id":"cd7a632c.b4017",
                "type":"lora in",
                "z":"d45ecedb.5b0ab",
                "name":"Bosch_Sensor",
                "datatype":"bytes",
                "x":134,
                "y":204,
                "wires":
                    [
                        [
                            "c8055bb9.6f6228",
                            "3b308c50.94e3a4"
                        ]
                    ]
            },
            {
                "id":"c8055bb9.6f6228",
                "type":"debug",
                "z":"d45ecedb.5b0ab",
                "name":"",
                "active":false,
                "console":"false",
                "complete":"payload",
                "x":328,
                "y":85,
                "wires":[]
            },
            {
                "id":"3b308c50.94e3a4",
                "type":"function",
                "z":"d45ecedb.5b0ab",
                "name":"decoder",
                "func":"var UInt4 = function (value) {\n    return (value & 0xF);\n};\n\nvar Int4 = function (value) {\n    var ref = UInt4(value);\n    return (ref > 0x7) ? ref - 0x10 : ref;\n};\n\nvar UInt8 = function (value) {\n    return (value & 0xFF);\n};\n\nvar Int8 = function (value) {\n    var ref = UInt8(value);\n    return (ref > 0x7F) ? ref - 0x100 : ref;\n};\n\nvar UInt16 = function (value) {\n    return (value & 0xFFFF);\n};\n\nvar Int16 = function (value) {\n    var ref = UInt16(value);\n    return (ref > 0x7FFF) ? ref - 0x10000 : ref;\n};\n\nvar UInt32 = function (value) {\n    return (value & 0xFFFFFFFF);\n};\n\nvar Int32 = function (value) {\n    var ref = UInt32(value);\n    return (ref > 0x7FFFFFFF) ? ref - 0x100000000 : ref;\n};\n\n\n    \n    var bytes = msg.payload;\n    var port = 1;\n    // Decode an uplink message from a buffer\n    // (array) of bytes to an object of fields.\n    var decoded = {};\n\n    if (port === 1) {\n        decoded.ProtocolVersion = bytes[0];\n        decoded.MessageType = bytes[1];\n        if (decoded.MessageType === 0x00) {\n            // Standard Message Type\n            decoded.BattState = (bytes[2] >> 4) & 0x07;\n            decoded.AccVector = (bytes[2] >> 1) & 0x07;\n            decoded.AccState = (bytes[2]) & 0x01;\n            decoded.GPSLongitude = Int32((bytes[6] << 24) | (bytes[5] << 16) | (bytes[4] << 8) | (bytes[3] << 0)) / 10000000;\n            decoded.GPSLatitude = Int32((bytes[10] << 24) | (bytes[9] << 16) | (bytes[8] << 8) | (bytes[7] << 0)) / 10000000;\n            decoded.GPSAltitude = Int16(bytes[12] << 8) | (bytes[11] << 0);\n            weekNumberTimeOfWeek = (bytes[16] << 24) | (bytes[15] << 16) | (bytes[14] << 8) | (bytes[13] << 0);\n            decoded.GPSWeekNumber = (weekNumberTimeOfWeek >> 20) & 0x3FF;\n            decoded.GPSTimeOfWeek = weekNumberTimeOfWeek & 0x000FFFFF;\n\n            var GPSDate = new Date(1980, 0, 1, 0, 0, 0, 0); // reference date 1. january 1980\n            var GPSWeekRollovers = 2;\n            // add weeknumber in days relative to 1st january 1980; add 6 because weeks started at 6th january 1980\n            GPSDate.setDate(6 + ((decoded.GPSWeekNumber + (GPSWeekRollovers * 1024)) * 7));\n            GPSDate.setSeconds(decoded.GPSTimeOfWeek); // add seconds to gps week\n            decoded.GPSTimestamp = GPSDate.toString();\n            decoded.GPSHorizontalAccuracy = ((bytes[18] << 8) | (bytes[17] << 0)) / 10;\n            decoded.GPSVerticalAccuracy = ((bytes[20] << 8) | (bytes[19] << 0)) / 10;\n            decoded.AccOperatingMinutes1 = (bytes[22] << 8) | (bytes[21] << 0);\n            decoded.AccOperatingMinutes2 = (bytes[24] << 8) | (bytes[23] << 0);\n            decoded.AccNumberShocks = bytes[25];\n            decoded.Temperature = Int8(bytes[26]) + 23;\n            decoded.MagneticFieldX = Int16((bytes[28] << 8) | (bytes[27] << 0)) / 16;\n            decoded.MagneticFieldY = Int16((bytes[30] << 8) | (bytes[29] << 0)) / 16;\n            decoded.MagneticFieldZ = Int16((bytes[32] << 8) | (bytes[31] << 0)) / 16;\n            decoded.BTNum = bytes[33];\n        }\n\n        if (decoded.MessageType === 0x01) {\n            // Alive message type\n            decoded.Temperature = Int8(bytes[2]) + 23;\n            decoded.BTNum = bytes[3];\n        }\n\n        if (decoded.MessageType === 0x02) {\n            // startup message type\n            decoded.SoftwareVersion = bytes.slice(2, 17);\n            decoded.BootblockVersion = bytes.slice(18, 33);\n            decoded.HardwareVersion = bytes.slice(34, 49);\n            decoded.RegionCode = bytes[50];\n        }\n\n        if (decoded.MessageType === 0x5F) {\n            // configurtaion acknowledged message type\n            decoded.ConfigurationMessageId = bytes[2];\n            decoded.ConfigurationState = bytes[3];\n        }\n\n        if (decoded.MessageType === 0x10) {\n            // bluetooth collection message type\n            var BluetoothBeacons = {};\n            for (var cnt = 0; cnt < 4; cnt++) {\n                MACAdress = bytes.slice((cnt * 7) + 2, (cnt * 7) + 8).map(function (byte) {\n                    return ('0' + (byte & 0xFF).toString(16)).slice(-2);\n                }).join(':');\n                BluetoothBeacons[MACAdress] = Int8(bytes[(cnt * 7) + 8]);\n            }\n            decoded.BluetoothBeacons = BluetoothBeacons;\n        }\n    }\n\n    var Tracker = {\n        \"payload\":{\n        \"id\": \"Bosch_Sensor\",\n        \"data\": decoded\n        }\n    };\n\n\n\n\nreturn Tracker\n;",
                "outputs":1,
                "noerr":0,
                "x":325,
                "y":542,
                "wires":
                    [
                        [
                            "a2390625.6a7608",
                            "686e37ce.6e5688"
                        ]
                    ]
                },
                {
                    "id":"686e37ce.6e5688",
                    "type":"mqtt out",
                    "z":"d45ecedb.5b0ab",
                    "name":"",
                    "topic": this.props.account.apikey,
                    "qos":"",
                    "retain":"",
                    "broker":"d4ddd3b3.f4313",
                    "x":587,"y":430,
                    "wires":[]
                },
                {
                    "id":"a2390625.6a7608",
                    "type":"debug",
                    "z":"d45ecedb.5b0ab",
                    "name":"",
                    "active":true,
                    "console":"false",
                    "complete":"payload",
                    "x":628,
                    "y":540,
                    "wires":[]
                },
                {
                    "id":"d4ddd3b3.f4313",
                    "type":"mqtt-broker",
                    "z":"",
                    "broker":"prototype.dev.iotnxt.io",
                    "port":"1883",
                    "clientid":"",
                    "usetls":false,
                    "compatmode":false,
                    "keepalive":"60",
                    "cleansession":true,
                    "willTopic":"",
                    "willQos":"0",
                    "willPayload":"",
                    "birthTopic":"",
                    "birthQos":"0",
                    "birthPayload":""
                }
        ],
        copied: false
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

    addDevice = (call) => {
        if (this.props.account.level < 1) {
            this.setState({ popupInfo: "public" })
        } else if (this.state.search == "Efento" && call == "select") {
            this.setState({ popupInfo: "Efento" })
        } else if (this.state.search == "Bosch TRACI" && call == "select") {
            this.setState({ popupInfo: "Bosch TRACI" })

        } else {
            return null;
        }
    }

    search = evt => {
        this.setState({ search: evt.target.value.toString() })
    }

    nodeRedConfig = () => {
        return (
            <div>
              {/* <CopyToClipboard text={this.state.value}
                onCopy={() => this.setState({copied: true})}>
                <span>Copy to clipboard with span</span>
              </CopyToClipboard> */}
       
              <CopyToClipboard text={this.state.value}
                onCopy={() => this.setState({copied: true})}>
                <button>Copy to clipboard with button</button>
              </CopyToClipboard>
              {this.state.copied ? <span style={{color: 'red'}}>Copied.</span> : null}
            </div>
          );
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
                                <option value="Bosch TRACI" className="commanderBgPanel commanderBgPanelClickable" style={{ width: "90%" }} />
                            </datalist>
                        </div>

                        <div className="col" style={{ padding: 0, cursor: "pointer" }}>
                            <button className="commanderBgPanel commanderBgPanelClickable sucess" style={{ width: "100%", marginBottom: 10, marginTop: 3, fontSize: "19px" }} onClick={() => { this.addDevice("select") }}>
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
                <div style={{ background: "#16202C", paddingLeft: "20px", paddingBottom: "45px" }}>
                    <br></br>
                    <h5>Efento NB-IoT</h5>
                    <br />
                    Please enter the information below on your efento logger mobile application.
                    <br /><br />
                    Prototyp3's IP Address: <span className="commanderBgPanel" style={{ float: "right", width: "60%", marginRight: "15px", textAlign: "center" }}><span className="spot">40.115.63.112</span></span>
                    <br /><br />
                    Your API Key:<span className="commanderBgPanel" style={{ float: "right", width: "60%", marginRight: "15px", textAlign: "center" }}><span className="spot">{this.props.account.apikey}</span></span>
                    <br /><br />
                    Port: <span className="commanderBgPanel" style={{ float: "right", width: "60%", marginRight: "15px", textAlign: "center" }}><span className="spot">5683</span></span>
                </div>
            )
        } else if (this.state.popupInfo == "Bosch TRACI") {

            return (
                <div style={{ background: "#16202C", paddingLeft: "20px", paddingBottom: "45px" }}>
                    <br></br>
                    <h5>Bosch Asset Tracking Tag</h5>
                    <br />
                    The below config is is to be uploaded to Node-Red on a MultiTech MultiConnect Conduit.
                    <br /><br />
                    Please ensure that your Gateway is set up according to your region and set-up correctly.
                    <br /><br />
                    If you're using a different Gateway, please contact your Gateway manufacturer for configuration.
                    Node-Red config: 
                    <span className="commanderBgPanel" style={{ float: "right", width: "60%", marginRight: "15px", textAlign: "center" }}><span className="spot">{this.nodeRedConfig()}</span></span>
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
                            <button className="commanderBgPanel commanderBgPanelClickable sucess" style={{ width: "100%", marginBottom: 10, marginTop: 3, fontSize: "19px" }} onClick={() => { this.addDevice("code") }}>
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
                        <div className="container-fluid" style={{ background: "#16202C" }}>
                            <div className="row">
                                <div className="col" style={{ textAlign: "center", opacity: 0.8, padding: "7px", paddingBottom: "5px", fontSize: "18px" }}>{this.state.popupHeading}</div>
                                <div className="col fas fa-times cross" style={{ flex: "0 0 40px", padding: "10px 8px 0px 12px", fontSize: "20px" }} onClick={() => { this.props.closeModel(); if (this.props.account.level > 0) { this.setState({ popupInfo: "default" }); } /*this.setState({ popupHeading: "ADD DEVICE" })*/ }}></div>
                            </div>
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
                        <div style={{ background: "#0E1A26", padding: "15px 30px", color: "rgba(174, 231, 241, 0.55)", textAlign: "right" }}>
                            Need help? Please contact our <span style={{ color: "red", opacity: 0.7 }}><a href="#">support</a></span>
                        </div>
                    </Modal>
                </center>
            </div >
        )
    }
}