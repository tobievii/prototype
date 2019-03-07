import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Stats } from "./stats.jsx"

import SyntaxHighlighter from "react-syntax-highlighter";
import { tomorrowNightBright } from "react-syntax-highlighter/styles/hljs";
import * as _ from "lodash"
import { confirmAlert } from 'react-confirm-alert';
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faHdd, faEraser } from "@fortawesome/free-solid-svg-icons";
import { DevicePluginPanel } from "../plugins/iotnxt/iotnxt_device.jsx";
import Modal from 'react-modal';
import { DataView } from "./dataView.jsx";
import Media from "react-media";

import moment from 'moment'

library.add(faHdd);
library.add(faTrash);
library.add(faEraser);


import * as p from "../prototype.ts"

import socketio from "socket.io-client";

import { Dashboard } from "./dashboard/dashboard.jsx"
import { Editor } from "./editor.jsx"
var loggedInUser = "";
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

export class DeviceView extends Component {
  state = {
    devid: undefined,
    lastTimestamp: "no idea",
    packets: [],
    socketDataIn: {},
    getPackets: false,
    trashClicked: 0,
    trashButtonText: "DELETE DEVICE",
    clearStateClicked: 0,
    eraseButtonText: "CLEAR STATE",
    sharebuttonText: "SHARE DEVICE",
    view: undefined,
    apiMenu: 1,
    isOpen: false,
    stats: {},
    tempstat: [],
    search: "",
    userSearched: "Search For users above",
    SelectedUsers: [],
    DeviceSharedEmails: [],
    EmailsharedDevice: [],
    display: "",
    EditorButton: " SHOW EDITOR",
    shareDisplay: "",
    editorChanged: false,
    devicesServer: undefined,
    shared: [],
    Devicestate: "SHARE PUBLICLY",
    DevicestateIcon: "fas fa-eye"
  };

  socket;

  constructor(props) {
    super(props);

    this.socket = socketio();
    this.state.devid = props.devid
    this.socket.on("connect", a => {
      this.socket.on("post", (packet) => {
        this.updateView(packet)
      })
    });
    this.State = {
      showMe: false
    }
    p.statesByUsername(this.props.username, (states) => {
      for (var s in states) {
        states[s].selected = false
        if (states[s].devid == this.props.devid) {
          states[s].selectedIcon = true;
        }
      }
      this.setState({ devicesServer: states })
    })
  }

