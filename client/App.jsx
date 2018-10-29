import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";

import * as $ from "jquery";
import * as _ from "lodash";

import { NavBar } from "./components/navBar.jsx";
import { ApiInfo } from "./components/apiInfo.jsx";
import { DeviceView } from "./components/deviceView.jsx";
import { StatesViewer } from "./components/statesViewer.jsx";
import { ParamsView } from "./components/paramsView.jsx";
import { SettingsView } from "./components/settingsView.jsx";

import * as utils from "./utils.react.ts";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeBranch } from "@fortawesome/free-solid-svg-icons";
import { faTable } from "@fortawesome/free-solid-svg-icons";
library.add(faCodeBranch);
library.add(faTable);

import socketio from "socket.io-client";
const socket = socketio();

/*------------------------------------------------------------------
    React App
*/

class App extends Component {
  state = {
    states: [],
    view: {},
    viewType: "table"
  };

  // API METHODS
  getVersion(cb) {
    $.ajax({
      url: "/api/v3/version",
      type: "get",
      dataType: "json",
      contentType: "application/json",
      success: cb
    });
  }
  getAccount(cb) {
    $.ajax({
      url: "/api/v3/account",
      type: "get",
      dataType: "json",
      contentType: "application/json",
      success: cb
    });
  }

  getStates(cb) {
    $.ajax({
      url: "/api/v3/states",
      type: "get",
      dataType: "json",
      contentType: "application/json",
      success: cb
    });
  }

  getState(id, cb) {
    $.ajax({
      url: "/api/v3/state",
      type: "post",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({ id: id }),
      success: cb
    });
  }

  getView(id, cb) {
    $.ajax({
      url: "/api/v3/view",
      type: "post",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({ id: id }),
      success: cb
    });
  }

  postData(data, cb) {
    console.log("App.jsx postData(apikey, data,cb)");
    $.ajax({
      url: "/api/v3/data/post",
      type: "post",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: cb
    });
  }

  onSaveHandlerView = () => {
    console.log("App.jsx onSaveHandler()");
    console.log(this.state.view);
    console.log(this.state);
    this.postData(this.state.view, result => {
      console.log(result);
    });
  };

  updateMergeView(newState) {
    // used primarily for updating device state lists from socket.io, see subscribe
    if (this.state.view) {
      var view = _.merge(this.state.view, newState);
      this.setState({ view });
    }
  }

  constructor(props) {
    //useful to force reloading on localhost for fast iteration
    //setInterval( () => { window.location.reload(); }, 5000)

    super(props);

    this.getVersion(version => {
      this.setState({ version: version.version.toUpperCase() });
      //console.log(version);
    });

    this.getAccount(account => {
      this.setState({ email: account.email });
      this.setState({ apikey: account.apikey });
      this.setState({ user: account });
      console.log("set user");

      if (window.location.pathname.split("/")[1] == "view") {
        socket.emit(
          "join",
          account.apikey + "|" + window.location.pathname.split("/")[2]
        );
      } else {
        socket.emit("join", account.apikey);
      }

      // SOCKET.io Construct.
      //socket.emit('join', { apikey : account.apikey, pathname: window.location.pathname });

      socket.on("connect", a => {
        console.log("socket.io reconnect");
        //console.log(a);
        window.location.reload();
      });

      socket.on("post", socketDataIn => {
        //console.log("socket.io")
        //console.log(socketDataIn);

        if (this.state.states) {
          var newArray = this.state.states.slice();

          var found = 0;
          for (var s in newArray) {
            if (newArray[s].id == socketDataIn.id) {
              found = 1;
              var mergedEntry = _.merge(newArray[s], socketDataIn);
              newArray[s] = mergedEntry;
              this.setState({ states: newArray });
            }
          }

          if (found == 0) {
            newArray.push(socketDataIn);
            this.setState({ states: newArray });
          }

          ///////////

          if (this.state.view) {
            var copyView = Object.assign({}, this.state.view); //creating copy of object

            var view = _.merge(copyView, socketDataIn);

            this.setState({ view });
          }

          if (this.state.packets) {
            var newPackets = this.state.packets.slice().reverse();
            var payload = socketDataIn; //{data: socketDataIn.data, timestamp: socketDataIn.timestamp}
            newPackets.push(payload);
            this.setState({ packets: newPackets.reverse() });
          }
        }
      });
    });

    /*------------------------------------------------------     
        url: /                                            
    
        */

    this.getStates(states => {
      this.setState({ states: states });
    });

    /*------------------------------------------------------     
        url: /view                                            
*/

    if (window.location.pathname.split("/")[1] == "view") {
      this.getView(window.location.pathname.split("/")[2], view => {
        //console.log(view);
        this.setState({ view });
      });

      this.getState(window.location.pathname.split("/")[2], state => {
        this.setState({ state });
      });

      // this gets the history from the packets database for a specific device.
      var urlToCall = "/api/v3/packets";
      var typeOfCall = "post";
      $.ajax({
        url: urlToCall,
        type: typeOfCall,
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({ id: window.location.pathname.split("/")[2] }),
        success: packets => {
          utils.log(typeOfCall + " " + urlToCall + " incoming packet");
          //utils.log(packets);

          if (!this.state.socketDataIn) {
            var socketDataIn = packets.reverse()[0].payload;
            this.setState({ socketDataIn });
          }

          this.setState({ packets });
        }
      });
    }

    ///////////////
  } // end constructor

