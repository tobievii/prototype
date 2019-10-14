import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, Link, NavLink, Nav, Switch } from "react-router-dom";
import { NavBar } from "./components/navbar";
import { Login } from "./components/login";
import { Landing } from "./pages/landing";
import { api } from "./api";
import { DeviceList } from "./components/devicelist";
import { theme, colors } from "./theme";
import { SideBar } from "./components/sidebar";
import { DeviceView } from "./components/deviceview";
import { BGgrad } from "./pages/bggrad";



import { ProtoMap as Map } from "./components/map";
import { clone } from "./utils/lodash_alt";
import { registerServiceWorker } from "./serviceworker/serviceworker_register"

import { Documentation } from "./pages/docs"
import { Settings } from "./pages/settings";

// new login/register
import { UserRegistration } from "./components/user_registration";
import { UserLogin } from "./components/user_login";
import { RegisterPage } from "./pages/register";
import { LoginPage } from "./pages/login";

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
    });

    api.on("location", location => {
      window.location = location;
    });

    window.addEventListener("resize", () => {
      this.setState({ height: window.innerHeight });
    });

    registerServiceWorker();

    // todo: disable location for now
    // this.getlocation();
  }

  getlocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(gps => {
        console.log(gps);
        // api.post({
        //   id: "you",
        //   data: { gps: { lat: gps.coords.latitude, lon: gps.coords.longitude } }
        // });
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  getaccount = () => {
    api.account((err, account) => {
      if (err) {
        // public not logged in
        console.log(err);
        this.setState({ ready: true })
      }
      if (account) {
        console.log(account);
        this.setState({ account, ready: true });

        api.states((err, states) => {
          if (states) {
            //this.setState({ states });
          }
        });
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
      return <div></div>;
    }

    if (!this.state.account) {
      return <div>loading</div>
    }

    // NEW VISTORS
    if (this.state.account.level == 0) {
      return (
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={this.landing} />
            <Route exact path="/u/:username" component={this.userView} />
            <Route exact path="/v/:publickey" component={this.viewByPublickey} />
            <Route path="/u/:username/view/:id" component={this.deviceView} />
            <Route path="/login" component={this.login} />
            <Route path="/register" component={this.register} />
            <Route component={this.NoMatch} />
          </Switch>
        </BrowserRouter>
      );
    }

    // LOGGED IN USERS
    if (this.state.account) {
      return (
        <BrowserRouter>

          <Route path="/signout" component={this.signout} />

          <Route exact path="/" component={this.home} />
          <Route exact path="/u/:username" component={this.userView} />

          <Route exact path="/u/:username/view/:id" component={this.deviceView} />
          <Route exact path="/v/:publickey" component={this.viewByPublickey} />


          <Route exact path="/docs" component={this.docs} />
          <Route exact path="/docs/:page" component={this.docs} />

          <Route exact path="/settings" component={this.settings} />
          <Route exact path="/settings/:page" component={this.settings} />
        </BrowserRouter>
      );
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

  NoMatch = props => {
    console.log("nomatch");
    console.log(props);
    return (
      <div>
        <NavBar onlyLogo={true} />
        <LoginPage />
        {/* nomatch? login first? {JSON.stringify(props)} */}
      </div>)
  }

  docs = props => {
    return (<div>
      <BGgrad />
      <NavBar />
      <Documentation page={props.match.params.page} />
    </div>)
  }

  settings = props => {
    return (
      <div>
        <BGgrad />
        <NavBar />
        <Settings page={props.match.params.page} />
      </div>
    );
  };


  // new vistors home/landing page..
  landing = props => {
    return (
      <div style={{ background: "#232323" }}>
        <div style={{ zIndex: 100 }}>
          <NavBar />
        </div>
        <div style={{ overflow: "hidden" }}>
          <Landing />
        </div>


      </div>
    );
  };

  home = props => {
    var size = window.innerWidth < 800 ? "small" : "large";

    var wrapper = clone(theme.global.responsive.wrapper);
    wrapper.height = this.state.height;

    return (
      <div >
        <BGgrad />
        <NavBar />
        <div style={{ minHeight: "500px" }}>
          {size == "small"
            ? <DeviceList />
            : <div style={{
              boxSizing: "border-box", display: "flex",
              flexDirection: "row", width: "100%"
            }}>
              <div style={{ flex: "0", height: "500px", minWidth: "600px" }}>
                <DeviceList />
              </div>
              <div style={{ flex: "1" }}>
                <Map />
              </div>
            </div>
          }
        </div>

        <div style={{ flex: "0 1 40px" }}><Documentation /></div>
      </div>
    );
  };



  userView = props => {
    var size = window.innerWidth < 800 ? "small" : "large";

    return (
      <div>
        <BGgrad />
        <NavBar />

        <div style={{ margin: colors.padding * 2, minHeight: "500px" }}>
          {size == "small" ? (
            <DeviceView
              username={props.match.params.username}
              id={props.match.params.id}
            />
          ) : (
              <div style={{
                boxSizing: "border-box", display: "flex",
                flexDirection: "row", width: "100%"
              }}>
                <div style={{ flex: "0", height: "500px", minWidth: "400px" }}>
                  <DeviceList username={props.match.params.username} />
                </div>
                <div style={{ flex: "1" }}>
                  <Map />
                </div>
              </div>
            )}
        </div>

        <div style={{ flex: "0 1 40px" }}>footer</div>
      </div>
    );
  };

  viewByPublickey = props => {
    return (<div>
      {/* <NavBar /> */}
      <DeviceView publickey={props.match.params.publickey} hidecontrols={true} /></div>)
  }

  deviceView = props => {
    console.log("deviceView", props)
    return <div>
      <NavBar />

      {/* <DeviceList username={props.match.params.username} /> */}
      <DeviceView
        username={props.match.params.username}
        id={props.match.params.id}
      />
    </div>

    var size = window.innerWidth < 800 ? "small" : "large";

    var wrapper = clone(theme.global.responsive.wrapper);
    wrapper.height = this.state.height;

    var content = clone(theme.global.responsive.content);
    content.width = window.innerWidth;

    var contentSplit = clone(theme.global.responsive.content);
    contentSplit.width = window.innerWidth - 500;

    return (
      <div style={wrapper}>
        <div style={theme.global.responsive.navbar}>
          <NavBar />
        </div>

        <div style={content}>
          {size == "small" ? (
            <DeviceView
              username={props.match.params.username}
              id={props.match.params.id}
            />
          ) : (
              <div style={theme.global.responsive.contenthorizontal}>
                <div style={{ flex: "0 auto", width: "500px" }}>
                  <DeviceList username={props.match.params.username} />
                </div>
                <div style={contentSplit}>
                  <DeviceView
                    username={props.match.params.username}
                    id={props.match.params.id}
                  />
                </div>
              </div>
            )}
        </div>

        <div style={{ flex: "0 1 40px" }}>footer</div>
      </div>
    );
  };

  login = props => {
    return (<div>
      <NavBar onlyLogo={true} />
      <LoginPage />
      {/*       
      <div style={{ padding: colors.padding * 2, zIndex: 3 }}>

        <div style={styleregister}>

          <div style={{ padding: colors.padding * 2 }}>
            <h2>Login</h2>
            <p style={colors.p}>Glad to see you're back. <br />
              Please authenticate your account below and we'll get your back up and running. </p>
          </div>

          <UserLogin mode={"login"} />

          <div style={{
            ...colors.p, ...{
              padding: colors.padding * 1,
              paddingTop: colors.padding * 2,
              paddingBottom: colors.padding * 3,
              textAlign: "right",
              fontSize: "12pt"
            }
          }}>
            Don't have an account yet? You'll need to <a href="/register">register</a> an account first.
          </div>

          <div style={{ ...colors.p, ...{ background: "rgba(0,0,0,0.1)", padding: colors.padding * 1, textAlign: "right", fontSize: "12pt" } }}>
            By logging in, you agree to our <a style={{ whiteSpace: "nowrap" }} href="/terms">Terms of Service</a>.
          </div>

        </div>
      </div> */}
    </div>)
  };

  /** /register page */
  register = props => {
    return (<div>
      <NavBar onlyLogo={true} />
      <RegisterPage />
    </div>)
  };

  signout = props => {
    api.location("/signout");
    return <div>signing out</div>;
  };
}

render(<App />, document.getElementById("app"));
