import React, { Component } from "react";

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faTimes, faBell, faUnderline } from '@fortawesome/free-solid-svg-icons'

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import moment from 'moment'
import { array } from "prop-types";

library.add(faCog)
library.add(faTimes)
library.add(faBell);

export class Notification extends Component {


  constructor(props) {
    super(props);


  }

  newDevice = () => {

    if (this.props.notification.type === "New Device Added") {

    } return this.props.notification.type
  }

  device = () => {
    if (this.props.notification.type) {
      return this.props.notification.device
    }
  }

  render() {
    if (this.props.notification.type == "New Device Added") {
      return (

        <div className="newNotificationItem">
          <i className="fas fa-exclamation-circle"></i>
          <span className="newdevice" >{this.newDevice()}</span><br />
          <span className="devicename" >{this.device()}</span><br />
          <span className="lastseen" >{moment(this.props.notification.created).fromNow()}</span>
        </div>

      )
    }
    if (this.props.notification.type == "Alarm") {
      return (

        <div className="alarmNotificationItem">
          <i className="fas fa-bullhorn"></i>
          <span className="newdevice" >{this.newDevice()}</span><br />
          <span className="devicename">{this.device()}</span><br />
          <span className="lastseen">{moment(this.props.notification.created).fromNow()}</span>
        </div>

      )
    }

    if (this.props.notification.type == "Warning") {
      return (

        <div className="warningNotificationItem">
          <i className="fas fa-exclamation-triangle"></i>
          <span className="newdevice" >{this.newDevice()}</span><br />
          <span className="devicename">{this.device()}</span><br />
          <span className="lastseen">{moment(this.props.notification.created).fromNow()}</span>
        </div>

      )
    }


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
        return (<Link to="/settings" className="navLink" title="Settings"><FontAwesomeIcon icon="cog" /></Link>)
      }
    }
  }

  goSettings = (account) => {
    if (this.props.account) {
      if (this.props.account.level > 0) {
        return (
          <Link to="/settings" className="navLink">
            <div className="dropdown">
              <span className="fas fa-user" title="Account settings"></span>
              <div className="dropdown-content">
                <span style={{ fontSize: 10 }} title="email">EMAIL: {account.email}</span>&nbsp;
                <br></br>
                <span style={{ fontSize: 10 }} title="username">USERNAME: {account.username}</span>&nbsp;
                <br></br>
                <span style={{ fontSize: 10 }} title="level">LEVEL: {account.level}</span>&nbsp;
              </div>
            </div>
          </Link>)
      }
    }
  }

  showNotifications = (account) => {
    if (account.notifications == undefined) {
      return (
        <div style={{ position: "relative" }}>
          <span>
            <FontAwesomeIcon icon="bell" onClick={this.showMenu} className="navLink" />
          </span>
        </div>
      )
    } else return (
      <div style={{ position: "relative" }}>
        <span>
          <FontAwesomeIcon icon="bell" onClick={this.showMenu} title="Notifications" className="navLink" />
        </span>
        {
          this.state.showMenu
            ? (
              <div style={{ position: "absolute", color: "#ccc", background: "#101e29", width: 450, right: "25px", top: 25, zIndex: 1000 }}>
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

  countArray = () => {

    if (this.props.account.notifications == undefined) {
      return 0
    } else {
      return this.props.account.notifications.length
    }



    //TODO Check if array has grown
  }

  account = (account) => {
    if (account) {
      if (account.level > 0) {
        return (
          <div style={{ padding: "20px 20px 20px 20px 20px", float: "right", paddingRight: "20px", paddingTop: "18px" }}>
            <span className="navLink" style={{ float: "left" }}>{this.goSettings(account)}</span>
            <span style={{ marginRight: "5px" }}>{this.showSettings()}</span>
            <span style={{ height: 10, float: "right" }}>{this.showNotifications(account)}</span>
            <span className="button__badge">{this.countArray()}</span>
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
          <div className="col-md-12" style={{ backgroundColor: "#0E1823", position: "relative", zIndex: 1000, right: "0%" }}>
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
