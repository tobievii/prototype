import React, { PureComponent, Suspense } from "react";

const SyntaxHighlighter = React.lazy(() => import('react-syntax-highlighter'));
const tomorrowNightBright = React.lazy(() => import("react-syntax-highlighter/styles/hljs"));
import * as _ from "lodash"
import { confirmAlert } from 'react-confirm-alert';
import { Link } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faHdd, faEraser, faDigitalTachograph } from "@fortawesome/free-solid-svg-icons";
import { DevicePluginPanel } from "../plugins/iotnxt/iotnxt_device.jsx";
import Modal from 'react-modal';
import { ShareList } from "./ShareList.jsx";
import { DataView } from "./dataView.jsx";
const Dashboard = React.lazy(() => import('./dashboard/dashboard'))
import moment from 'moment'
library.add(faDigitalTachograph)
library.add(faHdd);
library.add(faTrash);
library.add(faEraser);
import * as p from "../prototype.ts"
import socketio from "socket.io-client";
import { Editor } from "./editor.jsx"
import { StatesViewer } from "./statesViewer.jsx";

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

const customStylesMobile = {
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
    width: "100%",
    height: "85%"
  },
  //bacground of Pop up Modal on search
  overlay: {
    background: "rgba(27, 57, 77,0.9)",
  }
};
var viewController = "";

