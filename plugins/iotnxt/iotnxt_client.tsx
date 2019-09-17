import React, { Component } from 'react';
import { PluginSuperClientside } from "../plugins_super_clientside"
import { AddGatewayPanel } from "./components/addGateway"
import { GatewayList } from "./components/gatewayList"
import { request } from "../../client/src/utils/requestweb"

export default class Iotnxt extends PluginSuperClientside {
    state = {
        gateways: []
    }

    loadServerGateways() {
        request.get('/api/v3/iotnxt/gateways', {}, (err, gateways) => {
            if (err) console.log(err);
            if (gateways) this.setState({ gateways: gateways });
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

