import React from "react";
import ReactDOM from "react-dom";
import { api } from "../api"

import { Menu, Button, Box } from "grommet"
import { User, CorePacket, } from "../../../server/core/interfaces";
import { blendrgba } from "../../../server/utils/utils"

import { prototypeTheme } from "../theme"

interface MyProps {
    account: User;
    states: [];
}

interface MyState {
    [index: string]: any;
}

interface DeviceProps {
    device: CorePacket
}


export class Device extends React.Component<DeviceProps, MyState> {

    intervalupdater;

    constructor(props) {
        super(props);
        this.intervalupdater = setInterval(() => {
            this.forceUpdate();
        }, 200)
    }

    componentWillUnmount = () => {
        if (this.intervalupdater) clearInterval(this.intervalupdater);
    }


    /* returns a ratio of how long ago something occurred between 0 and 1. Intended to be used as a time fade. */
    timeratio(timestamp, duration, options?: ({ clamp: boolean })): number {
        var activity = new Date(timestamp);
        var clock = new Date();
        var delta = clock.getTime() - activity.getTime();

        var ratio = (duration - delta) / duration
        if (options) {
            if (options.clamp == true) {
                if (ratio < 0) {
                    ratio = 0;
                }
                if (ratio > 1) {
                    ratio = 1;
                }
            }
        }

        return ratio
    }

    calcStyle = () => {
        var quickfade = this.timeratio(this.props.device["_last_seen"], 5000, { clamp: true });
        var slowfade = this.timeratio(this.props.device["_last_seen"], 1000 * 60 * 60, { clamp: true });



        return {
            marginBottom: 2, padding: prototypeTheme.padding,
            backgroundImage: "linear-gradient(to right, rgba(16, 26, 38, 0.5)," + blendrgba({ r: 3, g: 4, b: 5, a: 0.5 }, { r: 125, g: 255, b: 175, a: 0.75 }, (quickfade / 1.5) - 0.35) + ")",
            borderRight: "5px solid " + blendrgba({ r: 60, g: 19, b: 25, a: 0 }, { r: 125, g: 255, b: 175, a: 1.0 }, slowfade)
        }
    }

    render() {
        return (<div style={this.calcStyle()}>
            {this.props.device.id}</div>
        )
    }


}







export class DeviceList extends React.Component<MyProps, MyState> {

    state = {
        height: window.innerHeight - 300
    }

    constructor(props) {
        super(props);
    }

    render() {
        const states = this.props.states;
        return (
            <div style={{ width: "100%", height: "100%", overflow: "hidden" }} >
                <button onClick={() => alert('hello, world')} >+ ADD DEVICE</button>

                <Menu
                    label="Modify"
                    items={[
                        { label: 'Dashboard Preset', onClick: () => { } },
                        { label: 'Script Preset', onClick: () => { } },
                        { label: 'Share', onClick: () => { } },
                        { label: 'Delete', onClick: () => { } }
                    ]}
                />

                <div style={{ overflowX: "hidden", width: "100%", height: this.state.height, overflowY: "scroll" }}>
                    {(this.props.states) ? (<div>

                        {this.props.states.map(
                            (value: CorePacket, index, array) => {
                                return (
                                    <Device device={value} key={index} />
                                )
                            }
                        )}

                    </div>) : (<div>loading</div>)}
                </div>

                <div style={{ clear: "both" }}></div>


            </div>
        )
    }
}