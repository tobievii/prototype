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
    mobileMenuActive: false,
    account: undefined,
    states: undefined,
    showSidebar: false //new grommet

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
    this.setState({ mobileMenuActive: !this.state.mobileMenuActive });
  };

  render() {
    const { showSidebar } = this.state;
    return (
      <Grommet theme={theme} full>

        <ResponsiveContext.Consumer>
          {size => (
            <Box fill>
              <AppBar>
                <Heading level='3' margin='none'>My App</Heading>

                <Button
                  label="hello world"
                  primary
                  icon={<Notification />}
                  onClick={() => this.setState((prevState: any) => ({ showSidebar: !prevState.showSidebar }))}
                />
              </AppBar>

              {/* <BGgrad /> */}

              <BrowserRouter>
                <div>
                  <NavBar account={this.state.account} />
                  <Route exact path="/" component={this.home} />
                  <Route path="/login" component={this.login} />
                  <Route path="/about" component={About} />
                  <Route path="/topics" component={Topics} />
                </div>
              </BrowserRouter>


              <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
                <Box flex align='center' justify='center'>
                  {size}
                </Box>

                {(!showSidebar || size !== 'small') ? (
                  <Collapsible direction="horizontal" open={showSidebar}>
                    <Box
                      flex
                      width='medium'
                      background='light-2'
                      elevation='small'
                      align='center'
                      justify='center'
                    >
                      sidebar
                    </Box>
                  </Collapsible>
                ) : (
                    <Layer>
                      <Box
                        background='light-2'
                        tag='header'
                        justify='end'
                        align='center'
                        direction='row'
                      >

                        <Button
                          label=""
                          primary
                          icon={<FormClose />}
                          onClick={() => this.setState({ showSidebar: false })}
                        />


                      </Box>
                      <Box
                        fill
                        background='light-2'
                        align='center'
                        justify='center'
                      >
                        sidebar
                         </Box>
                    </Layer>
                  )}

              </Box>
            </Box>
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

  login = () => {
    return <Login getaccount={this.getaccount} />;
  };
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Topics({ match }) {
  return (
    <div>
      <h2>Topics</h2>
      <ul>
        <li>
          <Link to={`${match.url}/rendering`}>Rendering with React</Link>
        </li>
        <li>
          <Link to={`${match.url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
        </li>
      </ul>

      <Route path={`${match.path}/:topicId`} component={Topic} />
      <Route
        exact
        path={match.path}
        render={() => <h3>Please select a topic.</h3>}
      />
    </div>
  );
}

function Topic({ match }) {
  return (
    <div>
      <h3>{match.params.topicId}</h3>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