export class DeviceView extends PureComponent {
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
    loggedin: "",
    owner: "",
    dataButton: "HIDE DATA",
    dataview: "",
    dashboard: "col-lg-9",
    history: false,
    historyList: [],
    devicehistory: {}
  };

  socket;

  constructor(props) {
    super(props);
    this.socket = socketio({ transports: ['websocket', 'polling'] });
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

  updateView = (packet) => {
    var view = _.clone(this.state.view);
    var state = _.clone(this.state.state);

    var merge = true; //default is to merge

    if (packet.id == this.state.state.devid && packet.id == this.props.devid) {
      if (packet.options) {
        if (packet.options["_merge"] === false) {
          merge = false;
        }
      }

      if (merge) {
        view = _.merge(view, packet)
        state.payload = _.merge(state.payload, packet);
      } else {
        delete view.data;
        delete state.payload.data;
        state.payload = _.merge(state.payload, packet);
        view = _.merge(view, packet)
      }

      // should be same as DB.states for this device.
      state["_last_seen"] = packet.timestamp;
      this.setState({ view, state })
    }
  }

  updateTime = () => {
    if (this.state.view) {
      if (this.state.view.timestamp) {
        var timeago = this.state.view.timestamp + " (" + moment(this.state.view.timestamp).fromNow() + ")"
        this.setState({ timeago })
      }
    }
  }

  componentWillMount() {
    // should not get stats here? i think it should be /api/v3/users
    fetch("/api/v3/stats", {
      method: "GET", headers: { "Accept": "application/json", "Content-Type": "application/json" }
    }).then(response => response.json()).then(stats => {
      this.setState({ stats: stats })
    }).catch(err => console.error(err.toString()));
  }

  componentWillMount = () => {
    this.updateTime();
    setInterval(() => {
      this.updateTime();
    }, 500)

    this.getDeviceDV();
  }

  getDeviceDV = () => {
    setTimeout(() => {
      fetch("/api/v3/view", {
        method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ id: this.props.devid, username: this.props.username })
      }).then(response => response.json()).then(view => {
        if (view.error) {
        } else {
          this.setState({ view })
        }
      }).catch(err => console.error(err.toString()));

      fetch("/api/v3/state", {
        method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ id: this.props.devid, username: this.props.username })
      }).then(response => response.json()).then(state => {
        this.setState({ state }, () => {
          if (state.error) {
          } else {
            this.socket.emit("join", state.key)
          }
        })
      }).catch(err => console.error(err.toString()));
    }, 1);
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
    if (this.props.public != true) {
      if (this.state.trashClicked >= 0) {
        this.setState({ trashClicked: 1 })
        confirmAlert({
          customUI: ({ onClose }) => {
            return (
              <div className='protoPopup' align="center">
                <h1>Are you sure?</h1>
                <p>Deleting a device is irreversible</p>
                <button className="smallButton" style={{ margin: "5px", backgroundColor: "red", opacity: "0.7" }} onClick={onClose}>No, leave it!</button>

                <button className="smallButton" style={{ margin: "5px", backgroundColor: "green", opacity: "0.6" }} onClick={() => {
                  {
                    fetch("/api/v3/state/delete", {
                      method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                      body: JSON.stringify({ id: id, username: this.props.username, key: this.state.state.key })
                    }).then(response => response.json()).then(serverresponse => {
                      onClose();
                    }).catch(err => console.error(err.toString()));
                  }
                }}>Yes, Delete it!</button>
              </div>
            )
          }
        })
        return;
      }
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
    if (this.props.public != true) {
      if (this.state.clearStateClicked >= 0) {
        this.setState({ clearStateClicked: 1 });
        confirmAlert({
          customUI: ({ onClose }) => {
            return (
              <div className='protoPopup' align="center">
                <h1>Are you sure?</h1>
                <p>Clearing A State is irreversible</p>
                <button className="smallButton" style={{ margin: "5px", backgroundColor: "red", opacity: "0.7" }} onClick={onClose}>No, leave it!</button>

                <button className="smallButton" style={{ margin: "5px", backgroundColor: "green", opacity: "0.6" }} onClick={() => {
                  //this.handleClickDelete()
                  {
                    fetch("/api/v3/state/clear", {
                      method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                      body: JSON.stringify({ id: this.state.devid })
                    }).then(response => response.json()).then(serverresponse => {
                      onClose();
                    }).catch(err => console.error(err.toString()));
                  }
                }}>Yes, Clear it!</button>
              </div>
            )
          }
        })
        return;
      }
    }
  };

  toggleModal = () => {
    if (this.props.account.email == this.state.state.meta.user.email) {
      this.setState({ isOpen: !this.state.isOpen })
    }
    else {
      this.setState({ isOpen: this.state.isOpen })
    }
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


  dataColumn = () => {
    var plugins;
    if (this.state.view) {

      if (this.state.view.id) {
        plugins = <DevicePluginPanel username={this.props.username} stateId={this.state.view.id} device={this.state.state} />;
      } else {
        plugins = <p>plugins loading</p>;
      }
    }

    return (<div className="col-lg-3" style={{ overflowY: "auto", height: window.innerHeight - 150 + "px", display: this.state.dataview }}>
      <div style={{ paddingBottom: 25, paddingTop: 0 }}>{plugins}</div>
      <DataView data={this.state.state} />

    </div>)
  }

  dashboardColumn = () => {
    return (<div className={this.state.dashboard} >
      {this.editorBlock()}
      <Suspense fallback={<div className="spinner"></div>}>
        <Dashboard
          username={this.props.username}
          acc={this.props.acc}
          deviceCall={this.state.state}
          devices={this.state.devicesServer}
          state={this.state.state}
        />
      </Suspense>
    </div>)
  }

  hideData = () => {
    if (this.state.dataButton == "HIDE DATA") {
      this.setState({ dataview: "none" })
      this.setState({ dataButton: "SHOW DATA" })
      this.setState({ dashboard: "col-lg-12" })
    }
    else if ((this.state.dataButton == "SHOW DATA")) {
      this.setState({ dataview: "" })
      this.setState({ dataButton: "HIDE DATA" })
      this.setState({ dashboard: "col-lg-9" })
    }
  }

  historyList = () => {
    if (this.props.account.level > 0) {
      if (this.props.account.username == this.props.username || this.props.account.level >= 100)
        this.setState({ history: !this.state.history })
      const arrayToObject = (array) =>
        array.reduce((obj, item) => {
          obj = item
          return obj
        }, {})
      this.state.historyList = _.clone(arrayToObject(this.state.devicesServer.filter((find) => find.devid == this.props.devid)));
    }
    else null
  }

  trackedHisory = () => {
    if (this.state.historyList.history) {
      return (
        this.state.historyList.history.reverse().map((user, i) => {
          if (i == 0) { return < div className="commanderBgPanel commanderBgPanelClickable" key={i} title={"change made by " + user.user}><Link to={'/u/' + user.user} style={{ color: "white" }}><span style={{ color: "red" }}>*Latest*</span> {user.date} <u style={{ color: "red" }}>{user.user}</u> {user.change}</Link></div> }
          else { return < div className="commanderBgPanel commanderBgPanelClickable" key={i} title={"change made by " + user.user}><Link to={'/u/' + user.user} style={{ color: "white" }}>{user.date} <u style={{ color: "red" }}>{user.user}</u> {user.change}</Link></div> }
        })
      )
    }
    else {
      return (
        <div className="commanderBgPanel commanderBgPanel" style={{ marginLeft: "250px", width: "200px" }}>Device has no history</div>
      )
    }
  }

  devicehistory = () => {
    if (this.state.history == true) {
      if (window.innerWidth < 667) {
        return (< Modal style={customStylesMobile} isOpen={this.state.history} onRequestClose={this.toggle} >
          <i className={"fas fa-times " + this.state.show} onClick={this.historyList} style={{ color: "red" }} />
          <center style={{ color: "white" }}>
            <h1>Device history</h1>
          </center>
          <hr></hr>
          {this.trackedHisory()}
        </Modal >)
      }
      else {
        return (< Modal style={customStyles} isOpen={this.state.history} onRequestClose={this.toggle} >
          <i className={"fas fa-times " + this.state.show} onClick={this.historyList} style={{ color: "red" }} />
          <center style={{ color: "white" }}>
            <h1>Device history</h1>
          </center>
          <hr></hr>
          {this.trackedHisory()}
        </Modal >)
      }
    }
    else null
  }

  orderScreenSize = () => {
    if (window.innerWidth < 667) {
      return (<div className="row" >
        <div className="col-12" style={{ display: this.state.shareDisplay, marginTop: 12, overflow: "auto" }}>
          <div className="commanderBgPanel commanderBgPanelClickable" style={{ width: "16.67%", fontSize: 15, float: "right", textAlign: "center" }} onClick={() => this.deleteDevice(this.state.devid)}>
            <FontAwesomeIcon icon="trash" />
          </div>

          <div className="commanderBgPanel commanderBgPanelClickable" style={{ width: "16.67%", fontSize: 15, float: "right", textAlign: "center" }} onClick={this.clearState}>
            <FontAwesomeIcon icon="eraser" />
          </div>

          <div className="commanderBgPanel commanderBgPanelClickable" style={{ width: "16.67%", fontSize: 15, float: "right", textAlign: "center" }} onClick={this.toggleModal}>

            <i className="fas fa-share-alt"></i>
          </div>

          <div className="commanderBgPanel commanderBgPanelClickable" onClick={this.ShowEditor} style={{ width: "16.67%", fontSize: 15, float: "right", textAlign: "center" }}   >
            <i className="fas fa-edit"></i>
          </div>
          <div onClick={this.hideData} style={{ width: "16.67%", fontSize: 15, float: "right", textAlign: "center" }} className="commanderBgPanel commanderBgPanelClickable"  >
            <i className="fas fa-database"></i>
          </div>
          <div className="commanderBgPanel commanderBgPanelClickable" style={{ width: "16.60%", fontSize: 15, float: "right", textAlign: "center" }} onClick={this.historyList}>
            <i className="fas fa-history"></i>
          </div>
        </div>
        {this.dashboardColumn()}
        {this.dataColumn()}
      </div>)
    } else {
      return (<div className="row">
        {this.dataColumn()}
        {this.dashboardColumn()}
      </div>)
    }
  }

  openModal = () => {
    this.props.openModal("addDevice");
  }

  views = () => {
    if (this.props.mainView != "dashboard") {
      viewController = "";
      return (

        <StatesViewer deviceClicked={() => { this.getDeviceDV() }} openModal={this.openModal} mainView={this.props.mainView} sendProps={this.props.sendProps} username={this.props.username} account={this.props.account} public={this.props.public} visiting={this.props.visiting} visituser={this.props.visituser} />
      )
    } else {
      viewController = "changeDisplay";
      return null
    }
  }

  deleteClearButtons = () => {
    if (this.props.public == true) {
      return (
        <span>
          <div className="" style={{ width: "auto", float: "right", fontSize: 18, marginRight: 10, marginLeft: 15, cursor: "not-allowed" }}>
            <FontAwesomeIcon icon="trash" title="Delete device" />
          </div>

          <div className="" style={{ width: "auto", float: "right", fontSize: 18, cursor: "not-allowed" }}>
            <FontAwesomeIcon icon="eraser" title="Clear device info" />
          </div>
        </span>
      )
    } else {
      return (
        <span>
          <div className="" style={{ width: "auto", float: "right", fontSize: 18, marginRight: 10, marginLeft: 15, cursor: "pointer" }} onClick={() => this.deleteDevice(this.props.devid)}>
            <FontAwesomeIcon icon="trash" title="Delete device" />
          </div>

          <div className="" style={{ width: "auto", float: "right", fontSize: 18, cursor: "pointer" }} onClick={this.clearState}>
            <FontAwesomeIcon icon="eraser" title="Clear device info" />
          </div>
        </span>
      )
    }
  }

  setView = () => {
    var view = undefined;

    if (this.props.mainView == "dashboard") {
      view = "dashboardDevices";
    } else if (this.props.mainView == "dashboardDevices") {
      view = "dashboard";
    }

    this.setState({ devicesView: view });
    this.props.changeMainView(view)
  }

  render() {
    return (
      <div className={"mock-up " + this.props.mainView}>
        {this.views()}
        <div className="" style={{ width: "100%", paddingRight: "10px", marginLeft: 2, marginRight: 3 }} >
          <div className="deviceViewContainer" style={{ paddingBottom: 0, paddingRight: 5, paddingLeft: 5, overflow: "hidden" }}>
            <div className="row" style={{ marginBottom: 5, marginTop: 10, paddingBottom: 1 }}>
              <div className="col-5">
                <h3 style={{ paddingLeft: 5 }}>{this.props.devid}</h3>
              </div>
              <div className="col-7 noDisplay" >
                <div className="" style={{ display: this.state.shareDisplay }}>
                  {this.deleteClearButtons()}

                  <div className="" style={{ width: "auto", float: "right", marginRight: 15, fontSize: 18, cursor: "pointer" }} onClick={this.toggleModal} title="Share Device">
                    <i className="fas fa-share-alt" ></i>
                  </div>

                  <div onClick={this.ShowEditor} style={{ width: "auto", float: "right", marginRight: 14, fontSize: 18, cursor: "pointer" }} className=""  >
                    <i className="fas fa-edit" title="Show/Hide text editor"></i>
                  </div>
                  <div onClick={this.hideData} style={{ width: "auto", float: "right", marginRight: 16, fontSize: 18, cursor: "pointer" }} className=""  >
                    <i className="fas fa-database" title="Show/Hide device data"></i>
                  </div>

                  <div className="" style={{ width: "auto", float: "right", marginRight: 16, fontSize: 20, cursor: "pointer" }} onClick={this.setView}>
                    <FontAwesomeIcon icon="digital-tachograph" title="Show/Hide devices" />
                  </div>

                  <div style={{ width: "auto", fontSize: 15, float: "right", textAlign: "center", marginTop: 3, cursor: "pointer", marginRight: 16 }} title="Show Device History" onClick={this.historyList}>
                    <i className="fas fa-history"></i>
                  </div>

                  <div className="faded" style={{ width: "auto", float: "right", marginRight: 16, marginTop: 8, fontSize: 12 }}>{this.state.timeago}</div>

                  <ShareList devid={this.props.devid} isOpen={this.state.isOpen} username={this.props.username} account={this.props.account} closeModel={() => { this.setState({ isOpen: false }) }} />
                  {this.devicehistory()}
                </div>
              </div>
            </div>
            {this.orderScreenSize()}
          </div >
        </div>
      </div>
    );
  }
}