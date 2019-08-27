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
          <Route exact path="/account" component={this.account} />
          <Route exact path="/u/:username" component={this.userView} />
          <Route exact path="/u/:username/view/:id" component={this.deviceView} />
          <Route path="/signout" component={this.signout} />
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
    return (
      <div style={{
        height: this.state.height,
        display: "flex",
        flexDirection: "column",
        //border: "2px solid #0f9",
        //boxSizing: "border-box",
        //overflow: "hidden"
      }}>
        <div style={{ flex: "0 1 auto" }}><NavBar /></div>

        <div style={{
          flex: "1 1 auto",
          flexFlow: "column",
          overflowY: "auto",
          //border: "2px solid #f00",
          boxSizing: "border-box"
        }}>
          <DeviceList />
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
