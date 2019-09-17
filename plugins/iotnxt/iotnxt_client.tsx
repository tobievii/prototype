import React, { Component } from 'react';
import { PluginSuperClientside } from "../plugins_super_clientside"
import { AddGatewayPanel } from "./components/addGateway"
import { GatewayList } from "./components/gatewayList"
import { request } from "../../client/src/utils/requestweb"

export default class Iotnxt extends PluginSuperClientside {
    state = {
        gateways: []
    }

    constructor(props) {
        super(props);

        // load gateways on constructor.
        this.loadServerGateways();
        console.log("IOTNXT ==================")
    }

    //UNSAFE_componentWillMount
    //UNSAFE_componentWillReceiveProps
    //UNSAFE_componentWillUpdate

    /** new React 17.0 see https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html
    
    static getDerivedStateFromProps(props,state) {
        return null;
    }

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

    render() {
        return (
            <div>
                <AddGatewayPanel update={this.update} />
                <GatewayList gateways={this.state.gateways} update={this.update} />
            </div>
        );
    }
};

