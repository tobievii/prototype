import React, { Component } from "react";
import moment from 'moment'
import Moment from 'react-moment';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortNumericDown, faSortAlphaDown, faSortAmountDown } from '@fortawesome/free-solid-svg-icons'
import * as _ from "lodash"

import * as p from "../prototype.ts"

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import { StatesViewerMenu } from "./statesViewerMenu.jsx"

library.add(faSort)
library.add(faSortNumericDown);
library.add(faSortAlphaDown);
library.add(faSortAmountDown);


import socketio from "socket.io-client";


class StatesViewerItem extends Component {
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
    lastTimestamp: undefined
  };

  intervalUpdator = undefined;

  componentDidMount = () => {
    console.log("mounted " + this.props.device.devid)

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

  clickDelete = (id) => {
    return (event) => {
      if (this.state.deleteButtonClick == 0) {
        this.setState({ deleteButton: "ARE YOU SURE?" });
        this.setState({ deleteButtonClick: 1 });
        this.setState({ publicButton: "YES" });
        this.setState({ shareButton: "NO" });
        return;
      }

      if (this.state.deleteButtonClick == 1) {
        fetch("/api/v3/state/delete", {
          method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ id: id })
        }).then(response => response.json()).then(serverresponse => {
          this.setState({ deleted: true })
        }).catch(err => console.error(err.toString()));
      }
    }
  }



  changeStatus = (id) => {
    return (event) => {
      if (this.state.publicButtonState == "PUBLIC" && this.state.deleteButtonClick == 0) {
        this.setState({ publicButton: <i className="far fa-eye icon"></i> });
        this.setState({ publicButtonState: "PRIVATE" });
      }

      if (this.state.publicButtonState == "PRIVATE" && this.state.deleteButtonClick == 0) {
        this.setState({ publicButton: <i className="fas fa-eye-slash icon"></i> });
        this.setState({ publicButtonState: "PUBLIC" });
      }

      if (this.state.deleteButtonClick == 1) {
        fetch("/api/v3/state/delete", {
          method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ id: id })
        }).then(response => response.json()).then(serverresponse => {
          this.setState({ deleted: true })
        }).catch(err => console.error(err.toString()));
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

  selectbox = () => {
    if (this.props.device.selected) {
      return (
        <div className="col" style={{ flex: "0 0 25px", padding: 0, cursor: "pointer" }} onClick={this.selectBoxClickHandler("deselect")} >
          <i className="statesViewerCheckBoxes fas fa-check" style={{ color: "rgb(250, 69, 72)", filter: "drop-shadow(0px 0px 10px rgba(255, 255, 255, 0.35))" }}></i>
        </div>
      )
    } else {

      if(this.state.selectBoxClicked === 0){
        this.setState({ selectBoxClicked: 100 });
      }

      return (
        <div className="col statesViewerCheckBoxDiv" style={{ flex: "0 0 25px", padding: 0, cursor: "pointer" }} onClick={this.selectBoxClickHandler("select")} >
          <i className="statesViewerCheckBoxes fas fa-check" ></i>
        </div>
      )
    }

  }

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

      return (
        <div className="container-fluid" style={{ marginBottom: 2 }}>
          <div className="row statesViewerItem" style={this.calcStyle()} >

            {this.selectbox()}


            <Link className="col" to={"/view/" + this.props.device.devid} style={{ overflow: "hidden" }}>
              <div>
                <span style={{ color: "#fff" }}> {this.props.device.devid} </span> {this.descIfExists()}<br />
                <span className="faded" style={{ fontSize: 12, color: "rgba(225,255,225,0.5)" }} >{dataPreview}</span>
              </div>
            </Link>

            <div className="col" style={{ flex: "0 0 120px", textAlign: "right" }}>
              <span className="trash" onClick={this.clickDelete(this.props.id)}>{this.state.deleteButton}</span>
              <span className="visibility" onClick={this.changeStatus(this.props.id)}>{this.state.publicButton}</span>
              <span className="share" onClick={this.clickShare()}>{this.state.shareButton}</span>
            </div>

            <div className="col" style={{ flex: "0 0 230px", textAlign: "right" }}>
              <span style={{ fontSize: 12 }}>{this.state.timeago}</span><br />
              <span className="faded" style={{ fontSize: 12 }}>{this.props.device["_last_seen"]}</span>
            </div>

          </div>
        </div>
      );
    }


  }
}



