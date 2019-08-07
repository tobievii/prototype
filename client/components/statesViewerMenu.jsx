import React, { Component } from "react";
import { confirmAlert } from 'react-confirm-alert';
import Modal from 'react-modal';

var searchButton = "icon"
Modal.setAppElement('body')
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: '50%',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: "none",
        background: "rgba(3, 4, 5,0.6)",
        maxHeight: 'calc(100vh - 210px)',
        overflowY: 'auto',
    },
    //bacground of Pop up Modal on search
    overlay: {
        background: "rgba(27, 57, 77,0.9)",
    }
};
export class StatesViewerMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectAll: false,
            sort: [
                "timedesc",
                "namedesc",
                "selected",
                "alarm",
                "warning",
                "shared",
                "public"
            ],
            menu: "",
            view: "map",
            addIcon: "fas fa-plus-circle",
            display: "",
            showAddDevice: "none",
            addDeviceButton: "none",
            ssid: "",
            wifipass: "",
            code: [],
            modalIsOpen: false,
            sortAscending: <i className="fas fa-sort-up"></i>,
            sortDescending: <i className="fas fa-sort-down"></i>,
        }

        fetch("/api/v3/getsort", {
            method: "GET", headers: { "Accept": "application/json", "Content-Type": "application/json" },
        }).then(response => response.json()).then(serverresponse => {
            if (serverresponse.sort == null || serverresponse.sort == undefined) {
                serverresponse.sort = [
                    "timedesc",
                    "namedesc",
                    "selected",
                    "alarm",
                    "warning",
                    "shared",
                    "public"
                ];
            }
            this.setState({ sort: serverresponse.sort })
        }).catch(err => console.error(err.toString()));
    }

    selectBox = () => {
        if (this.props.public == false) {
            if (this.props.visiting == false) {
                if (this.state.selectAll) {
                    return (<span style={{ cursor: "pointer", margin: "5px 15px 0px 0px" }} onClick={this.selectBoxClickHandler(false)}><i className="fas fa-check-double" title="Deselect All" style={{ fontSize: 13 }} /> DESELECT ALL </span>)
                } else {
                    return (<span style={{ cursor: "pointer", opacity: 0.3, margin: "5px 15px 0px 0px" }} onClick={this.selectBoxClickHandler(true)}><i className="fas fa-check-double" title="Select All" style={{ fontSize: 13 }} /> SELECT ALL </span>)
                }
            }
        }
    }

    selectBoxClickHandler = (action) => {
        return (e) => {
            this.setState({ selectAll: action })
            this.props.selectAll(action)
        }
    }

    sortClickHandler = (action) => {
        return (e) => {
            // fetch("/api/v3/sort", {
            //     method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
            //     body: JSON.stringify({ sort: action })
            // }).then(response => response.json()).then(serverresponse => {
            // }).catch(err => console.error(err.toString()));

            this.setState({ sort: action })
            this.props.sort(action, "post");
        }
    }

    search = evt => {
        if (evt.target.value == "DASHBOARD PRESET" || evt.target.value == "SET IOTNXT GATEWAY" || evt.target.value == "SCRIPT PRESET" || evt.target.value == "SHARE" || evt.target.value == "CLEAR DEVICE DATA") {
            this.props.openModifyModal(evt.target.value.toString())
            evt.target.value = ""
        }
    }

    menuDeleteButton = () => {
        if (this.props.public == false) {
            if (this.props.visiting == false) {
                if (this.props.selectCount > 0) {
                    return (
                        <span className="protoButton protoButtonClickable" style={
                            {
                                padding: "1px 5px",
                                background: "rgba(255,0,0,0.6)",
                                float: "left",
                                margin: "5px 7px 0px"
                            }} title={this.props.selectCount + " selected."}
                            onClick={() => this.clickDeleteConfirmation()}> <i className="fas fa-trash-alt" /> REMOVE</span>
                    )
                } else {
                    return (
                        <span className="protoButton protoButtonClickable" style={
                            {
                                padding: "1px 5px",
                                float: "left",
                                margin: "5px 7px 0px",
                                opacity: 0.3,
                                cursor: "not-allowed",
                                display: this.state.menu
                            }
                        } title="Select some devices first..."> <i className="fas fa-trash-alt" /> REMOVE</span>
                    )
                }
            }
        }
    }

    menuModifyButton = () => {
        if (this.props.public == false) {
            if (this.props.visiting == false) {
                if (this.props.selectCount > 0) {
                    return (
                        <div>
                            < select id="devices" style={{ width: "120px", marginTop: "7px" }} onChange={this.search} defaultValue={'DEFAULT'}>
                                <option value='DEFAULT' style={{ color: "gray" }} disabled >MODIFY...</option>
                                <option className="optiondropdown" value="DASHBOARD PRESET" style={{ width: "90%" }}>DASHBOARD PRESET</option>
                                <option className="optiondropdown" value="SCRIPT PRESET" style={{ width: "90%" }} >SCRIPT PRESET</option>
                                <option className="optiondropdown" value="SHARE" style={{ width: "90%" }} >SHARE</option>
                                <option className="optiondropdown" value="SET IOTNXT GATEWAY" style={{ width: "90%" }} >SET IOTNXT GATEWAY</option>
                                <option className="optiondropdown" value="CLEAR DEVICE DATA" style={{ width: "90%", color: "red" }} >CLEAR DEVICE DATA</option>
                            </select>
                        </div >
                    )
                } else {
                    return (
                        < select disabled id="devices" title="Select some devices first..." style={{ marginTop: "7px", width: "120px", cursor: "not-allowed", opacity: "0.3" }} defaultValue={'DEFAULT'}>
                            <option className="optiondropdown" style={{ width: "90%" }} value='DEFAULT' disabled>MODIFY...</option>
                        </ select>
                    )
                }
            }
        }
    }

    clickDeleteConfirmation = () => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='protoPopup' align="center">
                        <h1>Are you sure?</h1>
                        <p>Deleting a device is irreversible</p>
                        <div >
                            <button className="smallButton" style={{ margin: "5px", backgroundColor: "red", opacity: "0.7" }} onClick={onClose}>No, leave it!</button>

                            <button className="smallButton" style={{ margin: "5px", backgroundColor: "green", opacity: "0.6" }} onClick={() => {
                                this.props.deleteSelected()
                                onClose()
                            }}>Yes, delete it!</button>
                        </div>
                    </div>
                )
            }
        })
    };

    dialog() {
        if (this.state.dialog) {
            return (
                <div className="container" style={{ color: "red" }}>
                </div>
            );
        }
    }

    filterSection = () => {
        var statelistIcons = "110px";
        var lastseen = "95px"
        var margin = "7px"

        if (this.props.mainView == "devices") {
            statelistIcons = "127px";
            lastseen = "80px";
            margin = "8px"
        }

        return (
            <div className="row" style={{}}>
                <div className="col fa-stack" style={{ flex: "0 0 30px", cursor: "pointer", verticalAlign: "middle", marginLeft: "3px", marginTop: 3 }} onClick={this.sortClickHandler("selected")} >
                    <i className="fas fa-stack-1x fa-sort-up filterButton" title="Selected devices on top"></i>
                    <i className="fas fa-stack-1x fa-sort-down fa-inverse " title="Selected devices last" style={{ opacity: 0.5 }}></i>
                </div>

                <div className="col" style={{ flex: "0 0 50px", padding: "0px", cursor: "pointer", marginRight: "3px", paddingTop: 3 }} onClick={this.sortClickHandler("namedesc")}>
                    <span className="fa-stack" style={{ width: "20px", marginBottom: 2 }}>
                        <i className="fas fa-stack-1x fa-sort-up filterButton" title="Device name ascending"></i>
                        <i className="fas fa-stack-1x fa-sort-down fa-inverse" title="Device name descending" style={{ opacity: 0.5 }}></i>
                    </span>
                    <span className="filterButton" style={{ paddingTop: 3 }} >A-Z</span>
                </div>

                <div className="col" id="search" style={{ textAlign: "left", cursor: "pointer", padding: "0px", margin: "2px 0px 4px 10px" }}>
                    {/* <input className="fa" name="query" type="search" onChange={this.props.search} style={{ fontFamily: "Font Awesome 5 Free, Share Tech Mono, ShareTechMono-Regular", fontStyle: "normal", width: "100%", height: "35px", border: "1px solid rgba(169, 169, 169, 0.2)", fontSize: 14 }} placeholder="&#xf002;" /> */}
                    <i className="fas fa-search" style={{ marginRight: "5px", opacity: 0.5 }}></i>
                    <input name="query" type="search" onChange={this.props.search} style={{ width: "85%", height: "35px", border: "1px solid rgba(169, 169, 169, 0.2)", fontSize: 14 }} placeholder="search for device..." />
                </div>

                <div className="col" style={{ flex: "0 0 " + lastseen, padding: "4px 0px 0px 3px", cursor: "pointer" }} onClick={this.sortClickHandler("timedesc")}>
                    <span className="fa-stack" style={{ width: "20px", marginBottom: 2 }}>
                        <i className="fas fa-stack-1x fa-sort-up filterButton" title="last seen"></i>
                        <i className="fas fa-stack-1x fa-sort-down fa-inverse" title="last seen" style={{ opacity: 0.5 }}></i>
                    </span>
                    <span className="filterButton">LATEST</span>
                </div>

                <div className="col" style={{ flex: "0 0 " + statelistIcons, padding: "0px", marginTop: 4 }}>
                    <div className="fa-stack" style={{ padding: "10px 2px 0px 12px", marginLeft: margin, cursor: "pointer", width: "20px" }} onClick={this.sortClickHandler("alarm")}>
                        <i className="fas fa-stack-1x fa-sort-up filterButton" title="alarm notifications"></i>
                        <i className="fas fa-stack-1x fa-sort-down fa-inverse" title="alarm notifications" style={{ opacity: 0.5 }}></i>
                    </div>

                    <div className="fa-stack" style={{ width: "20px", padding: "10px 2px 0px 12px", marginLeft: "2px", cursor: "pointer" }} onClick={this.sortClickHandler("warning")}>
                        <i className="fas fa-stack-1x fa-sort-up filterButton" title="warnings notifications"></i>
                        <i className="fas fa-stack-1x fa-sort-down fa-inverse " title="warnings notifications" style={{ opacity: 0.5 }}></i>
                    </div>

                    <div className="fa-stack" style={{ width: "20px", padding: "10px 2px 0px 13px", marginLeft: "2px", cursor: "pointer" }} onClick={this.sortClickHandler("shared")}>
                        <i className="fas fa-stack-1x fa-sort-up filterButton" title="shared devices"></i>
                        <i className="fas fa-stack-1x fa-sort-down fa-inverse" title="shared devices" style={{ opacity: 0.5 }}></i>
                    </div>

                    <div className="fa-stack" style={{ width: "20px", padding: "10px 2px 0px 14px", marginLeft: "2px", cursor: "pointer" }} onClick={this.sortClickHandler("public")}>
                        <i className="fas fa-stack-1x fa-sort-up filterButton" title="public devices"></i>
                        <i className="fas fa-stack-1x fa-sort-down fa-inverse " title="public devices" style={{ opacity: 0.5 }}></i>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            < div className="container-fluid protoMenu" style={{ background: "#101A24" }} >
                <div className="row" style={{ padding: 5 }} >
                    <span>
                        <div className="col" style={{ flex: "0 0 20px", padding: "5px 0 0 8px", display: this.state.menu }}>
                            {this.selectBox()}
                        </div>
                    </span>
                    <span className={this.state.display} >
                        <div className="col" style={{ flex: "0 0 35px" }}>
                            {this.menuModifyButton()}
                        </div>
                    </span>
                    <span >
                        {this.menuDeleteButton()}
                    </span>
                </div >
                {this.filterSection()}
            </div>
        )
    }
}
