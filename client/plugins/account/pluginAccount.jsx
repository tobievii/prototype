import React, { Component } from "react";

import { SetUsername } from "./pluginAccount_username.jsx"

export const name = "Account"

export class SettingsPanel extends React.Component {
  state = {
    account: {},
    level: 0
  }
  componentDidMount() {
    this.getAccount();
  }

  getAccount = () => {
    fetch("/api/v3/account", { method: "GET" }).then(resp => resp.json()).then((data) => {
      //console.log(data);
      if (data.level) {
        this.setState({ level: data.level })
      }
      this.setState({ account: data })
    })
  }

  usernameUpdated = () => {
    console.log("updated!")
    this.getAccount();
  }

  render() {
    return (
      <div>
        <div className="adminBlocks" >
          <h4>ACCOUNT</h4>
          <a href="/signout"><button className="btn-spot" style={{ float: "right" }} > SIGN OUT</button></a>
          email: {this.state.account.email}<br />
          level: {this.state.account.level}<br />
          username: {this.state.account.username}<br />

          <SetUsername username={this.state.account.username} usernameUpdated={this.usernameUpdated} />
          <div style={{ clear: "both" }} />
          
        </div>
        
      </div>
    )
  }
}


