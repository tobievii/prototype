import React, { Component } from 'react';

export class WidgetButton extends React.Component {

  state = {
    command: "asdf"
  }

  onClick = () => {
    //console.log(this.props)
    fetch("/api/v3/data/post", {
      method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ id: this.props.state.devid, data: { click: true } })
    }).then(response => response.json()).then(resp => {
      console.log(resp);
    }).catch(err => console.error(err.toString()));
  }

  render() {
    return (
      <button style={{ width: "100%", height: "100%" }} onClick={this.onClick}>SEND</button>
    );
  }
};

