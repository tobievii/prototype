import React, { Component } from "react";
import { colors } from "../../../client/src/theme";

export class Registration extends React.Component {
  state = {
    userRegistration: false,
    userEmailVerify: false,
    nodeMailerTransportHost: "",
    nodeMailerTransportPort: "",
    nodeMailerTransportAuthUser: "",
    nodeMailerTransportAuthPass: "",
    nodeMailerTransportFrom: ""
  }

  componentDidMount = () => {
    fetch("/api/v3/admin/registration", { method: "GET", headers: { "Accept": "application/json", "Content-Type": "application/json" } }).then(response => response.json()).then(data => {
      // console.log(data);  
      if (data.err) { }
      if (data.result) {
        this.setState(data.result)
      }
    }).catch(err => console.error(err.toString()));
  }

  checkBox = (flag) => {
    return evt => {
      var newState = {}
      newState[flag] = !this.state[flag]
      this.setState(newState);
    }
  }

  handleFormChange = id => {
    return (evt: React.ChangeEvent<HTMLInputElement>) => {
      var newsetting = {}
      newsetting[id] = evt.target.value
      this.setState(newsetting)
    }
  }

  updateOptions = () => {

    fetch("/api/v3/admin/registration", {
      method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(this.state)
    }).then(response => response.json()).then(data => {
      // console.log(data);

    }).catch(err => console.error(err.toString()));



  }

  setupNodemailer = () => {
    if (this.state.userEmailVerify) {
      return (<div className="adminBlocksSub">

        <FormInput label="host" value={this.state.nodeMailerTransportHost} onChange={this.handleFormChange("nodeMailerTransportHost")} />
        <FormInput label="port" value={this.state.nodeMailerTransportPort} onChange={this.handleFormChange("nodeMailerTransportPort")} />
        <FormInput label="auth user" value={this.state.nodeMailerTransportAuthUser} onChange={this.handleFormChange("nodeMailerTransportAuthUser")} />
        <FormInput label="auth pass" value={this.state.nodeMailerTransportAuthPass} onChange={this.handleFormChange("nodeMailerTransportAuthPass")} />
        <FormInput label="from" value={this.state.nodeMailerTransportFrom} onChange={this.handleFormChange("nodeMailerTransportFrom")} />


        <div style={{ clear: "both" }} />
      </div>)
    } else {
      return null;
    }

  }

  render() {

    return (
      <div style={{ marginTop: colors.padding, padding: colors.padding * 2, background: "rgba(0,0,0,0.1)" }}>
        <div><h3>REGISTRATION</h3></div>

        <div>{(this.state.userRegistration == true)
          ? <i className="fas fa-check-square"
            onClick={this.checkBox("userRegistration")} />
          : <i className="far fa-square"
            onClick={this.checkBox("userRegistration")} />
        } Enable public user registration</div>


        <div>{(this.state.userEmailVerify)
          ? <i className="fas fa-check-square" onClick={this.checkBox("userEmailVerify")} />
          : <i className="far fa-square" onClick={this.checkBox("userEmailVerify")} />
        } Require email verification
        </div>


        {this.setupNodemailer()}
        <button className="btn-spot" style={{ float: "right", marginTop: 10 }} onClick={this.updateOptions} ><i className="fas fa-check" style={{ color: colors.share, opacity: 0.5, paddingRight: "10px" }} ></i> CONFIRM</button>
        <div style={{ clear: "both" }} />
      </div>
    )
  }

}


interface FormProps {
  label: string
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

interface FormState {

}


export class FormInput extends React.Component<FormProps, FormState> {
  render() {
    return (
      <div style={{ marginBottom: 3, display: "flex", flexDirection: "row" }}>

        <div style={{ flex: 1, textAlign: "right", paddingTop: colors.padding, paddingRight: colors.padding }}  >{this.props.label}:</div>

        <div style={{ flex: 3 }}>
          <input style={{ width: "100%" }} value={this.props.value} spellCheck={false} onChange={this.props.onChange} />
        </div>
      </div>
    )
  }
}
