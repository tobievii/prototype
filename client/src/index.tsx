import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, Link, NavLink, Nav } from "react-router-dom";

import { NavBar } from "./components/navbar";
import { Login } from "./components/login";
import { Home } from "./pages/home";

import { api } from "./api";

import { DeviceList } from "./components/devicelist"
import { theme } from "./theme"
import { SideBar } from "./components/sidebar"
import { DeviceView } from "./components/deviceview";

const BGgrad = (props) => (
  <header className="site-banner banner banner--shape banner--homepage">
    <div className="banner__background">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 1903 556"
      >
        <path
          className="svg-banner-shape"
          d="M753.1,434.2c110.6,63.7,277.7,70.6,373.4,15.4L1905,0v555.9H0V0.2L753.1,434.2z"
        />
      </svg>
    </div>
  </header>
)

export default class App extends React.Component {
  state = {
    count: 0,
    showSidebar: false,
    account: undefined,
    states: undefined,
    height: window.innerHeight
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
    const { showSidebar } = this.state;

    var size = "large";
    if (window.innerWidth < 800) { size = "small" }

    return (
      <div style={{}}>
        <BrowserRouter>
          <Route exact path="/" component={this.home} />
          <Route exact path="/u/:username" component={this.userView} />
          <Route exact path="/u/:username/view/:id" component={this.deviceView} />
          <Route path="/login" component={this.login} />
          <Route path="/signout" component={this.signout} />
        </BrowserRouter>

        <SideBar open={false} toggle={this.mobileMenuPress} >sidebarA</SideBar>
      </div >
    );
  }

  home = (props) => {
    if (this.state.account) {
      return (
        <div style={{
          height: this.state.height,
          display: "flex",
          flexDirection: "column",
          //border: "2px solid #0f9",
          //boxSizing: "border-box",
          //overflow: "hidden"
        }}>
          <div style={{ flex: "0 1 auto" }}><NavBar account={this.state.account} /></div>

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
    } else {
      return (
        <div>
          <BGgrad />
          <NavBar account={this.state.account} />
          <Home history={props.history} getaccount={this.getaccount} />
        </div>);
    }
  };

  userView = (props) => {
    return <div>
      <NavBar account={this.state.account} />
      <DeviceList username={props.match.params.username} />
    </div>
  }

  deviceView = (props) => {
    return <div>
      <NavBar account={this.state.account} />
      <DeviceView username={props.match.params.username} id={props.match.params.id} />
      {JSON.stringify(props.match)}
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
