import React, { Component } from "react";

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faTimes, faBell, faUserEdit, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import moment from 'moment'


library.add(faCog)
library.add(faTimes)
library.add(faBell);
library.add(faSignOutAlt)
library.add(faUserEdit)
var allUsers = []


export class Notification extends Component {
  constructor(props) {
    super(props);
  }

  // componentDidMount = () => {

  //   this.setState({ device: this.props.device }, () => this.setDevice(this.props.device))
  // }

  newDevice = () => {

    if (this.props.notification.type === "New Device Added") {

    } return this.props.notification.type
  }

  message = () => {

    return this.props.notification.message
  }

  device = () => {
    if (this.props.notification.type) {
      return this.props.notification.device
    }
  }

  render() {
    if (this.props.notification.type == "New Device Added") {
      this.props.notification.type = "NEW DEVICE ADDED"
    }

    if (this.props.notification.type == "NEW DEVICE ADDED") {
      return (

        <Link to={"/u/" + this.props.account.username + "/view/" + this.device()} title="View Device Data">
          <div className="newNotificationItem">
            <i className="fas fa-exclamation-circle"></i>
            <span className="newdevice" >{this.newDevice()}</span><br />
            <span className="devicename" >{this.device()}</span><br />
            <span className="lastseen" >{moment(this.props.notification.created).fromNow()}</span>
          </div>
        </Link>

      )
    }

    if (this.props.notification.type == "A DEVICE WAS SHARED WITH YOU") {
      return (

        <div className="newNotificationItem">
          <i className="fas fa-exclamation-circle"></i>
          <span className="newdevice" >{this.newDevice()}</span><br />
          <span className="devicename" >{this.device()}</span><br />
          <span className="lastseen" >{moment(this.props.notification.created).fromNow()}</span>
        </div>
      )
    }

    if (this.props.notification.type == "ALARM") {
      return (

        <Link to={"/u/" + this.props.account.username + "/view/" + this.device()} title="View Device Data">
          <div className="alarmNotificationItem">
            <i className="fas fa-bullhorn"></i>
            <span className="newdevice" >{this.newDevice()}</span><br />
            <span className="devicename">{this.device()} message: {this.message()}</span><br />
            <span className="lastseen">{moment(this.props.notification.created).fromNow()}</span>
          </div>
        </Link>

      )
    }

    if (this.props.notification.type == "CONNECTION DOWN 24HR WARNING") {
      return (

        <Link to={"/u/" + this.props.account.username + "/view/" + this.device()} title="View Device Data">
          <div className="warningNotificationItem">
            <i className="fas fa-exclamation-triangle"></i>
            <span className="newdevice" >{this.newDevice()}</span><br />
            <span className="devicename">{this.device()}</span><br />
            <span className="lastseen">{moment(this.props.notification.created).fromNow()}</span>
          </div>
        </Link>
      )
    }

    if (!this.props.notification.type == "NEW DEVICE ADDED" ||
      !this.props.notification.type == "ALARM" ||
      !this.props.notification.type == "CONNECTION DOWN 24HR WARNING" ||
      this.props.notification.type == undefined ||
      this.props.notification.type == null
    ) {
      return (

        <div className="warningNotificationItem">
          <i className="fas fa-exclamation-triangle"></i>
          YOU HAVE NO NOTIFICATIONS
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
      notification: [{}],
      displayMenu: false,
      users: {}
    }

    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this)
    this.showDropdownMenu = this.showDropdownMenu.bind(this);
    this.hideDropdownMenu = this.hideDropdownMenu.bind(this);
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

  showDropdownMenu(event) {
    event.preventDefault();
    this.setState({ displayMenu: true }, () => {
      document.addEventListener('click', this.hideDropdownMenu);
    });
  }

  hideDropdownMenu() {
    this.setState({ displayMenu: false }, () => {
      document.removeEventListener('click', this.hideDropdownMenu);
    });

  }

  showSettings = () => {
    if (this.props.account) {
      if (this.props.account.level > 0) {
        return (<Link to="/settings" className="navLink" title="Settings"><FontAwesomeIcon icon="cog" /></Link>)
      }
    }
  }

  showNotificationsView = () => {
    if (this.props.account) {
      if (this.props.account.level > 0) {
        return (<Link style={{ position: "right" }} to="/notifications" className="navLink" title="Notifications">View all Notifications</Link>)
      }
    }
  }

  goSettings = (account) => {

    return (
      <div className="dropdown">
        <div className="fas fa-user" onClick={this.showDropdownMenu}></div>

        {this.state.displayMenu ? (
          <div className="dropdown-content" style={{ width: "max-content" }}>
            <span style={{ fontSize: 13 }} title="email">EMAIL: {account.email}</span>
            <br></br>
            <span style={{ fontSize: 13 }} title="username">USERNAME: {account.username}</span>
            <br></br>
            <span style={{ fontSize: 13 }} title="level">LEVEL: {account.level}</span>
            <br></br>
            <br></br>
            <div style={{ backgroundColor: "#131e27", padding: "10px", opacity: "0.6" }}>
              <a href="/settings">
                <span className="navLink" style={{ paddingRight: "25px" }}>
                  <FontAwesomeIcon icon="user-edit" /> EDIT ACCOUNT
              </span>
              </a>
              <a href="/signout">
                <span className="navLink"  >
                  <FontAwesomeIcon icon="sign-out-alt" />  SIGN OUT
            </span>
              </a>
            </div>
          </div>
        ) :
          (
            null
          )
        }
      </div>
    );
  }

  goAccountName = (account) => {
    return account.username
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
              <div className="notificationPanel" style={{ padding: "50%", position: "absolute", color: "#ccc", background: "#101e29", width: 450, right: "25px", top: 25, zIndex: 1000 }}>
                {account.notifications.slice(Math.max(account.notifications.length - 5, 1)).reverse().map((notification, i) => <Notification key={notification.device + i} notification={notification} account={account}></Notification>)}
                <span>{this.showNotificationsView()}</span>
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

    if (this.props.account.notifications) {
      if (this.props.account.notifications.length == 0 || this.props.account.notifications == undefined) {
        return <span />;
      }
      else {
        return <span className="button__badge">{this.props.account.notifications.length}</span>
      }
    }
    return
  }

  account = (account) => {
    if (account) {
      if (account.level > 0) {
        return (
          <div style={{ padding: "20px 20px 20px 20px 20px", float: "right", paddingRight: "20px", paddingTop: "18px" }}>
            <span className="navLink" style={{ float: "left" }}>{this.goSettings(account)}</span>
            <span style={{ marginRight: "5px" }}>{this.showSettings()}</span>
            <span style={{ height: 10, float: "right" }}>{this.showNotifications(account)}</span>
            {this.countArray()}
          </div>
        )
      } else {
        return null;
      }
    } else {
      return null;
    }

  }
  out = () => {
    allUsers = []
    this.setState({ users: [] })
  }
  search = evt => {
    if (evt.target.value.length == 0) {
      allUsers = []
      this.setState({ users: [] })
    }
    fetch("/api/v3/allUsers", {
      method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ search: evt.target.value.toString() })
    }).then(response => response.json()).then(stats => {
      this.setState({ users: stats })
      allUsers = this.state.users
    }).catch(err => console.error(err.toString()));
  }

  searchUser = () => {
    if (allUsers.length == 0) {
      return null
    }
    else {
      return (
        <div >
          <div id="data" style={{ marginLeft: "284px", width: "300px", position: "absolute", backgroundColor: "black", height: "300px", overflowY: "scroll", overflowX: "hidden" }}>
            {allUsers.map((user, i) =>
              <div style={{ height: "20%", marginLeft: "5px" }} key={i}>
                <Link to={"/u/" + user.username} onClick={this.out}><p>{user.username}<br></br>
                  <p style={{ color: "grey" }}>{user.email}</p></p>
                </Link><hr style={{ backgroundColor: "grey" }}></hr>
                <br></br>
              </div>
            )}</div>
        </div>
      )
    }
  }

  findpeople = () => {
    if (this.props.account) {
      if (this.props.account.level > 0) {
        return (<input type="text" placeholder="username or email.." style={{ marginLeft: "20px", marginTop: "10px", width: "300px" }} list="data" onChange={this.search} />)
      }
      else if (this.props.account.level == 0) {
        return null
      }
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

      <div className="row " style={{ paddingBottom: 30 }}>
        <div className="col-md-12 navbar" style={{ position: "fixed", zIndex: 1000, width: "100%", right: 0 }}>
          <div className="navbarInsideWrap">
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
                  <span className="navHeading">PR0T0TYP3</span> <span id="navDashboard" style={{ color: "#fff", fontSize: 15 }}>DASHBOARD</span> <span className="version" id="version">{this.props.version}</span>
                </div>
              </div>
            </Link><div>
              {this.findpeople()}
              {this.account(this.props.account)}
              {this.searchUser()}
            </div>
          </div>
        </div>
      </div >

    );
  }
}