  handleActionCall = (clickdata) => {
    var newEmailList = _.clone(this.state.userSearched)
    var temp = [];
    for (var dev in newEmailList) {
      if (newEmailList[dev] == clickdata) {
        if (clickdata.selected == "deselected") {
          newEmailList[dev].selected = "selected";
        }
        else {
          newEmailList[dev].selected = "deselected";
        }
        temp = newEmailList.filter((users) => { return users.selected !== "deselected" })
        this.state.SelectedUsers = _.clone(temp)
      }
    }
  }
  unshare = (remove) => {
    for (let i in this.state.userSearched) {
      if (remove == this.state.userSearched[i].uuid) {
        this.state.userSearched[i].shared = "no";
      }
    }
    fetch("/api/v3/unshare", {
      method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ removeuser: remove, dev: this.props.devid, })
    }).then(response => response.json()).then(stats => {
      this.setState({ stats: stats })
    }).catch(err => console.error(err.toString()));
  }

  search = evt => {
    this.setState({ search: evt.target.value.toString() }, () => {
      var temp = [];
      var newDeviceList = [];
      this.state.stats.userList.map((person, i) => {
        temp = [...temp, person.email]
        if (person.email.toLowerCase().includes(this.state.search.toLowerCase())) {
          newDeviceList.push(person);
        } else {
          newDeviceList.push("|");
        }
      });
      temp = newDeviceList.filter((users) => { return users !== "|" && users.email !== loggedInUser.email })
      for (var look in this.state.shared) {
        for (var i in temp) {
          if (temp[i].uuid == this.state.shared[look]) {
            temp[i].shared = "yes"
          }
        }
      }
      this.setState({ userSearched: temp })
    })
  }

  selectedNameList = () => {

    try {
      return (<div>
        {
          this.state.SelectedUsers.map((user, i) => {
            return <p id={user.email} style={{ float: "left", color: "rgb(127,255,0)", textOverflow: "ellipsis", overflow: "hidden", margin: 0, padding: 0 }}> |{user.email}| </p>
          })
        }
      </div>)
    } catch (err) { }
  }

  userNameList = () => {

    try {
      return (<div style={{ height: "20%" }}>
        {
          this.state.userSearched.map((user, i) => {
            if (user.shared == "no") {
              return <div id={user.email} className="commanderBgPanel commanderBgPanelClickable" >{user.email} <input type="checkbox" style={{ float: "right" }} onClick={(e) => this.handleActionCall(user)} /> </div>
            }
            else {
              return <div id={user.email} className="commanderBgPanel commanderBgPanelClickable" >{user.email} <div style={{ float: "right" }} onClick={(e) => this.unshare(user.uuid)}>Revoke Sharing </div></div>
            }
          })
        }
      </div>)
    } catch (err) { }
  }

  emailsEmailedWith = () => {
    try {
      return (<div>
        {
          this.state.EmailsharedDevice.map((user, i) => {
            return <div id={user.email} className="" style={{ color: "rgb(127,255,0)" }}> |{user.email}|<input type="checkbox" style={{ float: "right" }} />  </div>
          })
        }
      </div>)
    } catch (err) { }
  }

  updateView = (packet) => {
    var view = _.clone(this.state.view);
    view = _.merge(view, packet)

    // should be same as DB.states for this device.
    var state = _.clone(this.state.state);
    state.payload = _.merge(state.payload, packet);
    state["_last_seen"] = packet.timestamp;
    this.setState({ view, state })
  }

  updateTime = () => {
    if (this.state.view) {
      if (this.state.view.timestamp) {
        var timeago = moment(this.state.view.timestamp).fromNow()
        this.setState({ timeago })
      }
    }
  }

  componentWillMount() {
    // should not get stats here? i think it should be /api/v3/users
    Modal.setAppElement('body');
    fetch("/api/v3/stats", {
      method: "GET", headers: { "Accept": "application/json", "Content-Type": "application/json" }
    }).then(response => response.json()).then(stats => {
      this.setState({ stats: stats })
    }).catch(err => console.error(err.toString()));
  }

  componentDidMount = () => {
    this.updateTime();
    setInterval(() => {
      this.updateTime();
    }, 500)


    fetch("/api/v3/view", {
      method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ id: this.props.devid, username: this.props.username })
    }).then(response => response.json()).then(view => {
      if (view.error) {
      } else {
        this.setState({ view })
      }

    }).catch(err => console.error(err.toString()));

    fetch("/api/v3/account", {
      method: "GET", headers: { "Accept": "application/json", "Content-Type": "application/json" }
    }).then(response => response.json()).then(account => {

      var loggedin = account.apikey
      var owner = this.state.state.apikey

      if (loggedin != owner && this.props.account.level < 100) {
        this.setState({ shareDisplay: "none" })
      }
      else {
        this.setState({ shareDisplay: "" })
      }

    }).catch(err => console.error(err.toString()));

    fetch("/api/v3/state", {
      method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ id: this.props.devid, username: this.props.username })
    }).then(response => response.json()).then(state => {


      this.setState({ state }, () => {
        if (state.error) {
          console.log(state.error)
        } else {
          this.socket.emit("join", state.key)
        }
      })
    }).catch(err => console.error(err.toString()));

  }

  sharedList = () => {
    fetch("/api/v3/shared", {
      method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ dev: this.props.devid, })
    }).then(response => response.json()).then(states => {
      if (states.access) {
        var shared = _.clone(states.access)
        this.setState({ shared })
      }
    })
  }

  componentWillUnmount = () => {
    this.socket.disconnect();
  }

  getName() {
    return "device name/id";
  }

  latestTimestamp() {
    return "no idea";
  }

  deleteDevice = (id) => {
    // deletes a device's state and packet history
    if (this.state.trashClicked >= 0) {
      this.setState({ trashClicked: 1 })
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className='protoPopup'>
              <h1>Are you sure?</h1>
              <p>Deleting a device is irreversible</p>
              <button onClick={onClose}>No</button>

              <button style={{ margin: "15px" }} onClick={() => {
                {
                  fetch("/api/v3/state/delete", {
                    method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                    body: JSON.stringify({ id: id, username: this.props.username })
                  }).then(response => response.json()).then(serverresponse => {
                    window.location.href = "/"
                  }).catch(err => console.error(err.toString()));
                }
              }}>Yes, Delete it!</button>
            </div>
          )
        }
      })
      return;
    }
  };

  dialog() {
    if (this.state.dialog) {
      return (
        <div className="container" style={{ color: "red" }}>
        </div>
      );
    }
  }

  getMenuClasses = function (num) {
    if (num == this.state.apiMenu) {
      return "menuTab borderTopSpot"
    } else {
      return "menuTab menuSelectable"
    }
  }

  ShareButton = () => {
    if (this.state.SelectedUsers.length > 0) {
      return (
        <div className="protoButton"
          onClick={this.shareDevice} style={{ float: "right", cursor: "pointer" }}> <i className="fas fa-share-alt" /> {this.Devicestate}</div>
      )
    } else {
      return (
        <div className="protoButton" style={{ opacity: 0.3, cursor: "not-allowed", float: "right" }} ><i className="fas fa-share-alt" />  SHARE DEVICE</div>
      )
    }
  }
  getMenuPageStyle = function (num) {
    if (num == this.state.apiMenu) {
      return { display: "" }
    } else {
      return { display: "none" }
    }
  }

  onClickMenuTab = function (num) {
    return (event) => {
      /*
      console.log(event);
      event.currentTarget.className = "col-md-2 menuTab borderTopSpot";
      console.log(num)
      */
      var apiMenu = num;
      this.setState({ apiMenu });


    }
  }

  toggle_div() {
    this.setState({
      showMe: !this.state.showMe
    })
  }

  clearState = () => {
    //clears state, but retains history and workflow

    if (this.state.clearStateClicked >= 0) {
      this.setState({ clearStateClicked: 1 });
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className='protoPopup'>
              <h1>Are you sure?</h1>
              <p>Clearing A State is irreversible</p>
              <button onClick={onClose}>No</button>

              <button style={{ margin: "15px" }} onClick={() => {
                //this.handleClickDelete()
                {
                  fetch("/api/v3/state/clear", {
                    method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                    body: JSON.stringify({ id: this.state.devid, username: this.props.username })
                  }).then(response => response.json()).then(serverresponse => {
                    window.location.reload()
                  }).catch(err => console.error(err.toString()));
                }
              }}>Yes, Clear it!</button>
            </div>
          )
        }
      })
      return;
    }
  };

  shareDevice = () => {
    this.state.EmailsharedDevice = _.clone(this.state.SelectedUsers) //#region 
    for (let dev in this.state.EmailsharedDevice) {
      for (let i in this.state.userSearched) {
        if (this.state.EmailsharedDevice[dev].email == this.state.userSearched[i].email) {
          this.state.userSearched[i].shared = "yes";
        }
      }
      fetch("/api/v3/admin/shareDevice", {
        method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          email: this.state.EmailsharedDevice[dev].email,
          text: 'Hi a Device was shared with you called ' + this.props.devid,
          html: '<p>Hi <br></br>' + this.props.username + ' has shared (' + this.props.devid + ') Device with you </p>',
          subject: 'SHARED DEVICE',
          dev: this.props.devid,
          person: this.props.username
        })
      }).then(response => response.json()).then(serverresponse => {
      }).catch(err => console.error(err.toString()));
    }
    this.setState({ SelectedUsers: [] })
    this.setState({ isOpen: !this.state.isOpen })
  }
  toggleModal = () => {
    this.sharedList();
    this.setState({ isOpen: !this.state.isOpen })
  }

  drawState = () => {
    if (this.state.state) {
      return (
        <div style={{ maxWidth: "400px", overflow: "hidden", margin: 0, padding: 0 }}>
          <SyntaxHighlighter language="javascript" style={tomorrowNightBright} >{JSON.stringify(this.state.state.payload, null, 2)}</SyntaxHighlighter>
        </div>
      )
    } else {
      return (
        <div></div>
      )
    }

  }

  hideEditor = () => {

    if (this.state.editorChanged == true) {
      if (confirm('Are you sure? Any unsaved code will be discarded') == true) {
        this.state.display = ""
        this.state.EditorButton = "SHOW EDITOR";
        this.toggle_div();
      } else return;

    } else {
      this.state.display = ""
      this.state.EditorButton = "SHOW EDITOR";
      this.toggle_div();
    }
  }

  ShowEditor = () => {

    if (this.state.display == "none") {
      this.hideEditor();
    }
    else {
      this.state.display = "none";
      this.state.EditorButton = "HIDE EDITOR";
      this.toggle_div();
      this.state.editorChanged = false;

    }
  }

  editorBlock = () => {
    if (this.state.showMe) {
      return (
        <Editor state={this.state.state} />
      )
    }
  }


  editorChanged = () => {
    this.state.editorChanged = true;
  }

  shareWindow = () => {
    return (<div ><center>
      <Modal style={customStyles} isOpen={this.state.isOpen} onRequestClose={this.toggle}><i className="fas fa-times" onClick={this.toggleModal} style={{ color: "red" }}></i>
        <center style={{ color: "white" }}>
          <br></br> Search For users to share  with<br></br>
          <div style={{ color: "white" }}><i className="fas fa-search" style={{ color: "white" }}></i> <input type="text" name="search" placeholder=" By email" onChange={this.search} /></div></center><br></br>
        <br></br><div style={{ float: "right", cursor: "pointer" }} className="protoButton"><i className={this.state.DevicestateIcon}></i> {this.state.Devicestate}</div><div>
          {this.ShareButton()}</div><hr></hr>
        <div >{this.selectedNameList()}</div> <hr></hr><br></br>                <div >
          {this.userNameList()}
        </div>
        <center>
          {/* <button>Share Device</button> */}
        </center>
      </Modal>
    </center>
    </div>)
  }

  render() {

    var devid = "loading";
    var lastTimestamp = "";
    var packets = [];
    var socketDataIn = "socketDataIn";

    var latestState = {};

    let plugins;



    if (this.state.view) {
      latestState = this.state.view;

      if (this.state.view.id) {
        plugins = <DevicePluginPanel stateId={this.state.view.id} />;
      } else {
        plugins = <p>plugins loading</p>;
      }
    }

    if (this.state.packets) {
      packets = this.state.packets;
    }

    return (
      <div>
        <div className="container-fluid  deviceViewContainer" style={{ paddingBottom: 50 }} >

          <Media query="(max-width: 599px)">
            {matches =>
              matches ? (
                <div>
                  <div className="row" style={{ marginBottom: 10, paddingBottom: 1 }}>

                    <div className="col-6">
                      <h3>{this.state.devid}</h3>
                      <span className="faded" >{this.state.timeago}</span>
                    </div>

                    <div className="col-6" style={{ display: this.state.shareDisplay, marginTop: 12 }}>
                      <div className="" style={{ width: "auto", float: "right", fontSize: 20, marginRight: 15, marginLeft: 3 }} onClick={() => this.deleteDevice(this.state.devid)}>
                        <FontAwesomeIcon icon="trash" />
                      </div>

                      <div className="" style={{ width: "auto", float: "right", marginRight: 15, fontSize: 20 }} onClick={this.clearState}>
                        <FontAwesomeIcon icon="eraser" />
                      </div>

                      <div className="" style={{ width: "auto", float: "right", marginRight: 15, fontSize: 20, }} onClick={this.toggleModal}>

                        <i className="fas fa-share-alt"></i>
                      </div>

                      <div onClick={this.ShowEditor} style={{ width: "auto", float: "right", marginRight: 15, fontSize: 20 }} className=""  >
                        <i className="fas fa-edit"></i>
                      </div>

                      {this.shareWindow()}

                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col" style={{ overflowX: "auto" }}>
                      {this.editorBlock()}

                      <Dashboard
                        username={this.props.username}
                        acc={this.props.acc}
                        deviceCall={this.state.state}
                        devices={this.state.devicesServer}
                        state={this.state.state}
                      />
                    </div>
                  </div>
                  <div className="row" style={{ marginTop: 15 }}>
                    <div className="col">
                      <DataView data={this.state.state} />
                      {plugins}
                    </div>
                  </div>
                </div>
              ) : (
                  <div>
                    <div className="row" style={{ marginBottom: 10, paddingBottom: 1 }}>

                      <div className="col-6">
                        <h3>{this.state.devid}</h3>
                        <span className="faded" >{this.state.timeago}</span>
                      </div>
                      <div className="col-6" style={{ display: this.state.shareDisplay }}>
                        <div className="commanderBgPanel commanderBgPanelClickable" style={{ width: "auto", float: "right", fontSize: 10, marginRight: 10, marginLeft: 3 }} onClick={() => this.deleteDevice(this.state.devid)}>
                          <FontAwesomeIcon icon="trash" /> {this.state.trashButtonText}
                        </div>

                        <div className="commanderBgPanel commanderBgPanelClickable" style={{ width: "auto", float: "right", fontSize: 10 }} onClick={this.clearState}>
                          <FontAwesomeIcon icon="eraser" /> {this.state.eraseButtonText}
                        </div>

                        <div className="commanderBgPanel commanderBgPanelClickable" style={{ width: "auto", float: "right", marginRight: 10, fontSize: 10, }} onClick={this.toggleModal}>

                          <i className="fas fa-share-alt"></i> {this.state.sharebuttonText}
                        </div>

                        <div onClick={this.ShowEditor} style={{ width: "auto", float: "right", marginRight: 10, fontSize: 10 }} className="commanderBgPanel commanderBgPanelClickable"  >
                          <i className="fas fa-edit"></i> {this.state.EditorButton}
                        </div>

                        {this.shareWindow()}

                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-3">
                        <DataView data={this.state.state} />
                        {plugins}
                      </div>
                      <div className="col-9" >
                        {this.editorBlock()}

                        <Dashboard
                          username={this.props.username}
                          acc={this.props.acc}
                          deviceCall={this.state.state}
                          devices={this.state.devicesServer}
                          state={this.state.state}
                        />
                      </div>
                    </div>
                  </div>
                )
            }
          </Media>

        </div>
      </div >
    );
  }
}