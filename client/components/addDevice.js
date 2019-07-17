import React, { Component } from "react";
import { devices } from "../plugins/devicetype/devicetype_config.ts"
import Modal from 'react-modal';
import Media from "react-media";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: '50%',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: "none",
        background: "rgba(0, 0, 0, 0.1)",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        maxHeight: 'calc(100vh - 210px)',
        overflowY: 'auto',
        padding: "0",
        width: "50%"
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
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: "none",
        background: "rgba(0, 0, 0, 0.1)",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        maxHeight: 'calc(100vh - 210px)',
        overflowY: 'auto',
        padding: "0",
        width: "100%"
    },
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
        } else if (this.state.search != undefined) {
            this.setState({ popupInfo: call })
        }
    }

    search = evt => {
        devices.map((device, i) => {
            if (device.name == evt.target.value.toString()) {
                this.setState({ search: i })
            }
        })
    }

    NextButton = () => {
        return (
            <Media query="(max-width: 599px)">
                {matches =>
                    matches ? (
                        <div className="row addDevice">
                            <div className="col" style={{ padding: "12px 10px 0px 0px", cursor: "pointer", textAlign: "center" }}>
                                <i className="fas fa-search" style={{ fontSize: "22px" }}></i>
                            </div>
                            <div className="col" style={{ padding: "3px 0px 0px 0px", cursor: "pointer", width: "80%" }}>
                                <select id="devices" style={{ width: "100%", padding: "8px 8px", opacity: "0.6", marginLeft: "6%" }} onChange={this.search} defaultValue={'DEFAULT'}>
                                    <option value='DEFAULT' style={{ color: "gray" }} disabled>Select type of device...</option>
                                    {devices.map((device, i) => {
                                        return <option key={i} value={device.name} className="optiondropdown" style={{ width: "90%" }} >{device.name}</option>
                                    })}
                                </select>
                            </div>
                            <div className="row" style={{ cursor: "pointer" }}>
                                <button className="commanderBgPanel commanderBgPanelClickable sucess" style={{ width: "100%", marginBottom: 10, marginTop: 3, fontSize: "16px" }} onClick={() => { this.addDevice("select") }}>
                                    NEXT <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    ) : (
                            <div className="row addDevice">
                                <div className="col" style={{ padding: "12px 10px 0px 0px", cursor: "pointer", textAlign: "center" }}>
                                    <i className="fas fa-search" style={{ fontSize: "22px" }}></i>
                                </div>
                                <div className="col" style={{ padding: "3px 0px 0px 0px", cursor: "pointer" }}>
                                    <select id="devices" style={{ width: "60%", padding: "8px 8px", opacity: "0.6" }} onChange={this.search} defaultValue={'DEFAULT'}>
                                        <option value='DEFAULT' style={{ color: "gray" }} disabled>Select type of device...</option>
                                        {devices.map((device, i) => {
                                            return <option key={i} value={device.name} className="optiondropdown" style={{ width: "90%" }} >{device.name}</option>
                                        })}
                                    </select>
                                </div>
                                <div className="col" style={{ padding: 0, cursor: "pointer" }}>
                                    <button className="commanderBgPanel commanderBgPanelClickable sucess" style={{ width: "100%", marginBottom: 10, marginTop: 3, fontSize: "19px" }} onClick={() => { this.addDevice(this.state.search) }}>
                                        NEXT <i className="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                        )
                }
            </Media>
        )
    }

    popupInfo = () => {
        if (this.state.popupInfo != "default") {
            var DeviceView = devices[this.state.popupInfo].AddDevice;
            return (
                <DeviceView {...this.props} />
            )
        } else {
            return (
                <div className="container-fluid" style={{ background: "#16202C", padding: "10px 30px" }}>
                    <div>
                        Search for your device, service and/or protocol:
                        </div>
                    {this.NextButton()}
                </div>
            )
        }
    }

    serialDevice = () => {
        if (this.state.popupInfo == "default") {
            return (
                <Media query="(max-width: 599px)">
                    {matches =>
                        matches ? (
                            <div className="container-fluid" style={{ background: "#16202C", padding: "10px 30px" }}>
                                <div style={{}}>
                                    Add device by SERIAL NUMBER or TEMPORARY CODE:
                            </div>
                                <div className="row addDevice">
                                    <div className="col" style={{ padding: "12px 10px 0px 0px", cursor: "pointer", textAlign: "center" }}>
                                        <i className="fas fa-search" style={{ fontSize: "22px" }}></i>
                                    </div>

                                    <div className="col" style={{ padding: "3px 0px 0px 0px", cursor: "pointer" }}>
                                        <input className="commanderBgPanel commanderBgPanelClickable" style={{ width: "80%", padding: "8px ", color: "white", marginLeft: "6%", height: "80%" }} placeholder="Enter code" />
                                    </div>

                                    <div className="row" style={{ padding: 0, cursor: "pointer" }}>
                                        <button className="commanderBgPanel commanderBgPanelClickable sucess" style={{ width: "100%", marginBottom: 10, marginTop: 3, fontSize: "16px", height: "100%" }} onClick={() => { this.addDevice("code") }}>
                                            ADD <i className="fas fa-chevron-right"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
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
                                            <button className="commanderBgPanel commanderBgPanelClickable sucess" style={{ width: "100%", marginBottom: 10, marginTop: 3, fontSize: "19px" }}>
                                                ADD <i className="fas fa-chevron-right"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                    }
                </Media >
            )
        } else {
            return null
        }
    }

    backButton = () => {
        if (this.state.popupInfo != "default") {
            return (
                <div className="col fas fa-arrow-left" style={{ flex: "0 0 40px", padding: "10px 8px 0px 12px", fontSize: "18px", opacity: 0.6 }} onClick={() => { this.setState({ popupInfo: "default" }) }}></div>
            )
        } else return null
    }

    render() {
        return (
            <div >
                <center>
                    <Media query="(max-width: 599px)">
                        {matches =>
                            matches ? (
                                <Modal style={customStylesMobile} isOpen={this.props.isOpen}>
                                    <div className="container-fluid" style={{ background: "#16202C" }}>
                                        <div className="row">
                                            {this.backButton()}
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
                            ) : (
                                    <Modal style={customStyles} isOpen={this.props.isOpen}>
                                        <div className="container-fluid" style={{ background: "#16202C" }}>
                                            <div className="row">
                                                {this.backButton()}
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
                                )
                        }
                    </Media>
                </center>
            </div >
        )
    }
}