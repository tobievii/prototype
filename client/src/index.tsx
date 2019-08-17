import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, NavLink, Nav } from 'react-router-dom'

import "./prototype.scss"

import { NavBar } from "./components/navbar"

import { Home } from "./pages/home"

import "./api"
import { api } from "./api";


export default class App extends React.Component {

  state = {
    count: 0,
    mobileMenuActive: false,
    account: {}
  };

  constructor(props) {
    super(props);

    api.account((err, account) => {
      if (err) { console.log(err); }
      if (account) { this.setState({ account }) }
    })

    api.on("account", (account) => {
      this.setState({ account });
    })
  }


  componentDidMount() { }

  increment = () => {
    this.setState({
      count: (this.state.count + 1)
    });
  };

  decrement = () => {
    this.setState({
      count: (this.state.count - 1)
    });
  };

  mobileMenuPress = () => {
    this.setState({ mobileMenuActive: !this.state.mobileMenuActive })
  }

  render() {
    return (
      <div>

        <header className="site-banner banner banner--shape banner--homepage">
          <div className="banner__background" >
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1903 556">
              <path className="svg-banner-shape" d="M753.1,434.2c110.6,63.7,277.7,70.6,373.4,15.4L1905,0v555.9H0V0.2L753.1,434.2z"></path>
            </svg>
          </div>
        </header>

        <BrowserRouter>
          <div>
            <NavBar ></NavBar>
            <Route exact path="/" component={this.home} />
            <Route path="/about" component={About} />
            <Route path="/topics" component={Topics} />
          </div>
        </BrowserRouter>

        <div id="debug">
          <div>{JSON.stringify(this.state.account)}</div>
        </div>
      </div>
    );
  }

  home() {
    return (
      <Home />
    )
  }
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

ReactDOM.render(<App />, document.getElementById("root"));
