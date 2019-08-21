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

interface MyProps {
    username?: string;
}

interface MyState {
    [index: string]: any;
}

export class DeviceList extends React.Component<MyProps, MyState> {

    state = {
        sort: undefined,
        filter: "",
        states: [],
        statesraw: [],
    }



    constructor(props) {
        super(props);
    }

    // listener callback
    stateUpdater = (states: CorePacket[]) => {
        this.applySortFilter(states);
    }

    componentDidMount = () => {
        console.log("did mount")

        // initial load
        if (this.props.username) {
            api.states({ username: this.props.username }, (err, states: CorePacket[]) => {
                if (err) console.log("devicelist 40 " + err);
                if (states) {
                    if (states.length > 0) api.subscribe({ publickey: states[0].publickey });
                    this.applySortFilter(states);
                }
            })
        } else {
            // own account
            api.states((err, states: CorePacket[]) => {
                if (states) {
                    this.applySortFilter(states);
                }
            })
        }

        //dynamic updates:
        api.on("states", this.stateUpdater)
    }

    componentWillUnmount = () => {
        api.removeListener("states", this.stateUpdater);
    }

    applySortFilter(states: CorePacket[]) {
        // todo finish
        // this applies the sorts and the search filter to states
        // get clean copy

        var tempstates = _.clone(states);
        if (this.props.username) {
            tempstates = _.filter(tempstates, (dev) => {
                if (dev.username == undefined) return false;
                return (dev.username == this.props.username)
            })
        }

        // var states: CorePacket[] = _.filter(_.clone(api.data.states), (dev: CorePacket) => {
        //     if (dev.id.indexOf("") >= 0) { return true } else return false
        // })
        this.setState({ states: tempstates });
    }

    onMenu = (data) => {
        console.log(data);
        if (data.sort) {
            this.applySortFilter(data.sort)
        }
    }

    render() {
        return (
            <div style={{
                width: "100%",
                height: "100%", overflow: "hidden", display: "flex", flexDirection: "column"
            }} >
                <div style={{ background: theme.global.titlebars.background }}>
                    <button style={theme.global.devicelist.addevice} onClick={() => alert('hello, world')} >+ ADD DEVICE</button>
                </div>

                <div style={theme.global.menubars}>
                    <DeviceListMenu onMenu={this.onMenu} />
                </div>

                <div style={{ overflowX: "hidden", width: "100%", flex: 1, overflowY: "scroll" }}>
                    {(this.state.states) ? (<div>

                        {this.state.states.map(
                            (value: CorePacket, index, array) => {
                                return (
                                    <DeviceListItem device={value} key={index} />
                                )
                            }
                        )}

                    </div>) : (<div>loading</div>)}
                </div>
            </div>
        )
    }
}