import React, { Component } from "react";

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faTimes, faBell, faUserEdit, faSignOutAlt, faEye, faPlus, faTasks } from '@fortawesome/free-solid-svg-icons'

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import moment from 'moment'

library.add(faCog)
library.add(faEye)
library.add(faPlus)
library.add(faTimes)
library.add(faBell);
library.add(faSignOutAlt)
library.add(faUserEdit)
library.add(faTasks)
// library.add(faChartBar)
// library.add(faDigitalTachograph)


export class Notification extends Component {
  constructor(props) {
    super(props);
  }

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
            <span className="devicename">"{this.device()}" has been successfully added.</span><br />
            <span className="lastseen" >{moment(this.props.notification.created).fromNow()}</span>
          </div>
        </Link>

      )
    } else if (this.props.notification.type == "INFO") {
      return (
        <Link to={"/u/" + this.props.account.username + "/view/" + this.device()} title="View Device Data">
          <div className="newNotificationItem">
            <i className="fas fa-exclamation-circle"></i>
            <span className="newdevice" >{this.newDevice()}</span><br />
            <span className="devicename">"{this.device()}" message: {this.message()}.</span><br />
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
          <span className="devicename">{this.props.notification.from} shared "{this.props.notification.device}" with you.</span><br />
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
            <span className="devicename">"{this.device()}" message: {this.message()}.</span><br />
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
            <span className="devicename">"{this.device()}" has not been seen for 24hrs.</span><br />
            <span className="lastseen">{moment(this.props.notification.created).fromNow()}</span>
          </div>
        </Link>
      )
    } else if (this.props.notification.type == "WARNING") {
      return (
        <Link to={"/u/" + this.props.account.username + "/view/" + this.device()} title="View Device Data">
          <div className="warningNotificationItem">
            <i className="fas fa-exclamation-triangle"></i>
            <span className="newdevice" >{this.newDevice()}</span><br />
            <span className="devicename">"{this.device()}" message: {this.message()}.</span><br />
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

  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      devid: undefined,
      error: null,
      isLoaded: false,
      notification: [{}],
      displayMenu: false,
      displayViews: false,
      users: {},
      showNav: "",
      showSearch: "none",
      searchIcon: "none",
      allUsers: [],
      popupHeading: "ADD DEVICE BY:",
      popupInfo: "default",
      devicesView: "devices"
    }
    this.showMenu = this.showMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this)
    this.showDropdownMenu = this.showDropdownMenu.bind(this);
    this.hideDropdownMenu = this.hideDropdownMenu.bind(this);
  }

  componentDidMount = () => {
    if (window.innerWidth <= 667) {
      this.setState({ searchIcon: "" })
    }
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

  showDropdownMenu(options) {
    event.preventDefault();
    if (options == "views") {
      this.setState({ displayViews: true }, () => {
        document.addEventListener('click', this.hideDropdownMenu);
      });
    } else if (options == "account") {
      this.setState({ displayMenu: true }, () => {
        document.addEventListener('click', this.hideDropdownMenu);
      });
    }
  }

  hideDropdownMenu() {
    if (this.state.displayViews == true) {
      this.setState({ displayViews: false }, () => {
        document.removeEventListener('click', this.hideDropdownMenu);
      });
    }

    if (this.state.displayMenu == true) {
      this.setState({ displayMenu: false }, () => {
        document.removeEventListener('click', this.hideDropdownMenu);
      });
    }
  }

  showSettings = () => {
    if (this.props.account) {
      if (this.props.account.level > 0) {
        return (<Link to="/settings" className="navLink" title="Settings"><FontAwesomeIcon icon="cog" title="View settings" /></Link>)
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
        <div className="fas fa-user" title="View account infromation" onClick={() => this.showDropdownMenu("account")}></div>

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
              <div className="notificationPanel" style={{ padding: "50%", position: "absolute", color: "#ccc", background: "#101e29", width: 450, right: "1px", top: 25, zIndex: 1000 }}>
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
    var count = 0;
    var notifications = this.props.account.notifications;
    if (this.props.account.notifications) {
      for (var x in notifications) {
        if (notifications[x].seen == false) {
          count++;
        }
      }

      if (count == 0 || count == undefined) {
        return <span />;
      }
      else {
        return <span className="button__badge">{count}</span>
      }
    } else {
      return <span></span>
    }
  }

  searchNav = () => {
    this.setState({ showNav: "none" })
    this.setState({ showSearch: "" })
  }

  findPerson = () => {
    if (window.innerWidth <= 667) {
      return (
        <div className="fas fa-search" onClick={this.searchNav}></div>
      )
    }

  }

  account = (account) => {
    if (account) {
      if (account.level > 0) {
        return (
          <div style={{ padding: "20px 20px 20px 20px 20px", float: "right", paddingRight: "20px", paddingTop: "18px" }}>
            <span className="navLink" style={{ float: "left", marginRight: "25px", display: this.state.searchIcon }}>{this.findPerson()}</span>
            <span className="navLink" style={{ float: "left", marginRight: "28px", fontSize: "17px" }}>{this.addDeviceButton()}</span>
            {/* <span className="navLink" style={{ float: "left", marginRight: "2px", fontSize: "18px" }}>{this.changeViews(account)}</span> */}
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
    this.setState({ allUsers: [] })
    this.setState({ users: [] })
  }

  closeUserList = () => {
    this.setState({ allUsers: [] })
    this.setState({ users: [] })
  }

  search = evt => {
    if (evt.target.value.length == 0) {
      this.setState({ allUsers: [] })
      this.setState({ users: [] })
    }
    else if (evt.target.value.length > 0) {
      fetch("/api/v3/allUsers", {
        method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ search: evt.target.value.toLowerCase() })
      }).then(response => response.json()).then(stats => {
        this.setState({ users: stats })
        this.setState({ allUsers: this.state.users })
      }).catch(err => console.error(err.toString()));
    }
  }

  searchUser = () => {
    if (this.state.allUsers.length == 0) {
      return null
    }
    else {
      if (window.innerWidth > 667) {
        return (
          <div style={{ position: "fixed", top: "48px", bottom: "0", right: "0", left: "0", width: "100%", height: "100%", backgroundColor: "transparent" }} onClick={this.closeUserList}>
            <div id="data" style={{ marginLeft: "285px", width: "300px", position: "absolute", backgroundColor: "black", overflowY: "scroll", overflowX: "auto" }}>
              {this.state.allUsers.map((user, i) =>
                <div style={{ height: "5%", marginLeft: "5px", borderBottom: "0.5px solid red" }} key={i}>
                  <Link to={"/u/" + user.username} onClick={this.out}><option className="optiondropdown">{user.username}</option>
                    <p style={{ color: "grey" }}>{"Joined " + moment(user._created_on).format("DD-MMMM-YYYY")}</p>
                  </Link>
                </div>
              )}</div>
          </div>
        )
      }
      if (window.innerWidth <= 667) {
        return (<div style={{ position: "fixed", top: "48px", bottom: "0", right: "0", left: "0", width: "100%", height: "100%", backgroundColor: "transparent" }} onClick={this.closeUserList}>
          <div id="data" style={{ marginLeft: "43px", width: "80%", position: "absolute", backgroundColor: "black", overflowY: "scroll", overflowX: "hidden", marginTop: "-1px", display: this.state.showSearch }}>
            {this.state.allUsers.map((user, i) =>
              <div style={{ height: "20%", marginLeft: "5px", borderBottom: "0.5px solid red" }} key={i}>
                <Link to={"/u/" + user.username} onClick={this.out}><div>{user.username}<br></br>
                  <p style={{ color: "grey" }}>{"Joined " + moment(user._created_on).format("DD-MMMM-YYYY")}</p></div>
                </Link>
              </div>
            )}</div></div>
        )
      }
    }
  }

  findpeople = () => {
    if (window.innerWidth > 667) {
      if (this.props.account) {
        if (this.props.account.level > 0) {
          return (<input type="search" placeholder="username or email.." style={{ marginLeft: "20px", marginTop: "10px", width: "300px", border: "1px solid rgba(169, 169, 169, 0.2)" }} list="data" onChange={this.search} maxLength="32" />)
        }
        else if (this.props.account.level == 0) {
          return null
        }
      }
    }
  }

  normalNav = () => {
    this.setState({ showNav: "" })
    this.setState({ showSearch: "none" })
  }

  // setView = (view) => {
  //   this.setState({ devicesView: view });
  //   this.props.mainView(view)
  // }

  // changeViews = (account) => {
  //   return (
  //     <div className="dropdown">
  //       <FontAwesomeIcon icon="eye" title="Change main view" onClick={() => this.showDropdownMenu("views")} />
  //       {this.state.displayViews ? (
  //         <div className="arrow-up">
  //           <div className="dropdown-content" style={{ background: "#131e27", width: "max-content", left: "-1000%", marginTop: "45%" }}>
  //             <div style={{ background: "#131e27", padding: "10px", opacity: "0.7" }}>
  //               {/*Must move changeViews to dashboard 
  //               <div className="navLink" style={{ padding: "15px", fontSize: 15 }} onClick={() => this.setView("devices")}>
  //                 <FontAwesomeIcon icon="tasks" />  DEVICES ONLY
  //               </div> */}
  //               {/* <div className="navLink" style={{ padding: "15px", fontSize: 15 }} onClick={() => this.setView("dashboard")}>
  //                 <FontAwesomeIcon icon="chart-bar" />   DASHBOARD ONLY
  //               </div> */}
  //               <div className="navLink" style={{ padding: "15px", fontSize: 15 }} onClick={() => this.setView("dashboardDevices")}>
  //                 <FontAwesomeIcon icon="digital-tachograph" />  DASHBOARD WITH DEVICES
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       ) :
  //         (
  //           null
  //         )
  //       }
  //     </div>
  //   );
  // }

  addDeviceButton = () => {
    return (
      <FontAwesomeIcon icon="plus" title="Add A Device" onClick={this.addButtonClicked} />
    )
  }

  addButtonClicked = () => {
    this.props.openModal("addDevice");
  }

  render() {
    var username = ""
    if (this.props.account) {

      if (this.props.account.level > 0) {
        username = this.props.account.username;
      }
    }
    return (

      <div className="row " style={{ paddingBottom: 20 }}>
        <div className="col-md-12 navbar" style={{ position: "fixed", zIndex: 1000, width: "100%", right: 0 }} onClick={this.closeUserList}>
          <div className="navbarInsideWrap" >
            <Link to="/">
              <div style={{ padding: "20px 10px 10px 10px", float: "left", display: this.state.showNav }}>
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
            </Link><div style={{ display: this.state.showNav }}>
              {this.findpeople()}
              {this.account(this.props.account)}
              {this.searchUser()}
            </div>
            <div style={{ marginLeft: "10px", marginTop: "17px", width: "3%", position: "relative", float: "left", display: this.state.showSearch }} onClick={this.normalNav}><i className="fas fa-arrow-left"></i></div>
            <input type="search" placeholder="username or email.." style={{ width: "80%", display: this.state.showSearch, marginTop: "10px", marginBottom: "15px", marginLeft: "20px" }} list="data" onChange={this.search} maxLength="32" />
            {this.searchUser()}
          </div>
        </div>
      </div >
    );
  }
}
