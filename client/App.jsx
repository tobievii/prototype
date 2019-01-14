import React, { Component } from "react";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "./prototype.scss"

import { NavBar } from "./components/navBar.jsx";
import { Account } from "./public/account.jsx"
// not logged in content:
import { Landing } from "./public/landing.jsx"


import { UserPage } from "./components/userpage.jsx"

// logged in content:
import { Verify } from "./components/verify.jsx";
import { ApiInfo } from "./components/apiInfo.jsx";
import { DeviceView } from "./components/deviceView.jsx";
import { StatesViewer } from "./components/statesViewer.jsx";
import { SettingsView } from "./components/settingsView.jsx";


import Stats from "./components/stats.jsx"
import Footer from "./public/footer.jsx"

import * as p from "./prototype.ts"

import socketio from "socket.io-client";

const socket = socketio();

class App extends Component {

    state = {};

    constructor (props) {
        super(props);

        p.getVersion( (version) => { this.setState({ version: version.version.toUpperCase() }); })
        
        p.getAccount(account => { 
            this.setState({ account });
            if (account.level > 0) { 
                socket.emit("join", account.apikey);
                this.setState({ loggedIn: true }) 
                // if its a real user (level >0 ) then we get device data.
            }            
        })

        p.getStates( (states) => { this.setState({ states }) })

        socket.on("connect", a => { console.log("socket connected"); });
        socket.on("post", socketDataIn => { this.socketHandler(socketDataIn); });
    }

    socketHandler = (socketDataIn) => {
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
    }

  

    home = ({ match }) => {
        if (this.state.account) {
            if (this.state.account.level >0) {
                return (
                    <div>
                        <StatesViewer username={this.state.account.username} />
                        <ApiInfo apikey={this.state.account.apikey} />
                        <Stats />
                        <Footer />
                    </div>
                )
            } else {
                return (
                    <div>
                    <Account account={this.state.account} />
                    <Landing />
                  </div>)
            }
        } else {
            return null
        }        
    }

    deviceView = ({match}) => {
        return (
            <div>
                
                <DeviceView devid={match.params.devid} />
            </div>
        )
    }

    userView = ({match}) => {
        return (
            <UserPage username={match.params.username} />
        )
    }

    settings = ({match}) => {
        return (
            <SettingsView />
        )
    }

    render() {
        return (
            <div className="App">
                
                <Router>
                    <div>
                        <NavBar version={this.state.version} account={this.state.account} />
                        <Route exact path="/" component={this.home} />
                        <Route path="/view/:devid" component={this.deviceView} />                    
                        <Route path="/u/:username" component={this.userView} />
                        <Route path="/settings" component={this.settings} />
                    </div>
                </Router>
            </div>
        )
    }
}

export default App;