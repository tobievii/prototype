import React, { Component } from "react";

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faTimes, faBell } from '@fortawesome/free-solid-svg-icons'

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

library.add(faCog)
library.add(faTimes)
library.add(faBell);

export class NavBar extends Component {

  showSettings = () => {
    if (this.props.account) {
      if (this.props.account.level > 0) {
        return (<Link to="/settings" className="navLink"><FontAwesomeIcon icon="cog" /></Link>)
      }       
    }
  }

  showNotifications = () => {
    return ( <FontAwesomeIcon icon="bell" />)
  }

  showLogout = () => {
    if (this.props.account) {
      if (this.props.account.level > 0) {
        return (<a href="/signout" className="navLink" title="logout" ><FontAwesomeIcon icon="times" /></a>)
      }       
    }
  }

  account = (account) => {
    if (account) {
      if (account.level > 0) {
        return (
          <div style={{ padding: "20px 10px 10px 10px", float: "right" }}>
            <span style={{fontSize: 14}} title="email">{account.email}</span> &nbsp;
            <span style={{fontSize: 14}} title="username">{account.username}</span> &nbsp;
            <span style={{fontSize: 14}} title="level">{account.level}</span> &nbsp;
            { this.showNotifications() }&nbsp;
            { this.showSettings() }              
          </div>
        )
      } else {
        return null;
      }
    } else {
      return null;
    }
    
  }

  render() {
    var username = ""
    if (this.props.account) {

      if (this.props.account.level > 0) {
        username = this.props.account.username;
      }
    }
    return (
      <div className="" style={{ margin: "0 5px" }} >
        <div className="row " style={{ paddingBottom: 10 }}>
          <div className="col-md-12">
            <Link to="/">
              <div style={{ padding: "20px 10px 10px 10px", float: "left" }}>
                <img
                  src="/iotnxtLogo.png"
                  alt=""
                  width="23"
                  height="23"
                  style={{ float: "left" }}
                />

                <div
                  className="font-weight-bold spot"
                  style={{ paddingLeft: 5, float: "left" }}
                >
                   PR0T0TYP3 <span style={{ color: "#fff", fontSize: 15 }}>DASHBOARD <span id="version" />{this.props.version}</span> 
                </div>
              </div>
            </Link>

            { this.account(this.props.account) }

          </div>
        </div>
      </div>
    );
  }
}
