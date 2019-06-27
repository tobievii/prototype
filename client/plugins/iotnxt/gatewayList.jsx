import React, { Component } from "react";
import * as utils from "../../utils.react"

import moment from 'moment'




import { cellstyle, gridHeadingStyle, blockstyle } from "../../styles.jsx"

export class GatewayList extends React.Component {
  state = {};

  getaccount = () => {
    fetch("/api/v3/account", { method: "GET" }).then(res => res.json()).then(user => {

      if (user.plugins_iotnxt_gatewaydefault) {
        this.setState({
          accountgatewaydefault: user.plugins_iotnxt_gatewaydefault
        })
      } else {
        this.setState({ accountgatewaydefault: undefined });
      }

      this.setState({ user: user })
    }).catch(err => console.error(err.toString()))
  }

  componentWillMount = () => {
    this.getaccount()
  }

  componentDidUpdate = () => {

  }


  removeGateway = gateway => {
    return event => {
      fetch("/api/v3/iotnxt/removegateway", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(gateway)
      })
        .then(response => response.json())
        .then(data => {
          // console.log(data)
          if (this.props.update) {
            this.props.update();
          }
        })
        .catch(err => console.error(err.toString()));
    };
  };

  setgatewayserverdefault = gateway => {
    return event => {
      fetch("/api/v3/iotnxt/setgatewayserverdefault", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(gateway)
      })
        .then(response => response.json())
        .then(data => {
          // console.log(data);
          this.getaccount();
          if (this.props.update) {
            this.props.update();
          }
        })
        .catch(err => console.error(err.toString()));
    };
  };


  setgatewayaccountdefault = (gateway, clear) => {
    return event => {
      // console.log(clear);

      if (clear) {
        fetch("/api/v3/iotnxt/cleargatewayaccountdefault").then(response => response.json())
          .then(data => {
            // console.log(data);
            this.getaccount();
            if (this.props.update) {
              this.props.update();
            }
          }).catch(err => console.error(err.toString()));


      } else fetch("/api/v3/iotnxt/setgatewayaccountdefault", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(gateway)
      }).then(response => response.json())
        .then(data => {
          this.getaccount();
          if (this.props.update) {
            this.props.update();
          }
        }).catch(err => console.error(err.toString()));
    };
  };

  renderDelete = (gateway) => {
    if (this.state.user) {
      return (
        <div
          className="deleteButton"
          onClick={this.removeGateway(gateway)}
          title={"Delete"}
          style={{
            float: "right",
            paddingRight: 10,
            paddingTop: 1,
            opacity: 0.25,
            cursor: "pointer"
          }}
        >
          <i className="fas fa-trash-alt"></i>
        </div>
      )
    } else {
      return (<div />)
    }

  }



  render() {

    const gridstyle = { borderBottom: "1px solid rgba(255,255,255,0.1)", paddingTop: 4, paddingBottom: 4 }

    if (this.props.gateways) {
      if (this.props.gateways.length > 0) {



        return (
          <div style={blockstyle}>
            <div className="row" style={gridHeadingStyle}>

              <div className="col-4" style={{ paddingLeft: 34 }}>GatewayId</div>
              <div className="col-1" style={{ textAlign: "right" }}>ENV</div>
              <div className="col-2" style={{ textAlign: "left" }}>CONNECTED</div>
              <div className="col-2" style={{ textAlign: "left" }}>CLUSTER</div>


            </div>

            {this.props.gateways.map(gateway => {

              var accountdefault = false;
              if (this.state.accountgatewaydefault) {
                if (this.state.accountgatewaydefault.GatewayId && this.state.accountgatewaydefault.GatewayId) {
                  if (this.state.accountgatewaydefault.GatewayId == gateway.GatewayId &&
                    this.state.accountgatewaydefault.HostAddress == gateway.HostAddress) {
                    accountdefault = true;
                  }
                }
              }



              return (
                <div key={gateway.GatewayId} className="row" style={gridstyle}>
                  <div className="col-4" style={{ paddingTop: 10 }}>

                    <div
                      title={utils.valueToggle(gateway.connected,
                        [{ value: true, result: "connected" },
                        { value: false, result: "not connected" },
                        { value: "error", result: gateway.error },
                        { value: "connecting", result: "connecting..." }])
                      }
                      style={{
                        float: "left",
                        paddingRight: 10,
                        paddingTop: 1,
                        opacity: 1,
                        cursor: gateway.default ? "" : "pointer",
                        //color: gateway.connected ? "rgb(0, 222, 125)" : "rgb(255, 57, 67)"
                        color: utils.valueToggle(gateway.connected,
                          [{ value: true, result: "rgb(0, 222, 125)" },
                          { value: false, result: "#f4d701" },
                          { value: "error", result: "#ff284a" },
                          { value: "connecting", result: "rgb(255, 255, 255)" }])
                      }}
                    >
                      {utils.valueToggle(gateway.connected, [
                        { value: true, result: <i className="fas fa-check-circle"></i> },
                        { value: false, result: <i className="fas fa-times-circle"></i> },
                        { value: "connecting", result: <i className="fas fa-circle-notch fa-spin"></i> },
                        { value: "error", result: <i className="fas fa-exclamation-circle"></i> },
                        { value: undefined, result: <i className="fas fa-question-circle"></i> }])}

                    </div>

                    {gateway.GatewayId}
                  </div>

                  {/* ENV */}
                  <div className="col-1" style={{ textAlign: "right", paddingTop: 11, }} >
                    {gateway.HostAddress.split(".")[1].toUpperCase()}
                  </div>

                  {/* CONNECTED */}
                  <div className="col-2" style={{ textAlign: "left", paddingTop: 11, }} >
                    <span title={gateway["_connected_last"]}>{moment(gateway["_connected_last"]).fromNow()}</span>
                  </div>

                  {/* CLUSTER */}
                  <div className="col-2" style={{ textAlign: "left", paddingTop: 11, }} >
                    {gateway.instance_id}
                  </div>

                  {/* <div className="col-6" style={cellstyle} >
                    <div
                      onClick={this.setgatewayserverdefault(gateway)}
                      title={
                        gateway.default
                          ? "Active default"
                          : "Click to set to default"
                      }
                      style={{
                        float: "left",
                        paddingRight: 10,
                        paddingTop: 1,
                        opacity: gateway.default ? 1.0 : 0.15,
                        cursor: gateway.default ? "" : "pointer"
                      }}
                    >
                      <FontAwesomeIcon icon="server" />
                    </div>

                    <div
                      onClick={this.setgatewayaccountdefault(gateway, accountdefault)}
                      title={
                        accountdefault
                          ? "Click to unset account gateway"
                          : "Click to set to default"
                      }
                      style={{
                        float: "left",
                        paddingRight: 10,
                        paddingTop: 1,
                        opacity: accountdefault ? 1.0 : 0.25,
                        cursor: "pointer"
                      }}
                    >
                      <FontAwesomeIcon icon="user" />
                    </div> 
                  </div>*/}

                  <div className="col-1" style={{ padding: 10, textAlign: "right" }} >
                    {this.renderDelete(gateway)}
                  </div>
                </div>
              );
            }, this)}
          </div>
        );
      } else {
        return (
          <div style={{ textAlign: "center", opacity: 0.25 }}>
            No Gateways set
          </div>
        );
      }
    } else {
      return (
        <div style={{ textAlign: "center", opacity: 0.25 }}>Loading..</div>
      );
    }
  }
}
