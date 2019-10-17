import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, NavLink } from "react-router-dom";

import { api } from "../api";
import { emit } from "cluster";
import { colors } from "../theme";
import { validEmail, passwordSettings, validPassword } from "../../../server/shared/shared";
import { request } from "../utils/requestweb";

var parse = require('color-parse')

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

    var col = parse(colors.warning);
    console.log(col);

    var notificationBlock: any = {
      border: "1px solid " + "rgba(" + col.values[0] + "," + col.values[1] + "," + col.values[2] + ",1)",
      boxSizing: "border-box",
      background: "rgba(" + col.values[0] + "," + col.values[1] + "," + col.values[2] + ",0.15)",
      fontWeight: "normal",
      fontSize: "12px",
      borderRadius: "1px"
    }

    return (
      <div style={notificationBlock} >
        <div style={{ padding: colors.padding }} >
          <span style={{ color: colors.warning }} >
            <i className="fas fa-exclamation-triangle" /> Your email address ({api.data.account.email}) has not been verified yet.
          </span> <br />
          <span>
            If this is not the correct email address or you need to request a new verification mail please go to <a className="dotted" style={{ color: colors.warning }} href="/settings/account">settings/account</a>.
          </span>
        </div>
      </div>


    );
  }
}
