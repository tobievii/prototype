import React, { Component } from "react";

import "../prototype.scss"





export default class Stats extends React.Component {
  state = { stats: {} }

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
      </div>
    )
  }
}