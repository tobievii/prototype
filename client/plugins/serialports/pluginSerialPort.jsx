import React, { Component } from "react";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHdd, faPlug, faLessThanEqual } from "@fortawesome/free-solid-svg-icons";


export const name = "SerialPorts";

import {
  gridstyle,
  cellstyle,
  gridHeadingStyle,
  blockstyle,
  tableRowHeadingStyle,
  tableRowStyle
} from "../../styles.jsx";

export class SettingsPanel extends React.Component {
  state = {
    serialports: []
  };

  updateInterval = {};

  getaccount = () => {
    fetch("/api/v3/account", { method: "GET" }).then(res => res.json()).then(user => {
      if (user) { this.setState({ user: user }); }
    }).catch(err => console.error(err.toString()))
  }

  componentDidMount() {
    this.getaccount();
    this.getSerialports();

    this.updateInterval = setInterval(() => {
      this.getSerialports();
    }, 2500);
  }

  onMouseOver = serialport => {
    return event => { };
  };

  getSerialports = () => {
    fetch("/api/v3/serialports", { method: "GET" })
      .then(resp => resp.json())
      .then(data => {
        this.setState({ serialports: data });
      });
  };

  setserialportaccount = (serialport) => {
    return event => {
      console.log(serialport)

      fetch("/api/v3/serialports/setserialportaccount", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(serialport)
      })
        .then(response => response.json())
        .then(data => {
          //console.log(data);
          //this.getaccount(); 

          if (this.props.update) { this.props.update(); }

        }).catch(err => console.error(err.toString()));
    }
  }

  componentWillUnmount = () => {
    clearInterval(this.updateInterval);
  };

  render() {
    return (
      <div style={blockstyle}>
        <div className="row" style={tableRowHeadingStyle}>
          <div className="col-11" style={{ textAlign: "left" }}>
            ID
          </div>

          <div className="col-1" style={{ textAlign: "right"}}>
            CONFIG
          </div>
        </div>

        {this.state.serialports.map((serialport, i) => {
          var deviceToSendToThisAccount = false;
          if (this.state.user) {
            if (this.state.user.apikey == serialport.apikey) {
              deviceToSendToThisAccount = true;
            }
          }

          return (
            <div
              key={i}
              className="row tableRowHover"
              style={tableRowStyle}
              onMouseOver={this.onMouseOver(serialport)}
            >
              <div className="col-11" style={{ padding: 10 }}>
                <div
                  title={ serialport.connected ? "Connected" : serialport.error }
                  style={{
                    float: "left",
                    paddingRight: 10,
                    paddingTop: 1,
                    opacity: 0.9,
                    cursor: serialport.default ? "" : "pointer",
                    color: "rgb(0, 222, 125)"
                  }}><FontAwesomeIcon icon={"check-circle"} />
                </div>
                {serialport.pnpId}<br />
                {serialport.comName}
              </div>


              <div className="col-1" style={cellstyle}>

                <div onClick={this.setserialportaccount(serialport)}
                  title="link to this account"
                  style={{
                    float: "right",
                    opacity: deviceToSendToThisAccount ? 1.0 : 0.25,
                    cursor: "pointer"
                  }}
                >
                  <FontAwesomeIcon icon="user" />
                </div>

              </div>



            </div>
          );
        })}
      </div>
    );
  }


}
