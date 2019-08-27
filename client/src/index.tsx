import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, Link, NavLink, Nav } from "react-router-dom";

import { NavBar } from "./components/navbar";
import { Login } from "./components/login";
import { Landing } from "./pages/landing";

import { api } from "./api";

import { DeviceList } from "./components/devicelist"
import { theme } from "./theme"
import { SideBar } from "./components/sidebar"
import { DeviceView } from "./components/deviceview";
import { BGgrad } from "./pages/bggrad"

import { Account } from "./components/account"
import { Settings } from "./components/settings"

import { ProtoMap as Map } from "./components/map"

export default class App extends React.Component {
  state = {
    count: 0,
    showSidebar: false,
    account: undefined,
    states: undefined,
    height: window.innerHeight,
    ready: false
  };

  constructor(props) {
    super(props);

    this.getaccount();

    api.on("account", account => {
      this.setState({ account });
    });

    api.on("states", states => {
      this.setState({ states });
    })

    api.on("location", location => {
      window.location = location
    })

    window.addEventListener("resize", () => {
      this.setState({ height: window.innerHeight })
    })
  }

  getaccount = () => {
    api.account((err, account) => {
      this.setState({ ready: true })
      if (err) {
        console.log(err);
      }
      if (account) {
        this.setState({ account });

        api.states((err, states) => {
          if (states) {
            this.setState({ states })
          }
        })

      }
    });
  };

  increment = () => {
    this.setState({
      count: this.state.count + 1
    });
  };

  decrement = () => {
    this.setState({
      count: this.state.count - 1
    });
  };

  mobileMenuPress = () => {
    this.setState({ showSidebar: !this.state.showSidebar });
  };

  render() {

    if (!this.state.ready) {
      return (<div></div>)
    }

    // NEW/RETURNING VISTORS
    if (!this.state.account) {
      return (
        <BrowserRouter>
          <Route exact path="/" component={this.landing} />
          <Route exact path="/u/:username" component={this.userView} />
          <Route exact path="/u/:username/view/:id" component={this.deviceView} />
          <Route path="/login" component={this.login} />
        </BrowserRouter>
      )
    }

    // LOGGED IN USERS
    if (this.state.account) {
      return (
        <BrowserRouter>
          <Route exact path="/" component={this.home} />
          <Route exact path="/u/:username" component={this.userView} />
          <Route exact path="/u/:username/view/:id" component={this.deviceView} />
          <Route path="/signout" component={this.signout} />
          <Route exact path="/settings" component={this.settings} />
          <Route exact path="/settings/account" component={this.account} />
        </BrowserRouter>
      )
    }

    // const { showSidebar } = this.state;

    // var size = "large";
    // if (window.innerWidth < 800) { size = "small" }

    // return (
    //   <div style={{}}>
    //     <BrowserRouter>
    //       <Route exact path="/" component={this.home} />
    //       <Route exact path="/u/:username" component={this.userView} />
    //       <Route exact path="/u/:username/view/:id" component={this.deviceView} />
    //       <Route path="/login" component={this.login} />
    //       <Route path="/signout" component={this.signout} />
    //     </BrowserRouter>

    //     <SideBar open={false} toggle={this.mobileMenuPress} >sidebarA</SideBar>
    //   </div >
    //);
  }

  settings = (props) => {
    return <div><NavBar /><Settings /></div>
  }

  account = (props) => {
    return <div><NavBar /><Account /></div>
  }

  // new vistors home/landing page.. 
  landing = (props) => {
    return <div>
      <BGgrad />
      <NavBar />
      <Landing />
    </div>
  }

  home = (props) => {
    var s1: any = { height: this.state.height, display: "flex", flexDirection: "column" }
    var s2: any = { flex: "1 1 auto", flexFlow: "column", overflowY: "auto", boxSizing: "border-box" }
    var size = (window.innerWidth < 800) ? "small" : "large"
    return (
      <div style={s1}>

        <div style={{ flex: "0 1 auto" }}>
          <NavBar />
        </div>

        <div style={s2}>

          {(size == "small")
            ? (<DeviceList />)
            : (<div style={{ overflow: "hidden", display: "flex", height: "100%" }}>

              <div><DeviceList /></div>
              <div style={{ flex: "1 0 auto" }}><Map /></div>

            </div>)}

        </div>

        <div style={{ flex: "0 1 40px" }}>footer</div>
      </div>
    )
  };

  userView = (props) => {
    return <div>
      <NavBar />
      <DeviceList username={props.match.params.username} />
    </div>
  }

  deviceView = (props) => {
    return <div>
      <NavBar />
      <DeviceView username={props.match.params.username} id={props.match.params.id} />
    </div>
  }

  login = (props) => {
    return <Login history={props.history} getaccount={this.getaccount} />;
  };

  signout = (props) => {
    api.location("/signout");
    return <div>signing out</div>;
  }
}


render(<App />, document.getElementById("app"));
