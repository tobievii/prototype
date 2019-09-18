import React, { Component } from 'react';
import { PluginSuperClientside } from "../../client/src/components/plugins_super_clientside"


export default class Iotnxt extends PluginSuperClientside {
    state = {
        gateways: []
    }

    render() {
        return (
            <div>
                New plugin panel
            </div>
        );
    }

    deviceViewPluginPanel() {
        return (<div>New plungin blah</div>)
    }
};

