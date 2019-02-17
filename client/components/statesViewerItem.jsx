import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import moment from 'moment'

export class StatesViewerItem extends Component {
    state = {
      timeago: "",
      timestamp: "",
      millisago: 0,
      deleted: false,
      publicButton: <i className="fas fa-eye-slash icon" style={{ color: "grey", padding: "0 5px" }}></i>,
      deleteButton: <i className="fas fa-trash-alt icon" style={{ color: "grey", padding: "0 5px" }}></i>,
      shareButton: <i className="fas fa-share-alt icon" style={{ color: "grey", padding: "0 5px" }}></i>,
      publicButtonState: "PUBLIC",
      deleteButtonClick: 0,
      selected: undefined,
      active: false,
      lastTimestamp: undefined, 
      mapIcon: <i className="fas fa-map-marker-alt marker" title="Go To Device"></i>,
      iconClicked: 0,
      device: undefined
    };
  
    intervalUpdator = undefined;

    constructor(props){
      super(props)
    }
  
    componentDidMount = () => {
      // console.log("mounted " + this.props.device.devid)
  
      this.intervalUpdator = setInterval(() => {
        this.updateTime();
      }, 1000 / 10)
    }
  
    componentDidUpdate = () => {
      //console.log("update "+this.props.device.devid)
    }
  
    componentWillUnmount = () => {
      clearInterval(this.intervalUpdator)
    }
  
    updateTime = () => {
      if (this.props.device["_last_seen"]) {
        var lastChange = new Date(this.props.device["_last_seen"]);
        var millisago = Date.now() - lastChange.getTime();
        var timeago = moment(this.props.device["_last_seen"]).fromNow()
        this.setState({ timeago, millisago })
      }
    }
  
    blendrgba(x, y, ratio) {
  
      if (ratio <= 0) {
        return "rgba(" + Math.round(x.r) + "," + Math.round(x.g) + "," + Math.round(x.b) + "," + x.a + ")"
      } else if (ratio >= 1) {
        return "rgba(" + Math.round(y.r) + "," + Math.round(y.g) + "," + Math.round(y.b) + "," + y.a + ")"
      } else {
        var blended = {
          r: (x.r * (1 - ratio)) + (y.r * ratio),
          g: (x.g * (1 - ratio)) + (y.g * ratio),
          b: (x.b * (1 - ratio)) + (y.b * ratio),
          a: (x.a * (1 - ratio)) + (y.a * ratio),
        }
        return "rgba(" + Math.round(blended.r) + "," + Math.round(blended.g) + "," + Math.round(blended.b) + "," + blended.a + ")"
      }
  
      //return "rgba(255,255,255,1)"
    }
  
    calcStyle = () => {
      var timefade = 3000;
  
      var lastChange = new Date(this.props.device["_last_seen"]);
      var millisago = Date.now() - lastChange.getTime();
      var ratio = (timefade - millisago) / timefade;
  
      //var ratio = (timefade-this.state.millisago)/timefade;
      if (ratio < 0) { ratio = 0 }
      if (ratio > 1) { ratio = 1 }
  
      if (this.props.device.selected) {
        return {
          marginBottom: 2, padding: "0px",
          backgroundImage: "linear-gradient(to right, rgb(94, 37, 45), " + this.blendrgba({ r: 3, g: 4, b: 5, a: 0.5 }, { r: 125, g: 255, b: 175, a: 0.75 }, (ratio / 1.5) - 0.35) + ")",
          borderRight: "2px solid " + this.blendrgba({ r: 60, g: 19, b: 25, a: 0 }, { r: 125, g: 255, b: 175, a: 1.0 }, ratio),
          borderLeft: "2px solid rgb(255, 57, 67)"
        }
      } else {
        return {
          marginBottom: 2, padding: "0px",
          backgroundImage: "linear-gradient(to right, rgba(3, 4, 5, 0.5)," + this.blendrgba({ r: 3, g: 4, b: 5, a: 0.5 }, { r: 125, g: 255, b: 175, a: 0.75 }, (ratio / 1.5) - 0.35) + ")",
          borderRight: "2px solid " + this.blendrgba({ r: 60, g: 19, b: 25, a: 0 }, { r: 125, g: 255, b: 175, a: 1.0 }, ratio)
        }
      }
    }
  
    descIfExists = () => {
      if (this.props.device.desc) {
        return <span style={{ color: "rgba(125,255,175,0.5)" }}>{this.props.item.desc}</span>
      } else {
        return <span></span>
      }
    }
  
    clickDeleteConfirmation = (id) => {
      return (event) => {
  
        confirmAlert({
          type: 'warning',
          title: 'Are you sure?',
          message: 'Deleting a device is irreversible',
          buttons: [
            {
              label: 'Yes',
              onClick: () => this.deleteEntry(id)
            },
            {
              label: 'No',
              onClick: () => { }
            }
          ]
        })
      }
    };
  
