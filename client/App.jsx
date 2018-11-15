import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";

import * as _ from "lodash";

import { NavBar } from "./components/navBar.jsx";
import { Account } from "./components/account.jsx"
import { ApiInfo } from "./components/apiInfo.jsx";
import { DeviceView } from "./components/deviceView.jsx";
import { StatesViewer } from "./components/statesViewer.jsx";
import { ParamsView } from "./components/paramsView.jsx";
import { SettingsView } from "./components/settingsView.jsx";


import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { faStroopwafel, faCodeBranch, faTable } from '@fortawesome/free-solid-svg-icons'
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons"

// library.add(faStroopwafel)
// library.add(faCodeBranch);
// library.add(faTable);
library.add(faDiscord)

import socketio from "socket.io-client";
const socket = socketio();


/////////////// PUBLIC MARKETING

import { Landing } from "./public/landing.jsx"


/*------------------------------------------------------------------
    React App
*/

class App extends Component {
  state = {
    states: [],
    view: {},
    viewType: "table",
    loggedIn: false

  };

  // API METHODS

  getVersion(cb) {
    fetch("/api/v3/version", { method: "GET", headers: { "Accept": "application/json", "Content-Type": "application/json" } }).then(response => response.json()).then(version => {
      cb(version);
    }).catch(err => console.error(err.toString()));
  }

  getAccount(cb) {
    fetch("/api/v3/account", { method: "GET", headers: { "Accept": "application/json", "Content-Type": "application/json" } }).then(response => response.json()).then(account => {
      if (account.level > 0) { this.setState({ loggedIn: true }) }
      cb(account);
    }).catch(err => console.error(err.toString()));
  }

  getStates(cb) {
    fetch("/api/v3/states", { method: "GET", headers: { "Accept": "application/json", "Content-Type": "application/json" } }).then(response => response.json()).then(states => {
      cb(states);
    }).catch(err => console.error(err.toString()));
  }

  getState(id, cb) {
    fetch("/api/v3/state", {
      method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ id: id })
    }).then(response => response.json()).then(state => { cb(state); })
      .catch(err => console.error(err.toString()));
  }

  getView(id, cb) {
    fetch("/api/v3/view", {
      method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ id: id })
    }).then(response => response.json()).then(view => { cb(view); })
      .catch(err => console.error(err.toString()));
  }

  postData(data, cb) {
    fetch("/api/v3/data/post", {
      method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(response => response.json()).then(view => { cb(view); })
      .catch(err => console.error(err.toString()));
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
      console.log(version);
    });

    this.getAccount(account => {
      this.setState({ email: account.email });
      this.setState({ apikey: account.apikey });
      this.setState({ user: account });
      this.setState({ account });

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

      ///////
      // this gets the history from the packets database for a specific device.

      fetch("/api/v3/packets", {
        method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ id: window.location.pathname.split("/")[2], limit: 1 })
      }).then(response => response.json()).then(packets => {

        if (!this.state.socketDataIn) {
          if (packets.length > 0) {
            var socketDataIn = packets.reverse()[0].payload;
            this.setState({ socketDataIn });
          }
        }
        this.setState({ packets });
      }).catch(err => console.error(err.toString()));


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


  notLogged = () => {
    return (<div className="App">
      <NavBar account={this.state.account} version={this.state.version} email={this.state.email} />
      <Account account={this.state.account} />
      <Landing />
    </div>)
  }

  logged = () => {
    if (window.location.pathname === "/") {
      return (
        <div className="App">
          <NavBar account={this.state.account} version={this.state.version} email={this.state.email} />

          <Account account={this.state.account} />

          <div className="container">
            <div className="row " style={{ paddingTop: 30, fontSize: 20 }}>
              <div className="col-md-12">
                {/* <div className="navLink" style={{ float: "right", paddingRight: 5 }}><FontAwesomeIcon icon="table" onClick={ ()=>{ this.setState({viewType:"table"})} }/></div> */}
                {/* <div className="navLink" style={{ float: "right", paddingRight: 20 }}><FontAwesomeIcon icon="code-branch" onClick={ ()=>{ this.setState({viewType:"fbp"})} } /></div> */}
              </div>
            </div>
          </div>
          {this.mainView()}



          <ApiInfo apikey={this.state.apikey} />

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
              <NavBar account={this.state.account} version={this.state.version} email={this.state.email} />
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
            <NavBar account={this.state.account} version={this.state.version} email={this.state.email} />
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
              <NavBar account={this.state.account} version={this.state.version} email={this.state.email} />
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
      return <div></div>;
    }
  }

  render() {



    if (this.state.loggedIn == false) {
      return this.notLogged()
    } else {
      return this.logged()
    }


  }
}

export default App;
