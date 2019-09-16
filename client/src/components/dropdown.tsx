import React from "react";
import { BrowserRouter, Route, Link, NavLink } from "react-router-dom";
import "../prototype.scss";
import { User } from "../../../server/shared/interfaces";
import { theme, colors } from "../theme"
import { api } from "../api"
import { SearchBox } from "./searchbox"

interface MenuItems {
  /** show only icon on small screens */
  responsive?: boolean,
  text: string,
  icon?: string,
  onClick?: any,
  link?: string,
  menuitems?: MenuItems[]
  enabled?: boolean
}

interface Props {
  //account: User;
  enabled?: boolean
  icon?: string;
  text: string
  items: MenuItems[]
  style?: any;
  height?: number;
}

interface State {
  [index: string]: any;
}

/** Makes a dropdown menu component */

export class Dropdown extends React.Component<Props, State> {
  state = {
    mobileMenuActive: false,
    show: false,
    icon: "chevron-down",
    minWidth: 50 //this auto adjusts
  };

  wrapper;

  componentDidMount = () => {
    if (this.props.icon) {
      this.setState({ icon: this.props.icon })
    }
    this.wrapper = React.createRef();
  }


  componentDidUpdate() {
    /* detect width of button so dropdown menu items can use this width as a minimum*/
    if (this.wrapper) {
      if (this.wrapper.current) {
        var minWidth = this.wrapper.current.offsetWidth;
        this.setState((state) => {
          if (state.minWidth != minWidth) { return { minWidth }; }
        })
      }
    }
  }

  render() {

    var buttonstyle: any = { display: "inline-block", textAlign: "left" }
    if (this.props.style) { buttonstyle = this.props.style }

    var enabled = true; //default
    if (this.props.enabled != undefined) { enabled = this.props.enabled }

    var dropdownmenubuttonsstyle: any = { textAlign: "left" }

    if (buttonstyle.background) { dropdownmenubuttonsstyle.background = buttonstyle.background; }
    if (buttonstyle.color) { dropdownmenubuttonsstyle.color = buttonstyle.color }

    if (this.props.height) {
      dropdownmenubuttonsstyle.height = this.props.height

    }

    dropdownmenubuttonsstyle.minWidth = this.state.minWidth

    console.log(dropdownmenubuttonsstyle.minWidth);

    return <div style={buttonstyle} ref={this.wrapper}>

      {(enabled)
        ? <button style={buttonstyle} onClick={() => { this.setState({ show: !this.state.show }) }}>
          <i className={"fas fa-" + this.state.icon} /> {this.props.text}
        </button>
        : <button style={{ ...buttonstyle, ...{ opacity: 0.5 } }} onClick={() => { this.setState({ show: !this.state.show }) }} disabled>
          <i className={"fas fa-" + this.state.icon} /> {this.props.text}
        </button>
      }

      <div style={{
        display: (this.state.show) ? "flex" : "none",
        flexDirection: "column",
        position: "absolute",
        background: colors.panels,
        zIndex: 100
      }}>
        {this.props.items.map((item, i) => {
          var icon = (item.icon) ? item.icon : "caret-right";

          var buttonenabled = true; //default true
          if (item.enabled != undefined) { buttonenabled = item.enabled } //optional override

          if (buttonenabled) {
            return <button style={dropdownmenubuttonsstyle} key={i}
              onClick={() => {
                item.onClick();
                this.setState({ show: false }); //hides the dropdown when clicking a menu option
              }}>
              <div style={{ width: 20, textAlign: "center", float: "left", paddingRight: 5 }}>
                <i className={"fas fa-" + icon} /></div>
              {item.text}
            </button>
          } else {
            return <button style={{ ...dropdownmenubuttonsstyle, ...{ textAlign: "left", opacity: 0.5, cursor: "not-allowed" } }} key={i} disabled>
              <div style={{ width: 20, textAlign: "center", float: "left", paddingRight: 5 }}>
                <i className={"fas fa-" + icon} /></div>
              {item.text}
            </button>
          }


        })}
      </div>

    </div >
  }
}

/*

    var size = "large";
    if (window.innerWidth < 800) { size = "small" }

    // LOGGED IN USERS:
    if (api.data.account) {

      const menuitemsLogged = [
        { text: "Notifications", path: "/notifications", icon: "bell" },
        { text: "Settings", path: "/settings", icon: "cog" },
        { text: api.data.account.username, path: "/settings/account", icon: "user-circle" }
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
    if (api.data.account == undefined) {

      const menuitemsVisitor = [
        //{ text: "Resources", path: "/resources", icon: "" },
        //{ text: "Features", path: "/features", icon: "" },
        //{ text: "Products", path: "/products", icon: "" }
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
*/