export class Pagination extends Component {

  onClick = (button) => {
    return evt => {

      this.props.onPageChange(button)
    }
  }

  calcClass = (button) => {
    if (button.active) {
      return "pagination paginationActive"
    } else {
      return "pagination"
    }

  }

  render() {
    if (this.props.pages.length > 1) {
      return (<div>
        {
          this.props.pages.map((button, i) => <div key={i} onClick={this.onClick(button)} className={this.calcClass(button)} >{button.text}</div>)
        }
      </div>)
    } else {
      return (<div></div>)
    }


  }
}


export class DeviceList extends Component {

  state = {
    activePage: 1
  }

  onPageChange = (data) => {
    this.setState({ activePage: data.text })
  }

  handleActionCall = (a) => {
    return (e) => {
      this.props.actionCall({ a, e })
    }
  }

  render() {

    if (this.props.devices == undefined) {
      return null
    }

    var pagesNum = Math.ceil(this.props.devices.length / this.props.max);


    //if (pagesNum < this.state.activePage) { this.setState({activePage : 1 })}




    var pages = [];
    for (var a = 1; a <= pagesNum; a++) {
      pages.push({ text: a, active: (this.state.activePage == a) });
    }


    if (this.props.devices.length == 0) {
      return (
        <div className="row " style={{ opacity: 0.5 }}>
          <div className="col-12" style={{ padding: "0 5px 0 5px" }}>
            <div className="commanderBgPanel" style={{ margin: 0 }}>
              <center>No devices to display.</center>
            </div>
          </div>
        </div>
      )
    } else {

      var devicelist = _.clone(this.props.devices);

      if (this.props.max) {
        var start = this.props.max * (this.state.activePage - 1)
        var end = this.props.max * this.state.activePage
        devicelist = devicelist.slice(start, end);
      }

      if (devicelist.length == 0) {
        if (this.state.activePage != 1) {
          this.setState({ activePage: 1 })
        }
      }

      return (
        <div>
          {devicelist.map(device => <StatesViewerItem actionCall={this.handleActionCall(device.devid)} key={device.key} device={device} />)}
          <div style={{ marginLeft: -9 }}> <Pagination pages={pages} className="row" onPageChange={this.onPageChange} /> </div>
        </div>
      )
    }
  }
}

export class StatesViewer extends Component {
  state = {
    search: "",
    sort: "",
    devicesServer: [],
    devicesView: [],
    checkboxstate: "Select All",
    boxtick: "far fa-check-square",
    publicButton: "",
    deleteButton: "",
    shareButton: "",
  };

  socket = undefined;
  busyGettingNewDevice = false;

  constructor(props) {
    super(props)

    this.socket = socketio();

    this.socket.on("connect", a => {
      console.log("socket connected")
      //this.loadList();

      this.socket.emit("join", this.props.username)
      this.socket.on("info", (info) => {
        console.log(info);
        if (info.newdevice) {

        }
      })

      this.socket.on("post", (packet) => {
        this.handleDevicePacket(packet)
      })
    });



    p.statesByUsername(this.props.username, (states) => {
      for (var s in states) {
        states[s].selected = false
      }
      this.setState({ devicesServer: states }, () => {

        for (var device in this.state.devicesServer) {
          this.socket.emit("join", this.state.devicesServer[device].key);
        }

        this.setState({ devicesView: states }, () => {
          //this.socketConnectDevices();
          //this.sort();
        })
      })
    })
  }

  getNewDevice = () => {
    if (this.busyGettingNewDevice == true) {
      console.log("already busy.. please wait")
    } else {
      console.log("getting new device(s)")
      p.statesByUsername(this.props.username, (states) => {
        console.log(states);
      });
    }
  }

  componentWillUnmount = () => { 
    this.socket.disconnect(); 
  }



