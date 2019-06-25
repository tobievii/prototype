import React, { Component } from "react";

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHdd } from '@fortawesome/free-solid-svg-icons'

library.add(faHdd)

export const name = "Iot.nxt"

import { AddGatewayPanel } from "./addGateway.jsx"
import { GatewayList } from "./gatewayList.jsx"

import socketio from 'socket.io-client';

export class SettingsPanel extends React.Component {
  state = { gateways: [] }
  socket;

  constructor() {
    super();
    this.socket = socketio({ transports: ['websocket'] });
    fetch("/api/v3/account", { method: "GET" }).then(res => res.json()).then(user => {
      this.setState({ user: user })
    })
    this.socket.on("connect", () => {
      // console.log("iotnxt socket connected")
    })

    this.socket.on("plugin_iotnxt", (event) => {
      // console.log(event);


      /* something happened with a gateway */
      if (event.type == "gatewayUpdate") {
        var gateways = _.clone(this.state.gateways)
        for (var gateway of gateways) {
          if (gateway.unique == event.gateway.unique) {
            gateway = _.merge(gateway, event.gateway)
            //gateway.connected = event.gateway.connected;
            //if (event.gateway.error) { }
            // console.log("updated gateway state")
          }
        }
        this.setState({ gateways });
      }


      this.loadServerGateways();
    })

    this.loadServerGateways();
  }

  loadServerGateways() {
    fetch('/api/v3/iotnxt/gateways').then(response => response.json()).then((data) => {
      var gateways = [];
      for (var g in data) {
        if (data[g]._created_by) {
          if (data[g]._created_by.publickey == this.state.user.publickey || this.state.user.level > 99) {
            gateways.push(data[g])
          }
        } else if (this.state.user.level > 99) {
          gateways.push(data[g]);
        }
      }

      this.setState({ gateways: gateways });
    }).catch(err => console.error(this.props.url, err.toString()))
  }

  update = () => { this.loadServerGateways(); }

  render() {
    return (
      <div>
        <AddGatewayPanel update={this.update} />
        <GatewayList user={this.state.user} gateways={this.state.gateways} update={this.update} />
      </div>
    )
  }
}


