import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, NavLink } from "react-router-dom";

import { api } from "../api";
import { emit } from "cluster";
import { colors } from "../theme";
import { validEmail, passwordSettings, validPassword } from "../../../server/shared/shared";
import { request } from "../utils/requestweb";

interface MyProps { }

interface MyState { }

export class UserVerify extends React.Component<MyProps, MyState> {
  state = {};

  requestVerificationMail = () => {
    request.get("/api/v3/admin/requestverificationemail", { json: true }, (e, r, response) => {

    });
  }

  componentDidMount() {
    api.on("account", (account) => {
      console.log("account change detected")
    })
  }

  render() {

    var notificationBlock: any = {
      border: "1px solid rgba(255, 57, 67, 0.35)",
      boxSizing: "border-box",
      background: "rgba(255, 57, 67, 0.15)",
      margin: "20px",
      padding: "10px",
      fontWeight: "normal",
      fontSize: "12px",
      borderRadius: "1px",
      color: "#ff3943"
    }

    return (
      <div style={notificationBlock} >
        <span>
          <i className="fas fa-exclamation-triangle"></i> Your email address has not been verified yet.
          Please check your inbox for your auth link.
        </span>

        <button onClick={this.requestVerificationMail}><i className="fas fa-envelope"></i> send new</button>
      </div>
    );
  }
}
