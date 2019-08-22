import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, NavLink } from "react-router-dom";

import "../prototype.scss";

import { User } from "../../../server/core/interfaces";
import { theme } from "../theme"

import { api } from "../api"

import { SearchBox } from "./searchbox"

interface MyProps {
  account: User;
}

interface MyState {
  [index: string]: any;
}

export class NavBar extends React.Component<MyProps, MyState> {
  state = {
    mobileMenuActive: false
  };

  mobileMenuPress = () => {
    this.setState({ mobileMenuActive: !this.state.mobileMenuActive });
  };

  render() {

    var size = "large";
    if (window.innerWidth < 800) { size = "small" }

    // LOGGED IN USERS:
    if (this.props.account) {

      const menuitemsLogged = [
        { text: "Notifications", path: "/notifications", icon: "bell" },
        { text: "Settings", path: "/settings", icon: "cog" },
        { text: "Account", path: "/account", icon: "user-circle" }
      ]

      return (
        <div style={theme.global.navbar}>

          <NavLink id="topnavhome" exact activeClassName="active" to="/">
            <div style={{ float: "left", padding: theme.paddings.default }}>
              <img
                src="/icon.png"
                alt=""
                width="23"
                height="23"
                style={{ float: "left" }}
              />

              <div style={{ paddingLeft: 5, paddingTop: 2, float: "left" }}>
                <span className="navHeading">PR0T0TYP3</span>
              </div>
            </div>
          </NavLink>

          <SearchBox />

          {menuitemsLogged.map((menuitem, i, arr) => {
            if (size == "small") {
              return (<NavLink key={i} activeClassName="active" to={menuitem.path} style={theme.global.navlinksmall}>
                <i className={"fa fa-" + menuitem.icon} ></i>
              </NavLink>)
            } else {
              return (<NavLink key={i} activeClassName="active" to={menuitem.path} style={theme.global.navlinklarge}>
                <i className={"fa fa-" + menuitem.icon} ></i> {menuitem.text}
              </NavLink>)
            }
          })}

          <div style={{ clear: "both" }}></div>
        </div>
      );
    }

    //////////////////////////////////////////////////////////////////

    //VISTORS:
    if (this.props.account == undefined) {

      const menuitemsVisitor = [
        { text: "Register", path: "/register", icon: "" },
        { text: "Login", path: "/login", icon: "" },
        { text: "Resources", path: "/resources", icon: "" },
        { text: "Features", path: "/features", icon: "" },
        { text: "Products", path: "/products", icon: "" }
      ]

      return (
        <div
          id="myTopnav"
          className={
            "topnav " + (this.state.mobileMenuActive ? "responsive" : "")
          }
        >
          <NavLink id="topnavhome" exact activeClassName="active" to="/">
            <div style={{ float: "left" }}>
              <img
                src="/icon.png"
                alt=""
                width="23"
                height="23"
                style={{ float: "left" }}
              />

              <div style={{ paddingLeft: 5, paddingTop: 2, float: "left" }}>
                <span className="navHeading">PR0T0TYP3</span>
              </div>
            </div>
          </NavLink>

          {menuitemsVisitor.map((menuitem, i, arr) => {
            if (size == "small") {
              return (<NavLink key={i} activeClassName="active" to={menuitem.path}>
                <i className={"fa fa-" + menuitem.icon} ></i>
              </NavLink>)
            } else {
              return (<NavLink key={i} activeClassName="active" to={menuitem.path}>
                <i className={"fa fa-" + menuitem.icon} ></i>
                {menuitem.text}
              </NavLink>)
            }
          })}

          <a className="icon" onClick={this.mobileMenuPress}>
            <i className="fa fa-bars" />
          </a>
        </div>
      );
    }
  }
}
