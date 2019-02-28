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


  constructor(props) {
    super(props);
  }

  newDevice = () => {

    if (this.props.notification.type == "New Device Added") {

    } return this.props.notification.type
  }

  device = () => {
    if (this.props.notification.type) {
      return this.props.notification.device
    }
  }

  render() {
    return (

      <div className="newNotificationItem">
        <i class="fas fa-exclamation-circle"></i>
        <span class="newdevice" >{this.newDevice()}</span><br />
        <span class="devicename" >{this.device()}</span><br />
        <span class="lastseen" >{moment(this.props.notification.created).fromNow()}</span>
      </div>

    )
  }
}

export class Alarm extends Component {


  constructor(props) {
    super(props);
  }

  newDevice = () => {

    if (this.props.notification.type == "Alarm") {
      return this.props.notification.type
    }
    return this.props.notification.type
  }

  device = () => {
    if (this.props.notification.type) {
      return this.props.notification.device
    }
  }

  deviceDescription() {
    return this.props.notification.desc
  }

  render() {
    return (

      <div className="alarmNotificationItem">
        <i class="fas fa-bullhorn"></i>
        <span class="newdevice" >{this.newDevice()}</span><br />
        <span class="devicename">{this.device()}</span><br />
        <span class="lastseen">{moment(this.props.notification.created).fromNow()}</span>
      </div>

    )
  }
}

export class Connection extends Component {


  constructor(props) {
    super(props);
  }

  newDevice = () => {

    if (this.props.notification.type == "Alarm") {
      return this.props.notification.type
    }
    return this.props.notification.type
  }

  device = () => {
    if (this.props.notification.type) {
      return this.props.notification.device
    }
  }

  deviceDescription() {
    return this.props.notification.desc
  }

  render() {
    return (

      <div className="warningNotificationItem">
        <i class="fas fa-exclamation-triangle"></i>
        <span class="newdevice" >{this.newDevice()}</span><br />
        <span class="devicename">{this.device()}</span><br />
        <span class="lastseen">{moment(this.props.notification.created).fromNow()}</span>
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
              <div style={{ position: "absolute", color: "#ccc", background: "", width: 400, right: "25px", top: 25, zIndex: 1000 }}>
                {account.notifications.map((notification, i) => <Notification key={i} notification={notification}></Notification>)}
                {account.notifications.map((notification, i) => <Alarm key={i} notification={notification}></Alarm>)}
                {account.notifications.map((notification, i) => <Connection key={i} notification={notification}></Connection>)}

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
