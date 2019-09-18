import React, { Component } from 'react';
import { PluginSuperClientside } from "../plugins_super_clientside"
import { AddGatewayPanel } from "./components/addGateway"
import { GatewayList } from "./components/gatewayList"
import { request } from "../../client/src/utils/requestweb"
import { GatewayType } from "./lib/iotnxtqueue"

interface ActionTypes {
    addGateway?: GatewayType
    reconnectGateway?: GatewayType,
    deleteGateway?: GatewayType
}

export default class Iotnxt extends PluginSuperClientside {
    state = {
        gateways: []
    }

    constructor(props) {
        super(props);
        this.loadServerGateways();
    }

    //UNSAFE_componentWillMount
    //UNSAFE_componentWillReceiveProps
    //UNSAFE_componentWillUpdate

    /** new React 17.0 see https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html    
    static getDerivedStateFromProps(props,state) { return null; }
    getSnapshotBeforeUpdate(prevProps, prevState) {}
    */

    /** SAFE for new React 17.0 */
    componentDidUpdate() { }

    loadServerGateways() {
        console.log("requesting gateways...")
        request.get('/api/v3/iotnxt/gateways', {}, (err, res, body) => {
            if (err) console.log(err);
            if (body) {
                console.log(body);
                this.setState({ gateways: body });
            }
        })
    }

    update = () => { this.loadServerGateways(); }

    /** This is passed as a prop to the gatewaylist component. When the user clicks buttons we will recieve actions here like delete,reconnect etc */
    actionHandler = (action: ActionTypes, cb?: Function) => {
        console.log("this.actionHandler", action)

        if (action.addGateway) {

            console.log("Adding " + action.addGateway.GatewayId)

            request.post('/api/v3/iotnxt/addgateway', { json: action.addGateway }, (err, res, result) => {
                if (err) { console.log(err); }
                if (result) {
                    console.log(result); this.loadServerGateways();
                    if (cb) cb();
                }
            })
        }

        if (action.deleteGateway) {
            console.log("Deleting " + action.deleteGateway.GatewayId)

            request.post("/api/v3/iotnxt/removegateway", { json: action.deleteGateway }, (err, res, result) => {
                console.log([err, result])
                if (result) { this.loadServerGateways() }
                if (cb) cb();
            })
            // fetch("/api/v3/iotnxt/removegateway", {
            //     method: "POST",
            //     headers: {
            //       Accept: "application/json",
            //       "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify(gateway)
            //   })
            //     .then(response => response.json())
            //     .then(data => {
            //       // console.log(data)
            //       if (this.props.update) {
            //         this.props.update();
            //       }
            //     })
            //     .catch(err => console.error(err.toString()));
        }

        if (action.reconnectGateway) {
            console.log("Reconnecting " + action.reconnectGateway.GatewayId)
        }

    }

    render() {
        return (
            <div>
                <AddGatewayPanel action={(action) => { this.actionHandler(action); }} update={this.update} />
                <GatewayList gateways={this.state.gateways} update={this.update} action={(action) => { this.actionHandler(action); }} />
            </div>
        );
    }

    deviceViewPluginPanel() {
        return (<div>Iotnxt deviceview plugin panel</div>)
    }
};

