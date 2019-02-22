import React, { Component } from "react";

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faTimes, faBell } from '@fortawesome/free-solid-svg-icons'

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import moment from 'moment'

library.add(faCog)
library.add(faTimes)
library.add(faBell);

export class Notification extends Component {
  render() {
    return (
      <div style={{ border: "1px #fff solid", padding: 5, margin: 5 }}>
        <span style={{ fontWeight: "bold", color: "red" }}>{this.props.notification.type}</span>&nbsp;<br />
        <span style={{ color: "#888" }}>{this.props.notification.desc}</span><br />
        {moment(this.props.notification["_created_on"]).fromNow()}
      </div>
    )
  }
}

export class NavBar extends Component {

  constructor() {
    super();

    this.state = {
      showMenu: false,
      devid: undefined,
      error: null,
      isLoaded: false,
      notification: [{}]
    }

    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this)
  }
  showMenu(event) {
    event.preventDefault();

    this.setState({ showMenu: true }, () => {
      document.addEventListener('click', this.closeMenu);
    });
  }

  closeMenu() {
    this.setState({ showMenu: false }, () => {
      document.removeEventListener('click', this.closeMenu);
    });
  }

  showSettings = () => {
    if (this.props.account) {
      if (this.props.account.level > 0) {
        return (<Link to="/settings" className="navLink"><FontAwesomeIcon icon="cog" /></Link>)
      }
    }
  }

  showNotifications = (account) => {

    return (
      <div style={{ position: "relative" }}>
        <span>
          <FontAwesomeIcon icon="bell" onClick={this.showMenu} className="navLink" />

        </span>
        {
          this.state.showMenu
            ? (
              <div style={{ position: "absolute", color: "#ccc", background: "#333", width: 300, right: "25px", top: 25, zIndex: 1000 }}>
                {account.notifications.map((notification, i) => <Notification key={i} notification={notification}></Notification>)}
              </div>
            )
            : (
              null
            )
        }
      </div>
    )
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
          <div style={{ padding: "20px 10px 10px 10px 10px", float: "right", paddingRight: "20px" }}>
            <span style={{ fontSize: 14 }} title="email">{account.email}</span> &nbsp;
            <span style={{ fontSize: 14 }} title="username">{account.username}</span> &nbsp;
            <span style={{ fontSize: 14 }} title="level">{account.level}</span> &nbsp;
            <span style={{ marginRight: "5px" }}>{this.showSettings()}</span>
            <div style={{ height: 10, float: "right" }}>{this.showNotifications(account)}</div>
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

            {this.account(this.props.account)}

          </div>
        </div>
      </div>
    );
  }
}
