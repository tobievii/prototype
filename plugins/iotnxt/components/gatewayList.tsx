import React, { Component } from "react";

import { moment } from "../../../client/src/utils/momentalt"
import { PopupConfirm } from "../../../client/src/components/popups/popup_confirm";

import { GatewayType } from "../lib/iotnxtqueue"

//import { cellstyle, gridHeadingStyle, blockstyle } from "../../styles.jsx"

interface GatewayListProps {
  update: Function
  gateways: any
  action: (action: object, cb?: Function) => void
}

interface GatewayListState {
  /** Show the delete popup? */
  showDelete: boolean
  /** The gateway of concern for the delete popup */
  showDeleteGateway: GatewayType
}

export class GatewayList extends React.Component<GatewayListProps, GatewayListState>{
  state = {
    showDelete: false,
    showDeleteGateway: undefined
  };

  getaccount = () => {
    // fetch("/api/v3/account", { method: "GET" }).then(res => res.json()).then(user => {

    //   if (user.plugins_iotnxt_gatewaydefault) {
    //     this.setState({
    //       accountgatewaydefault: user.plugins_iotnxt_gatewaydefault
    //     })
    //   } else {
    //     this.setState({ accountgatewaydefault: undefined });
    //   }

    //   this.setState({ user: user })
    // }).catch(err => console.error(err.toString()))
  }

  componentWillMount = () => {
    this.getaccount()
  }

  componentDidUpdate = () => {

  }

  valueToggle(valuein, options) {
    for (var option of options) {
      if (valuein == option.value) {
        return option.result
      }
    }
  }

  removeGateway = gateway => {
    this.props.action({ delete: { gateway } })
  };


  renderDelete = (gateway) => {

    return <div>todo</div>

    // if (this.state.user) {
    //   return (
    //     <div
    //       className="deleteButton"
    //       onClick={this.removeGateway(gateway)}
    //       title={"Delete"}
    //       style={{
    //         float: "right",
    //         paddingRight: 10,
    //         paddingTop: 1,
    //         opacity: 0.25,
    //         cursor: "pointer"
    //       }}
    //     >
    //       <i className="fas fa-trash-alt"></i>
    //     </div>
    //   )
    // } else {
    //   return (<div />)
    // }

  }



  render() {

    const gridstyle = { borderBottom: "1px solid rgba(255,255,255,0.1)", paddingTop: 4, paddingBottom: 4 }
    var blockstyle: any = {
      border: "1px solid rgba(0,0,0,0.1)",
      background: "rgba(0,0,0,0.2)",
      margin: 0,
      padding: 20
    }

    var gridHeadingStyle: any = {
      borderBottom: "2px solid rgba(255,255,255,0.2)",
      display: "flex",
      flexDirection: "row"
    };

    if (this.props.gateways) {
      if (this.props.gateways.length > 0) {



        return (
          <div style={blockstyle} >

            {(this.state.showDelete) && <PopupConfirm
              message={"Are you sure you want to delete " + this.state.showDeleteGateway.GatewayId + "?"}
              onConfirm={() => {
                this.props.action({ deleteGateway: this.state.showDeleteGateway }, () => { });
                this.setState({ showDelete: false });
              }}
              onClose={() => { this.setState({ showDelete: false }) }}
            />}

            <div className="row" style={gridHeadingStyle}>

              <div style={{ flex: "1" }}>GatewayId</div>
              <div style={{ flex: "1" }}>ENV</div>
              <div style={{ flex: "1" }}>CONNECTED</div>
              <div style={{ flex: "1" }}>CLUSTER</div>
              <div style={{ flex: "1" }}>OPTIONS</div>
            </div>

            {this.props.gateways.map((gateway: GatewayType, i) => {

              // var accountdefault = false;
              // if (this.state.accountgatewaydefault) {
              //   if (this.state.accountgatewaydefault.GatewayId && this.state.accountgatewaydefault.GatewayId) {
              //     if (this.state.accountgatewaydefault.GatewayId == gateway.GatewayId &&
              //       this.state.accountgatewaydefault.HostAddress == gateway.HostAddress) {
              //       accountdefault = true;
              //     }
              //   }
              // }



              return (
                <div key={i} style={{ display: "flex", flexDirection: "row" }} >
                  <div style={{ flex: 1 }}>

                    <div title={this.valueToggle(gateway.connected,
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
                        cursor: "pointer",
                        //color: gateway.connected ? "rgb(0, 222, 125)" : "rgb(255, 57, 67)"
                        color: this.valueToggle(gateway.connected,
                          [{ value: true, result: "rgb(0, 222, 125)" },
                          { value: false, result: "#f4d701" },
                          { value: "error", result: "#ff284a" },
                          { value: "connecting", result: "rgb(255, 255, 255)" }])
                      }}
                    >
                      {this.valueToggle(gateway.connected, [
                        { value: true, result: <i className="fas fa-check-circle"></i> },
                        { value: false, result: <i className="fas fa-times-circle"></i> },
                        { value: "connecting", result: <i className="fas fa-circle-notch fa-spin"></i> },
                        { value: "error", result: <i className="fas fa-exclamation-circle"></i> },
                        { value: undefined, result: <i className="fas fa-question-circle"></i> }])}
                    </div>

                    {gateway.GatewayId}
                  </div>

                  {/* ENV */}
                  <div style={{ flex: 1 }}>
                    {gateway.HostAddress.split(".")[1].toUpperCase()}
                  </div>

                  {/* CONNECTED */}
                  <div style={{ flex: 1 }}>
                    <span title={gateway["_connected_last"]}>{moment(gateway["_connected_last"]).fromNow()}</span>
                  </div>

                  {/* CLUSTER */}
                  <div style={{ flex: 1 }}>
                    {gateway.instance_id}
                  </div>

                  <div style={{ flex: 1 }}>
                    <button onClick={() => { this.props.action({ reconnectGateway: gateway }) }}><i className="fas fa-sync-alt"></i></button>
                    <button onClick={() => { this.setState({ showDelete: true, showDeleteGateway: gateway }) }}><i className="fas fa-trash"></i></button>
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