  handleDevicePacket = (packet) => {
    var devices = _.clone(this.state.devicesServer)
    var found = 0;
    for (var dev in devices) {
      if (devices[dev].devid == packet.id) {
        found = 1;
        devices[dev]["_last_seen"] = packet.timestamp;
        devices[dev].payload = _.merge(devices[dev].payload, packet)        
      }
    }



    if (found == 0) {
      // new device?
      // this.loadList()
      console.log("recieved data for device not on our list yet.")
    } else {
      // update
      this.setState({ devicesServer: devices })
      this.setState({ devicesView: devices }, () => {
        this.sort()
      })
    }


  }

  search = evt => {
    this.setState({ search: evt.target.value.toString() }, () => {
      var newDeviceList = []
      //filter
      for (var device of this.state.devicesServer) {
        if (this.state.search.length > 0) {
          if (device.devid.toString().toLowerCase().includes(this.state.search.toLowerCase())) {
            newDeviceList.push(device)
          }
        } else {
          newDeviceList.push(device)
        }
      }
      //end filter
      this.setState({ devicesView: newDeviceList }, this.selectCountUpdate)
    })

  }

  sort = (sorttype) => {
    var value;
    if (sorttype != undefined) {
      value = sorttype;
      this.setState({ sort: value })
    } else {
      value = this.state.sort;
    }

    var newDeviceList = _.clone(this.state.devicesView)

    if (value == "timedesc") {
      newDeviceList.sort((a, b) => {
        if (new Date(a["_last_seen"]) > new Date(b["_last_seen"])) {
          return 1
        } else {
          return -1
        }
      }).reverse();
    }

    if (value == "namedesc") {
      newDeviceList.sort((a, b) => {
        if (a.devid >= b.devid) {
          return 1
        } else { return -1 }
      })
    }

    if (value == "") {
      newDeviceList.sort((a, b) => {
        if (new Date(a["_created_on"]) > new Date(b["_created_on"])) {
          return 1
        } else {
          return -1
        }
      }).reverse();
    }

    this.setState({ devicesView: newDeviceList }, this.selectCountUpdate)

  }

  selectCountUpdate = () => {
    var selectCount = 0;
    for (var dev in this.state.devicesView) {
      if (this.state.devicesView[dev].selected) {
        selectCount++;
      }
    }
    this.setState({selectCount : selectCount})
  }

  selectAll = (value) => {
    var newDeviceList = _.clone(this.state.devicesView)

    if (value == true) {
      for (var dev in newDeviceList) {
        newDeviceList[dev].selected = true;
      }
      this.setState({ devicesView: newDeviceList }, this.selectCountUpdate)
    }
    if (value == false) {
      
      for (var dev in newDeviceList) {
        newDeviceList[dev].selected = false;
      }
      this.setState({ devicesView: newDeviceList }, this.selectCountUpdate)
    }

    

  }

  deleteAll = () => {
      var newDeviceList = _.clone(this.state.devicesView)

      for (var dev in newDeviceList) {
        fetch("/api/v3/state/delete", {
          method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ id: newDeviceList[dev].devid })
        }).then(response => response.json()).then(serverresponse => {
          console.log(serverresponse);
        }).catch(err => console.error(err.toString()));
      }

      this.setState({ deleteButton: ""})
      this.setState({ publicButton: ""})
      this.setState({ shareButton:  ""})
      this.loadList();
    }

  handleActionCall = (clickdata) => {
    var newDeviceList = _.clone(this.state.devicesView)
    for (var dev in newDeviceList) {
      if (newDeviceList[dev].devid == clickdata.a) {
        if (clickdata.e == "deselect") { newDeviceList[dev].selected = false; }
        if (clickdata.e == "select") { newDeviceList[dev].selected = true; }
      }
    }
    this.setState({ devicesView: newDeviceList } , this.selectCountUpdate );
  }

  render() {
    return (
      <div className="" style={{ paddingTop: 25, margin: 30 }} >
        <StatesViewerMenu search={this.search} selectAll={this.selectAll} sort={this.sort} selectCount={this.state.selectCount} />
        <DeviceList devices={this.state.devicesView} max={15} actionCall={this.handleActionCall} />
      </div>
    )
  }
}
