import React, { Component } from "react";
import { confirmAlert } from 'react-confirm-alert';
import Media from "react-media";
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
    constructor() {
        super();
        this.state = {
            selectAll: false,
            sort: "",
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
                serverresponse.sort = "";
            }
            this.setState({ sort: serverresponse.sort })
        }).catch(err => console.error(err.toString()));
    }

    selectBox = () => {
        if (this.props.public == false) {
            if (this.props.visiting == false) {
                if (this.state.selectAll) {
                    return (<span style={{ cursor: "pointer", margin: "8px 15px 0px 0px" }} onClick={this.selectBoxClickHandler(false)}><i className="fas fa-check-double" title="Deselect All" /> DESELECT ALL </span>)
                } else {
                    return (<span style={{ cursor: "pointer", opacity: 0.3, margin: "8px 15px 0px 0px" }} onClick={this.selectBoxClickHandler(true)}><i className="fas fa-check-double" title="Select All" /> SELECT ALL </span>)
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

    sortButtons = () => {
        if (this.state.sort == "") { return <i className="stateSortButton fas fa-sort-amount-down" title="latest created top" onClick={this.sortClickHandler("timedesc")} ></i> }
        if (this.state.sort == "timedesc") { return <i className="stateSortButton fas fa-sort-numeric-down" title="last seen top" onClick={this.sortClickHandler("namedesc")} ></i> }
        if (this.state.sort == "namedesc") { return <i className="stateSortButton fas fa-sort-alpha-down" title="alphabetical" onClick={this.sortClickHandler("")} ></i> }
    }

    sortClickHandler = (action) => {
        return (e) => {
            // fetch("/api/v3/sort", {
            //     method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
            //     body: JSON.stringify({ sort: action })
            // }).then(response => response.json()).then(serverresponse => {
            // }).catch(err => console.error(err.toString()));

            this.setState({ sort: action })
            this.props.sort(action);
        }
    }

    menuDeleteButton = () => {
        if (this.props.public == false) {
            if (this.props.visiting == false) {
                if (this.props.selectCount > 0) {
                    return (
                        <span className="protoButton protoButtonClickable" style={{ fontWeight: "normal", padding: "2px 5px", background: "rgba(255,0,0, 0.6)", float: "left", margin: "7px 15px 0px" }} title={this.props.selectCount + " selected."}
                            onClick={() => this.clickDeleteConfirmation()}> <i className="fas fa-trash-alt" /> DELETE</span>
                    )
                } else {
                    return (
                        <span className="" style={{ float: "left", margin: "8px 15px 0px", opacity: 0.3, cursor: "not-allowed", display: this.state.menu }} title="Select some devices first..."> <i className="fas fa-trash-alt" /> DELETE</span>
                    )
                }
            }
        }
    }

    viewButton = () => {
        if (this.props.mainView != "devices") {
            return <i className="viewButton fas fa-list-ul" title="List View" style={{ color: "grey", marginTop: "10px", opacity: 0.3, cursor: "not-allowed" }} ></i>;
        } else {
            if (this.state.view == "list") {
                return <i className="viewButton fas fa-map-marked-alt" title="Map View" style={{ color: "grey", marginTop: "10px", cursor: "pointer" }} onClick={this.viewButtonClicked("map")} ></i>;
            } else if (this.state.view == "map") {
                return <i className="viewButton fas fa-list-ul" title="List View" style={{ color: "grey", marginTop: "10px" }} onClick={this.viewButtonClicked("list")} ></i>;
            }
        }
    }

    viewButtonClicked = (action) => {
        return (e) => {
            this.setState({ view: action })
            this.props.view(action);
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
                                //this.handleClickDelete()
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

    changeSearch = () => {
        if (searchButton == "icon") {
            searchButton = "filter"
            this.setState({ display: "menuIcons" })
        } else if (searchButton == "filter") {
            searchButton = "icon"
            this.setState({ display: "" })
        }
    }

    changeClass = () => {
        if (this.props.mainView == "devices") {
            return (
                <div>
                    <span className="col" style={{ flex: "0 0 50px", padding: "10px 10px 0 12px", display: this.state.menu }}>
                        <i style={{ marginTop: 12 }} onClick={this.changeSearch} className="fas fa-search searchIcon"></i>
                    </span>
                    <span style={{ padding: 0 }}>
                        <form id="search" style={{ flex: "0 0 240px", textAlign: "left", float: "right", marginTop: 2 }}>
                            <input name="query" type="search" onChange={this.props.search} style={{ width: "100%" }} placeholder="search for device..." />
                        </form>
                    </span>
                </div>
            )
        } else return null
    }

    filterSection = () => {
        if (this.props.mainView != "devices") {
            return (
                <div className="row" style={{ padding: 5 }}>
                    <span className="col filterButton" style={{ flex: "0 0 10px", padding: "10px 2px 0px 12px", cursor: "pointer" }}>
                        <i className="fas fa-sort"></i>
                    </span>

                    <span className="col  filterButton" style={{ flex: "0 0 60px", padding: "10px 2px 0px 12px", cursor: "pointer" }} onClick={this.sortClickHandler("namedesc")}>
                        <i className="fas fa-sort"></i> A-Z
                    </span>

                    <span className="col  filterButton" style={{ flex: "0 0 10px", padding: "10px 3px 0px 5px", cursor: "pointer" }}>
                        <i onClick={this.changeSearch} className="fas fa-search searchIcon"></i>
                    </span>

                    <span id="search" style={{ flex: "0 0 100px", textAlign: "left", float: "right", marginTop: 2, cursor: "pointer" }}>
                        <input name="query" type="search" onChange={this.props.search} style={{ width: "100%", height: "auto", border: "1px solid grey" }} placeholder="search for device..." />
                    </span>

                    <span className="col filterButton" style={{ flex: "0 0 100px", padding: "10px 2px 0px 8px", cursor: "pointer" }} onClick={this.sortClickHandler("timedesc")}>
                        <i className="fas fa-sort"></i> LATEST
                    </span>

                    <span style={{ textAlign: "right", paddingTop: 10 }}>
                        <span className="col filterButton" style={{ flex: "0 0 10px", padding: "10px 2px 0px 12px", cursor: "pointer" }}>
                            <i className="fas fa-sort"></i>
                        </span>

                        <span className="col filterButton" style={{ flex: "0 0 10px", padding: "10px 2px 0px 12px", cursor: "pointer" }}>
                            <i className="fas fa-sort"></i>
                        </span>

                        <span className="col filterButton" style={{ flex: "0 0 10px", padding: "10px 2px 0px 12px", cursor: "pointer" }}>
                            <i className="fas fa-sort"></i>
                        </span>

                        <span className="col filterButton" style={{ flex: "0 0 10px", padding: "10px 2px 0px 12px", cursor: "pointer" }}>
                            <i className="fas fa-sort"></i>
                        </span>
                    </span>

                    {/* <span className="col" style={{ flex: "0 0 100px" }} >
                        <div style={{ float: "right", marginLeft: "20px", display: this.state.menu }}>{this.viewButton()}</div>
                        <div style={{ textAlign: "right", float: "right", marginTop: "7px", width: "20px", display: this.state.menu }}>
                            {this.sortButtons()}
                        </div>
                    </span> */}
                </div>
            )
        } else {
            return (
                // <span>
                //     <span style={{ textAlign: "right", paddingTop: 10 }}>
                //         <span className="col filterButton" style={{ flex: "0 0 10px", padding: "10px 2px 0px 12px", cursor: "pointer" }}>
                //             <i className="fas fa-sort"></i>
                //         </span>

                //         <span className="col filterButton" style={{ flex: "0 0 10px", padding: "10px 2px 0px 12px", cursor: "pointer" }}>
                //             <i className="fas fa-sort"></i>
                //         </span>

                //         <span className="col filterButton" style={{ flex: "0 0 10px", padding: "10px 2px 0px 12px", cursor: "pointer" }}>
                //             <i className="fas fa-sort"></i>
                //         </span>

                //         <span className="col filterButton" style={{ flex: "0 0 10px", padding: "10px 2px 0px 12px", cursor: "pointer" }}>
                //             <i className="fas fa-sort"></i>
                //         </span>
                //     </span>
                // </span>
                null
            )
        }
    }

    render() {
        return (
            < div className="container-fluid protoMenu" style={{ background: "#101A24" }} >
                <div className="row" style={{ padding: 5 }} >
                    <span>
                        <div className="col" style={{ flex: "0 0 35px", padding: "9px 0 0 10px", display: this.state.menu }}>
                            {this.selectBox()}
                        </div>
                    </span>
                    {this.changeClass()}
                    <span className={this.state.display}>
                        <div className="col" style={{ flex: "0 0 35px" }}>
                            {this.menuDeleteButton()}
                        </div>
                    </span>
                    {/* {this.filterSection()} */}
                </div >
                {this.filterSection()}
            </div >
        )
    }
}