    deleteEntry = (id) => {
      fetch("/api/v3/state/delete", {
        method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ id: id })
      }).then(response => response.json()).then(serverresponse => {
        console.log(serverresponse);
        this.setState({ deleted: true })
      }).catch(err => console.error(err.toString()));
    }
  
    dialog() {
      if (this.state.dialog) {
        return (
          <div className="container" style={{ color: "red" }}>
          </div>
        );
      }
    }
  
    goToDevice = (id) => {
      return (e) => {
        window.location = '/view/' + id;
      }
    }
  
    changeStatus = (id) => {
      return (event) => {
        if (this.state.publicButtonState == "PUBLIC") {
          this.setState({ publicButton: <i className="far fa-eye icon" style={{ color: "grey", padding: "5px" }}></i> });
          this.setState({ publicButtonState: "PRIVATE" });
        }
  
        if (this.state.publicButtonState == "PRIVATE") {
          this.setState({ publicButton: <i className="fas fa-eye-slash icon" style={{ color: "grey", padding: "5px" }}></i> });
          this.setState({ publicButtonState: "PUBLIC" });
        }
  
        if (this.state.deleteButtonClick == 1) {
        }
      }
    }
  
    clickShare = () => {
      return () => {
  
      }
    }
  
    selectBoxClickHandler = (action) => {
      return (e) => {
        this.props.actionCall(action)
      }
    }

    adjustMapView = (device) => {
      var action;
      action = true;
      return (e, n) => {
        this.props.mapActionCall(device, action);
      }
    }
  
    selectbox = () => {
      
      if (this.props.device.selected) {
        
        return (
          <div className="col" style={{ flex: "0 0 25px", padding: 0, cursor: "pointer" }} onClick={this.selectBoxClickHandler("deselect")} >
            <i className="statesViewerCheckBoxes fas fa-check" style={{ color: "rgb(250, 69, 72)", filter: "drop-shadow(0px 0px 10px rgba(255, 255, 255, 0.35))" }}></i>
          </div>
        )
      } else {
        return (
          <div className="col statesViewerCheckBoxDiv" style={{ flex: "0 0 25px", padding: 0, cursor: "pointer" }} onClick={this.selectBoxClickHandler("select")} >
            <i className="statesViewerCheckBoxes fas fa-check" ></i>
          </div>
        )
      }
    }

    mapIcon = () => {

      if(!this.props.device.selectedIcon){
        return(
          <div align="right" style={{ marginTop: "7px", width: "auto", height: "auto" , fontSize: 15 }} onClick={this.adjustMapView(this.props.device)}>
            <i className="fas fa-map-marker-alt marker" title="Go To Device"></i>  
          </div>
        )
      }else{
        return(
          <div align="right" style={{ marginTop: "7px", width: "auto", height: "auto" , fontSize: 15 }} onClick={this.adjustMapView(this.props.device)}>
            <i style={{ color: "red" }} className="fas fa-map-marker-alt marker" title="Go To Device"></i>  
          </div>
        )
      }
    }

    

    // changeMapIcon = (device) => {
    //   if(device.selectedIcon){
    //     this.setState({ iconClicked: 1})
    //     this.setState({ mapIcon:  <i style={{ color: "red" }} className="fas fa-map-marker-alt marker" title="Go To Device"></i>})
    //   }else if(!device.selectedIcon){
    //     this.setState({ mapIcon:  <i className="fas fa-map-marker-alt marker" title="Go To Device"></i>})
    //     this.setState({ iconClicked: 0})
    //   }
    // }
  
    render() {
  
      if (this.props.device == undefined) {
        return (<div></div>)
      }
  
      if (this.state.deleted == true) {
        return (<div style={{ display: "none" }}></div>);
      } else {
        var dataPreview = JSON.stringify(this.props.device.payload.data)
        var maxlength = 120;
        if (dataPreview.length > maxlength) { dataPreview = dataPreview.slice(0, maxlength) + "..." }
        var viewUsed = this.props.view
        if( viewUsed == "list"){
          return (
            <div className="container-fluid" style={{ marginBottom: 2 }}>
              <div className="row statesViewerItem" style={this.calcStyle()} >
    
                {this.selectbox()}
    
                <Link className="col" to={"/u/" +this.props.username +"/view/"+ this.props.device.devid} style={{ overflow: "hidden" }}>
                  <div>
                    <span style={{ color: "#fff" }}> {this.props.device.devid} </span> {this.descIfExists()}<br />
                    <span className="faded" style={{ fontSize: 12, color: "rgba(225,255,225,0.5)" }} >{dataPreview}</span>
                  </div>
                </Link>
    
                <div className="col" style={{ flex: "0 0 120px", textAlign: "right" }}>
                  {/* <span className="trash" onClick={this.clickDeleteConfirmation(this.props.devID)}>{this.state.deleteButton}</span>
                  <span className="visibility" onClick={this.changeStatus(this.props.id)}>{this.state.publicButton}</span>
                  <span className="share" onClick={this.clickShare()}>{this.state.shareButton}</span> */}
                </div>
    
                <div className="col" style={{ flex: "0 0 230px", textAlign: "right" }}>
                  <span style={{ fontSize: 12 }}>{this.state.timeago}</span><br />
                  <span className="faded" style={{ fontSize: 12 }}>{this.props.device["_last_seen"]}</span>
                </div>
    
              </div>
            </div>
          );
        }else if(viewUsed == "map"){
          return(
            <div className="container-fluid" style={{ marginBottom: 2 }}>
              <div className="row statesViewerItemMap" style={this.calcStyle()} >
    
                {this.selectbox()}

                <Link className="col" to={"/u/" +this.props.username +"/view/"+ this.props.device.devid} title="View Device Data">
                  <div style={{ overflow: "hidden", marginTop: "5px" }}>
                    <span style={{ color: "#fff" }}> {this.props.device.devid} </span> {this.descIfExists()}<br />
                  </div>
                </Link>

                <div className="col" align="right" style={{marginTop: "4px"}}>
                  <span style={{ fontSize: 12, color: "#fff" }}>{this.state.timeago}</span>
                </div>
                
                <div className="col" style={{ flex: "0 0 40px", textAlign: "right" }}>  
                  { this.mapIcon() }
                </div>
              </div>
            </div>
          )
        }
      }
    }
  }
  