  mainView = () => {
    if (this.state.viewType) {
      if (this.state.viewType == "table") {
        return <StatesViewer states={this.state.states} />;
      }
      // if (this.state.viewType == "fbp" ) {
      //   return (  <FBP states={this.state.states} /> )
      // }
    } else {
    }
  };

  render() {
    if (window.location.pathname === "/") {
      return (
        <div className="App">
          <NavBar version={this.state.version} email={this.state.email} />

          <div className="container">
            <div className="row " style={{ paddingTop: 30, fontSize: 20 }}>
              <div className="col-md-12">
                {/* <div className="navLink" style={{ float: "right", paddingRight: 5 }}><FontAwesomeIcon icon="table" onClick={ ()=>{ this.setState({viewType:"table"})} }/></div> */}
                {/* <div className="navLink" style={{ float: "right", paddingRight: 20 }}><FontAwesomeIcon icon="code-branch" onClick={ ()=>{ this.setState({viewType:"fbp"})} } /></div> */}
              </div>
            </div>
          </div>
          {this.mainView()}

          <br />
          <br />
          <ApiInfo apikey={this.state.apikey} />
          <br />
          <br />
        </div>
      );
    }

    /*------------------------------------------------------     
        url: /view                                            
*/

    if (window.location.pathname.split("/")[1] == "view") {
      if (window.location.pathname.split("/")[3]) {
        if (window.location.pathname.split("/")[3] == "params") {
          return (
            <div className="App">
              <NavBar version={this.state.version} email={this.state.email} />
              <br />
              <br />
              <ParamsView
                view={this.state.view}
                packets={this.state.packets}
                socketDataIn={this.state.socketDataIn}
                onSave={this.onSaveHandlerView}
              />
            </div>
          );
        }
      } else {
        return (
          <div className="App">
            <NavBar version={this.state.version} email={this.state.email} />
            <br />
            <br />
            <DeviceView
              state={this.state.state}
              view={this.state.view}
              packets={this.state.packets}
              socketDataIn={this.state.socketDataIn}
            />
          </div>
        );
      }
    }

    /*------------------------------------------------------     
        url: /....                                            
*/

    /*------------------------------------------------------     
    url: /....            */

    if (this.state.user) {
      if (this.state.user.level >= 1) {
        if (window.location.pathname.split("/")[1] === "settings") {
          return (
            <div className="App">
              <NavBar version={this.state.version} email={this.state.email} />
              <br />
              <br />
              <SettingsView />
            </div>
          );
        }
      } else {
        return (
          <div className="App">
            <div>please login</div>
          </div>
        );
      }
    } else {
      return <div>...</div>;
    }
  }
}

export default App;
