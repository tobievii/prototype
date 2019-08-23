import React from "react";
import ReactDOM from "react-dom";
import { api } from "../api"
import { Menu, Button, Box } from "grommet"
import { User, CorePacket } from "../../../server/core/interfaces";
import { blendrgba } from "../../../server/utils/utils"
import { prototypeTheme, theme } from "../theme"
import { SortButton } from "./sortbutton"
import { DeviceListItem } from "./devicelistitem"
import { DeviceListMenu, MenuSort } from "./devicelistmenu"
import * as _ from "lodash"
import { JSONviewer } from "./jsonviewer";
import { logger } from "../../../server/core/log";

interface MyProps {
    username: string;
    id: string;
}

interface MyState {
    [index: string]: any;
}

export class DeviceView extends React.Component<MyProps, MyState> {
    state = {
        state: undefined
    }

    componentDidMount = () => {
        if ((this.props.username) && (this.props.id)) {
            logger.log({ message: "loading deviceview", data: this.props, level: "verbose" })

            //api.subscribe({ username: this.props.username });

            api.state({ username: this.props.username, id: this.props.id }, (err, state) => {
                if (err) console.log(err)
                if (state) {
                    //console.log(state);
                    this.setState({ state })
                }
            });
        }

        api.on("states", this.stateUpdater);
    }

    componentWillUnmount = () => {
        api.removeListener("states", this.stateUpdater);
    }

    stateUpdater = (states: CorePacket[]) => {
        // if this device updated let's update state
        console.log(states);
        for (var s in states) {
            if (states[s].key == this.state.state.key) {
                if (states[s]["_last_seen"] != this.state.state["_last_seen"]) {
                    // must be new?
                    this.setState({ state: states[s] })
                }
            }
        }
    }

    render() {

        if (this.state.state == undefined) {
            return (<div>...</div>)
        }


        if (this.state.state) {
            return (
                <div style={{
                    width: "100%", height: "100%",
                    overflow: "hidden", display: "flex", flexDirection: "column"
                }} >
                    DEVICEVIEW
                    {this.props.username} - {this.props.id}

                    <JSONviewer object={this.state.state} />

                </div>
            )
        }


    }
}