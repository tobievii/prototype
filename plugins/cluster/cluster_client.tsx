import React, { Component } from 'react';
import { PluginSuperClientside } from "../../client/src/components/plugins_super_clientside"
import { request } from "../../client/src/utils/requestweb"



/** TEMPLATE PLUGIN 
 * 
 * Remember to rename MyPlugin for your own plugin */
export default class Cluster extends PluginSuperClientside {

    /** sets this plugin to be only accessible by admins */
    admin = true;

    state = { info: {} }

    //UNSAFE_componentWillMount
    //UNSAFE_componentWillReceiveProps
    //UNSAFE_componentWillUpdate

    /** new React 17.0 see https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html    
    static getDerivedStateFromProps(props,state) { return null; }
    getSnapshotBeforeUpdate(prevProps, prevState) {}
    */

    componentDidMount() {
        request.get("/api/v4/cluster/info", {}, (err, res, info) => {
            this.setState({ info })
        })
    }

    /** uncomment to override alternative views for settings/deviceview 
    render() {}
    */

    /** this will render on the /settings view */
    settings() {
        return (
            <div>
                <pre>{JSON.stringify(this.state.info)}</pre>
            </div>
        );
    }

    /** this will render in the deviceview popup */
    deviceview() {
        return (<div>This is Cluster deviceview popup
            <h4>Device STATE:</h4>
            <pre style={{ maxHeight: 250, overflow: "scroll" }}>
                {JSON.stringify(this.props.state, null, 2)}
            </pre>
        </div>)
    }
};

