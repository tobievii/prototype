import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, NavLink, Nav } from "react-router-dom";

//import "./prototype.scss";

import { NavBar } from "./components/navbar";
import { Login } from "./components/login";

import { Home } from "./pages/home";

import "./api";
import { api } from "./api";

import { Grommet, Box, Button, Heading, Collapsible, ResponsiveContext, Layer } from 'grommet';
import { normalizeColor } from "grommet/utils"
import { rgba } from "polished"
import { Notification, FormClose } from 'grommet-icons';

import { DeviceList } from "./components/devicelist"
import { theme } from "./theme"
import { SideBar } from "./components/sidebar"

const AppBar = (props) => (
  <Box
    tag='header'
    direction='row'
    align='center'
    justify='between'
    background='panelbg'
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    elevation='medium'
    style={{ zIndex: '1' }}
    {...props}
  />
);

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
    states: undefined
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
    console.log("----")
    this.setState({ showSidebar: !this.state.showSidebar });
  };

  render() {
    const { showSidebar } = this.state;
    return (
      <Grommet theme={theme} full>
        <ResponsiveContext.Consumer>
          {size => (
            <div>
              <AppBar>
                <Heading level='3' margin='none'>My App</Heading>

                <Button
                  label="hello world"
                  primary
                  icon={<Notification />}
                  onClick={() => this.setState((prevState: any) => ({ showSidebar: !prevState.showSidebar }))}
                />
              </AppBar>

              <BrowserRouter>
                <div>
                  <NavBar account={this.state.account} />
                  <Route exact path="/" component={this.home} />
                  <Route path="/login" component={this.login} />
                </div>
              </BrowserRouter>

              <SideBar size={size} open={showSidebar} toggle={this.mobileMenuPress} >sidebarA</SideBar>

            </div>
          )}
        </ResponsiveContext.Consumer>
      </Grommet >
    );
  }

  home = () => {
    if (this.state.account) {
      return (
        <Box align="center" background="panelbg">
          <DeviceList account={this.state.account} states={this.state.states} />
        </Box>
      )
    } else {
      return (<Home />);
    }
  };

  login = (props) => {
    return <Login history={props.history} getaccount={this.getaccount} />;
  };
}


ReactDOM.render(<App />, document.getElementById("app"));
