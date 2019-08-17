import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, NavLink } from 'react-router-dom'

import "../prototype.scss"

export class NavBar extends React.Component {

  state = {
    mobileMenuActive: false
  }


  mobileMenuPress = () => {
    this.setState({ mobileMenuActive: !this.state.mobileMenuActive })
  }

  render() {
    return (
      <div id="myTopnav" className={"topnav " + (this.state.mobileMenuActive ? "responsive" : "")}>
        <NavLink id="topnavhome" exact activeClassName="active" to="/" >

          <div style={{ float: "left" }}>
            <img
              src="/icon.png"
              alt=""
              width="23"
              height="23"
              style={{ float: "left" }}
            />

            <div style={{ paddingLeft: 5, paddingTop: 2, float: "left" }} >
              <span className="navHeading">PR0T0TYP3</span>
            </div>
          </div>

        </NavLink>

        <NavLink activeClassName="active" to="/register">Register</NavLink>
        <NavLink activeClassName="active" to="/login">Login</NavLink>
        <NavLink activeClassName="active" to="/resources">Resources</NavLink>
        <NavLink activeClassName="active" to="/features">Features</NavLink>
        <NavLink activeClassName="active" to="/products">Products</NavLink>

        <a className="icon" onClick={this.mobileMenuPress}>
          <i className="fa fa-bars"></i>
        </a>
      </div>
    );
  }



}

