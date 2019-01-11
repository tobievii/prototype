import React, { Component } from "react";

import "../prototype.scss"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


export default class Stats extends React.Component {
  state = { stats: {} }

  userNameList = () => {
    try {
      return (<div>
        {
          //this.state.stats.users24hList.map( (user, i) =>  <span key={i} title={ user.email }>{ user.email.split("@")[0] } </span> )
          this.state.stats.users24hList.map( (user, i) => { 
            return <Link key={i} to={ "/u/"+user.username }>{ user.username } </Link> 
          } )
        }
      </div>)
    } catch (err) {}
  }


  componentDidMount = () => {
    fetch("/api/v3/stats", {
      method: "GET", headers: { "Accept": "application/json", "Content-Type": "application/json" }
    }).then(response => response.json()).then(stats => {      
      this.setState({stats})
    }).catch(err => console.error(err.toString()));
  }

  render() {
    return (
      <div className="panel">
        In the last 24 hours {this.state.stats.users24h} active users, {this.state.stats.states24h} devices and {this.state.stats.packets24h} packets of data.
        {/* ( {this.state.stats.users1w} this week,  {this.state.stats.users1m} this month ) */}
        {/* { JSON.stringify(this.state.stats.users24hList)} */}
        { this.userNameList() }
      </div>
    )
  }
}