import React, { Component } from 'react';
import { PluginSuperClientside } from "../../client/src/components/plugins_super_clientside"
import { request } from "../../client/src/utils/requestweb"
import { CodeBlock } from "../../client/src/components/codeblock"
import { colors } from '../../client/src/theme';
/** TEMPLATE PLUGIN 
 * 
 * Remember to rename MyPlugin for your own plugin */

interface TeltonikaState {
    port: number | undefined
}

export default class Teltonika extends PluginSuperClientside {
    state = {
        port: undefined
    }

    //UNSAFE_componentWillMount
    //UNSAFE_componentWillReceiveProps
    //UNSAFE_componentWillUpdate

    /** new React 17.0 see https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html    
    static getDerivedStateFromProps(props,state) { return null; }
    getSnapshotBeforeUpdate(prevProps, prevState) {}
    */

    /** uncomment to override alternative views for settings/deviceview 
    render() {}
    */

    componentDidMount = () => {
        this.updateFromServer();
    }

    updateFromServer() {
        request.get("/api/v3/teltonika/info", {}, (err, res, response: any) => {
            if (err) { console.log(err); return; }
            console.log(response);
            if (response.port) {
                this.setState({ port: response.port })
            }
        })
    }

    enablePrivatePort = () => {
        request.get("/api/v3/teltonika/reqport", { json: true }, (err, res, result) => {
            console.log(result);
        })
    }

    /** this will render on the /settings view */
    settings() {

        var boxstyles = { background: "rgba(0,0,0,0.2)", padding: 10 }
        var codestyles = { background: "rgba(0,0,0,0.2)", padding: 10, color: "rgb(25,255,60)" }

        return (
            <div>

                <div style={{ marginBottom: 20, background: colors.bgDarker, padding: colors.padding * 2 }}>
                    <h4>PUBLIC PORT (new.. under development)</h4>
                    DEFAULT PORT: 12000
                    <p>If you set Teltonika device to connect to this port devices will be visible to
                        administrators only. Any user can then use the ADD device wizard and type in IMEI
                        to add device to their account.</p>
                </div>

                <div style={{ marginBottom: 20, background: colors.bgDarker, padding: colors.padding * 2 }}>
                    <h4>PRIVATE PORT</h4>
                    <p>A private port for Teltonika devices will bind a server port to your account so all
                        teltonika devices pointed to this port will automatically be added to your account.</p>

                    <div>
                        {(this.state.port) ? <div className="commanderBgPanel"
                        > <i className="fas fa-check-circle" style={{ color: "#11cc88" }}></i> PORT IS ACTIVE: {this.state.port} </div>
                            : <button onClick={() => { }}
                                style={{ marginLeft: colors.padding, whiteSpace: "nowrap" }}>
                                <i className="fas fa-play-circle" style={{ color: colors.good }} /> ENABLE</button>}
                    </div>

                </div>

            </div >
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

