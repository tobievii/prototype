import React, { Component } from "react";
import { confirmAlert } from 'react-confirm-alert';
import Media from "react-media";

var searchButton = "icon"

export class StatesViewerMenu extends Component {
    state = { selectAll: false, sort: "", view: "map", boundary: undefined, boundaryVisible: false, display: "" }

    selectBox = () => {
        if (this.props.public == false) {
            if (this.props.visiting == false) {
                if (this.state.selectAll) {
                    return (<i className="fas fa-check-square" onClick={this.selectBoxClickHandler(false)} title="Deselect All" ></i>)
                } else {
                    return (<i className="far fa-square" onClick={this.selectBoxClickHandler(true)} title="Select All" ></i>)
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
            this.setState({ sort: action })
            this.props.sort(action);
        }
    }

    menuDeleteButton = () => {
        if (this.props.public == false) {
            if (this.props.visiting == false) {
                if (this.props.selectCount > 0) {
                    return (
                        <div className="protoButton protoButtonClickable" style={{ float: "left", marginRight: 10 }} title={this.props.selectCount + " selected."}
                            onClick={() => this.clickDeleteConfirmation()}> <i className="fas fa-trash" /> DELETE</div>
                    )
                } else {
                    return (
                        <div className="protoButton" style={{ float: "left", marginRight: 10, opacity: 0.3, cursor: "not-allowed" }} title="Select some devices first..."> <i className="fas fa-trash" /> DELETE</div>
                    )
                }
            }
        }
    }

    viewButton = () => {
        if (this.state.view == "list") {
            return <i className="viewButton fas fa-map-marked-alt" title="Map View" style={{ color: "grey", marginTop: "10px", cursor: "pointer" }} onClick={this.viewButtonClicked("map")} ></i>;
        } else if (this.state.view == "map") {
            return <i className="viewButton fas fa-list-ul" title="List View" style={{ color: "grey", marginTop: "10px" }} onClick={this.viewButtonClicked("list")} ></i>;
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
                    <div className='protoPopup'>
                        <h1>Are you sure?</h1>
                        <p>Deleting a device is irreversible</p>
                        <button onClick={onClose}>No</button>

                        <button style={{ margin: "15px" }} onClick={() => {
                            //this.handleClickDelete()
                            this.props.deleteSelected()
                            onClose()
                        }}>Yes, Delete it!</button>
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
        if (searchButton == "icon") {
            return (
                <i onClick={this.changeSearch} className="fas fa-search"></i>
            )
        } else if (searchButton == "filter") {
            return (
                <div style={{ padding: 0 }}>
                    <i onClick={this.changeSearch} className="fas fa-search searchIcon"></i>
                    <form id="search" style={{ textAlign: "left" }} style={{ width: "92%", float: "right" }}>
                        <input name="query" onChange={this.props.search} style={{ width: "100%" }} />
                    </form>
                </div>
            )
        }
    }

    render() {

        return (
            < div className="container-fluid protoMenu" style={{}}>
                <Media query="(max-width: 599px)">
                    {matches =>
                        matches ? (
                            <div className="row" style={{ padding: 5 }} >
                                <span>
                                    <div className="col" style={{ flex: "0 0 35px", padding: "10px 0 0 10px" }}>
                                        {this.selectBox()}
                                    </div>
                                </span>

                                <span>
                                    <div className="col" style={{ flex: "0 0 300px", padding: "10px 10px 0 12px" }}>
                                        {/* <form id="search" style={{ textAlign: "left" }} style={{ width: "100%" }}>
                                                <input name="query" onChange={this.props.search} placeholder="filter" style={{ width: "100%" }} />
                                            </form> */}
                                        {this.changeClass()}
                                    </div >
                                </span >

                                <span className={this.state.display}>
                                    <span className="col" style={{}}>
                                        {this.menuDeleteButton()}
                                        {/* { this.props.selectCount} */}
                                    </span>

                                    <span className="col" style={{ flex: "0 0 120px" }}>
                                        {this.viewButton()}
                                        <div style={{ float: "right", marginTop: "7px", textAlign: "left", width: "20px" }}>
                                            {this.sortButtons()}
                                        </div>
                                    </span>
                                </span>
                            </div >
                        ) : (
                                <div className="row" style={{ padding: 5 }} >
                                    <div className="col" style={{ flex: "0 0 35px", padding: "10px 0 0 10px" }}>
                                        {this.selectBox()}
                                    </div>

                                    <div className="col" style={{ flex: "0 0 300px", padding: 0 }}>
                                        <form id="search" style={{ textAlign: "left" }} style={{ width: "100%" }}>
                                            <input name="query" onChange={this.props.search} placeholder="by device name or email..." style={{ width: "100%" }} />
                                        </form>
                                    </div>

                                    <div className="col" style={{ flex: "0 0 70px" }}>
                                        {this.viewButton()}
                                        <div style={{ float: "left", marginTop: "7px", textAlign: "left", width: "20px" }}>
                                            {this.sortButtons()}
                                        </div>
                                    </div>

                                    <div className="col">
                                        {this.menuDeleteButton()}
                                    </div>
                                </div>
                            )
                    }
                </Media>
            </div >
        )
    }
}
