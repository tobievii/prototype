import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, NavLink } from "react-router-dom";

import "../prototype.scss";

import { User } from "../../../server/core/interfaces";
import { theme } from "../theme"

import { api } from "../api"

interface MyProps {
  account: User;
  size: string;
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
    // LOGGED IN USERS:
    if (this.props.account) {

      const menuitemsLogged = [
        { small: "N", large: "Notifications", path: "/notifications", icon: "bell" },
        { small: "S", large: "Settings", path: "/settings", icon: "cog" },
        { small: "A", large: "Account", path: "/account", icon: "user-circle" }
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

          {menuitemsLogged.map((menuitem, i, arr) => {
            if (this.props.size == "small") {
              return (<NavLink key={i} activeClassName="active" to={menuitem.path} style={theme.global.navlinksmall}>
                <i className={"fa fa-" + menuitem.icon} ></i>
              </NavLink>)
            } else {
              return (<NavLink key={i} activeClassName="active" to={menuitem.path} style={theme.global.navlinklarge}>
                <i className={"fa fa-" + menuitem.icon} ></i> {menuitem.large}
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
        { small: "R", large: "Register", path: "/register", icon: "" },
        { small: "L", large: "Login", path: "/login", icon: "" },
        { small: "R", large: "Resources", path: "/resources", icon: "" },
        { small: "F", large: "Features", path: "/features", icon: "" },
        { small: "P", large: "Products", path: "/products", icon: "" }
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
            if (this.props.size == "small") {
              return (<NavLink key={i} activeClassName="active" to={menuitem.path}>
                <i className={"fa fa-" + menuitem.icon} ></i>
              </NavLink>)
            } else {
              return (<NavLink key={i} activeClassName="active" to={menuitem.path}>
                <i className={"fa fa-" + menuitem.icon} ></i>
                {menuitem.large}
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
