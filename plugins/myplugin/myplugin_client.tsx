import React, { Component } from 'react';
import { PluginSuperClientside } from "../../client/src/components/plugins_super_clientside"


/** TEMPLATE PLUGIN 
 * 
 * Remember to rename MyPlugin for your own plugin */
export default class MyPlugin extends PluginSuperClientside {
    state = {
        gateways: []
    }

    /** uncomment to override alternative views for settings/deviceview 
    render() {}
    */

    /** this will render on the /settings view */
    settings() {
        return (
            <div>This is MyPlugin settings view</div>
        );
    }

    /** this will render in the deviceview popup */
    deviceview() {
        return (<div>This is MyPlugin deviceview popup
            <h4>Device STATE:</h4>
            <pre style={{ maxHeight: 250, overflow: "scroll" }}>
                {JSON.stringify(this.props.state, null, 2)}
            </pre>
        </div>)
    }
};

