import React, { Component } from "react";
import { confirmAlert } from 'react-confirm-alert';

export class StatesViewerMenu extends Component {
    state = { selectAll : false, sort : "", view: "map", boundary: undefined}

    selectBox = () => {
        if (this.state.selectAll) {
            return ( <i className="fas fa-check-square" onClick={this.selectBoxClickHandler(false)} title="Deselect All" ></i> )
        } else {
            return ( <i className="far fa-square" onClick={this.selectBoxClickHandler(true)} title="Select All" ></i> )
        }
    }

    selectBoxClickHandler = (action) => {
        return (e) => {
            this.setState({selectAll:action})
            this.props.selectAll(action)
        }
    }

    sortButtons = () => {
        if (this.state.sort == "") { return <i className="stateSortButton fas fa-sort-amount-down" title="latest created top"  onClick={this.sortClickHandler("timedesc")} ></i> }
        if (this.state.sort == "timedesc") { return <i className="stateSortButton fas fa-sort-numeric-down" title="last seen top" onClick={this.sortClickHandler("namedesc")} ></i> }
        if (this.state.sort == "namedesc") { return <i className="stateSortButton fas fa-sort-alpha-down" title="alphabetical" onClick={this.sortClickHandler("")} ></i> }
    }

    sortClickHandler = ( action ) => {
        return (e) => {
            this.setState({sort:action})
            this.props.sort(action);
        }
    }

    menuDeleteButton = () => {
        if (this.props.selectCount > 0) {
            return (
                <div className="protoButton protoButtonClickable" style={{ float: "left", marginRight: 10 }} title={ this.props.selectCount + " selected."}
                onClick={() => this.clickDeleteConfirmation()}> <i className="fas fa-trash" /> DELETE</div>
            )
        } else {
            return (
                <div className="protoButton" style={{ float: "left", marginRight: 10, opacity: 0.3, cursor: "not-allowed" }} title="Select some devices first..."> <i className="fas fa-trash" /> DELETE</div>
            )
        }
        
    }

    viewButton = () => {
        if(this.state.view == "list"){
            return <i className="viewButton fas fa-map-marked-alt" title="Map View" style={{color:"grey",marginTop: "10px", cursor: "pointer"}} onClick={ this.viewButtonClicked("map") } ></i>;
        }else if(this.state.view == "map"){
            return <i className="viewButton fas fa-list-ul" title="List View" style={{color:"grey",marginTop: "10px"}} onClick={ this.viewButtonClicked("list") } ></i>;
        } 
    }

    boundaryButton = () => {
        if(this.state.view == "map"){
            if(this.props.boundary == true){
                return <i className="viewButton fas fa-exclamation" title="Create Boundary" style={{color:"grey", marginTop: "10px", marginRight: "22px"}} onClick={()=>this.boundaryButtonClicked(this.props.devid) }></i>;
            }else if(!this.state.boundary || this.state.boundary == undefined){
                return <i className="viewButton fas fa-exclamation" title="Select A Device" style={{color:"grey", marginTop: "10px", marginRight: "22px", opacity: 0.3, cursor: "not-allowed"}}></i>;
            }
        }else{
            return <span style={{ marginTop: "10px", marginRight: "22px" }}></span>;
        }
    }

    boundaryButtonClicked = (device) => {
        var device = this.props.deviceCall;
        var lat = device.payload.data.gps.lat;
        var lon = device.payload.data.gps.lon;
        fetch("/api/v3/data/post", {
            apikey : this.props.acc.apikey,
            method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ id: this.props.deviceCall.devid, data: {boundary:{lat:lat, lon:lon, radius: 200}} })
        }).then(response => response.json()).then(serverresponse => {
            console.log(serverresponse)
        }).catch(err => {console.error(err.toString());});
    }

    viewButtonClicked = (action) => {
        return (e) => {
            this.setState({ view:action })
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
                  
                  <button style = {{ margin:"15px" }} onClick={() => {
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

    setBoundary = (b) => {
        this.setState({ boundary: this.props.boundary });
        return(
            <div></div>
        )
    }

    render() {

        return (
            <div className="container-fluid protoMenu" style={{  }}>
                <div className="row" style={{ padding: 5 }} >
                    <div className="col" style={{ flex: "0 0 35px", padding: "10px 0 0 10px" }}>
                        {this.selectBox() }
                    </div>

                    <div className="col" style={{ flex: "0 0 300px", padding: 0 }}>
                        <form id="search" style={{ textAlign: "left" }} style={{width: "100%"}}>
                            <input name="query" onChange={this.props.search} placeholder="filter" style={{width: "100%"}} />
                        </form>                        
                    </div>

                    <div className="col" style={{ }}>
                        { this.menuDeleteButton() }
                        {/* { this.props.selectCount} */}
                    </div>

                    <div className="col" style={{ flex: "0 0 120px" }}>  
                        { this.boundaryButton(this.props.deviceCall) }
                        { this.viewButton() }
                        <div style={{float:"right", marginTop: "7px", textAlign:"left", width: "20px"}}>
                            { this.sortButtons() }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
