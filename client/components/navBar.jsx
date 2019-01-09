import React, { Component } from "react";

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faTimes, faBell } from '@fortawesome/free-solid-svg-icons'


library.add(faCog)
library.add(faTimes)
library.add(faBell);

export class NavBar extends Component {

  showSettings = () => {
    if (this.props.account) {
      if (this.props.account.level > 0) {
        return (<a href="/settings" className="navLink"><FontAwesomeIcon icon="cog" /></a>)
      }       
    }
  }

  showNotifications = () => {
    return (<a href="/notifications" className="navLink"><FontAwesomeIcon icon="bell" /></a>)
  }

  showLogout = () => {
    if (this.props.account) {
      if (this.props.account.level > 0) {
        return (<a href="/signout" className="navLink" title="logout" ><FontAwesomeIcon icon="times" /></a>)
      }       
    }
  }

  render() {
    var username = ""
    if (this.props.account) {
      if (this.props.account.username) {
        username = this.props.account.username;
      }
    }
    return (
      <div className="" style={{ margin: "0 5px" }} >
        <div className="row " style={{ paddingBottom: 10 }}>
          <div className="col-md-12">
            <a href="/">
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
            </a>

            <div style={{ padding: "20px 10px 10px 10px", float: "right" }}>
              
              <span style={{fontSize: 14}}>{this.props.email} ({username})</span>&nbsp;

              { this.showNotifications() }&nbsp;
              { this.showSettings() }              
            </div>
          </div>
        </div>
      </div>
    );
  }
}
