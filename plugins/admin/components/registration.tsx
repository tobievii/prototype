import React, { Component } from "react";
import { colors } from "../../../client/src/theme";
import { request } from "../../../client/src/utils/requestweb";

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
    request.get("/api/v3/admin/registration", { json: true }, (err, res, result) => {
      if (result) {
        this.setState(result)
      }
    })
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
    request.post("/api/v3/admin/registration", { json: this.state }, (err, res, result) => {
      console.log(result);
    });
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

        {(this.state.userEmailVerify)
          ? <div className="adminBlocksSub">
            <FormInput label="host" value={this.state.nodeMailerTransportHost} onChange={this.handleFormChange("nodeMailerTransportHost")} />
            <FormInput label="port" value={this.state.nodeMailerTransportPort} onChange={this.handleFormChange("nodeMailerTransportPort")} />
            <FormInput label="auth user" value={this.state.nodeMailerTransportAuthUser} onChange={this.handleFormChange("nodeMailerTransportAuthUser")} />
            <FormInput label="auth pass" value={this.state.nodeMailerTransportAuthPass} onChange={this.handleFormChange("nodeMailerTransportAuthPass")} />
            <FormInput label="from" value={this.state.nodeMailerTransportFrom} onChange={this.handleFormChange("nodeMailerTransportFrom")} />
            <div style={{ clear: "both" }} />
          </div> : ""}


        < button className="btn-spot" style={{ float: "right", marginTop: 10 }} onClick={() => { this.updateOptions() }} ><i className="fas fa-check" style={{ color: colors.share, opacity: 0.5, paddingRight: "10px" }} ></i> CONFIRM</button>
        <div style={{ clear: "both" }} />
      </div >
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
