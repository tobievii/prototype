import React from "react";

import { SetUsername } from "./pluginAccount_username.jsx"

export const name = "Account"

export class SettingsPanel extends React.Component {
  state = {
    account: {},
    level: 0
  }
  componentWillMount() {
    this.getAccount();
  }

  getAccount = () => {
    fetch("/api/v3/account", { method: "GET" }).then(resp => resp.json()).then((data) => {
      this.setState({ account: data })
      if (data.level) {
        this.setState({ level: data.level })
      }
    })
  }

  usernameUpdated = () => {
    this.props.updateAccount();
    this.getAccount();
  }

  render() {
    return (
      <div>
        <div className="adminBlocks" >
          <h4>ACCOUNT</h4>
          email:<span className="settingsDetails"> {this.state.account.email}</span><br />
          level:<span className="settingsDetails"> {this.state.account.level}</span><br />
          username:<span className="settingsDetails"> {this.state.account.username}</span><br />

          <SetUsername username={this.state.account.username} account={this.state.account} usernameUpdated={this.usernameUpdated} />
          <div style={{ clear: "both" }} />

        </div>

      </div>
    )
  }
}


