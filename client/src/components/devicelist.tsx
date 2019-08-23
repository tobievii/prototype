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

import { logger } from "../../../server/core/log"

interface MyProps {
    username?: string;
}

interface MyState {
    [index: string]: any;
}

export class DeviceList extends React.Component<MyProps, MyState> {
    state = {
        sort: undefined,
        search: undefined,
        filter: "",
        states: [],
        statesraw: [],
    }

    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        logger.log({ message: "loading devicelist", data: this.props, level: "verbose" })
        if (this.props.username) {
            api.subscribe({ username: this.props.username });

            api.states({ username: this.props.username }, (err, states: CorePacket[]) => {
                console.log("=========")
                console.log(states)
                if (err) console.error(err);
                if (states) {
                    logger.log({ message: "states return", data: { states }, level: "verbose" })
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

    // listener callback
    stateUpdater = (states: CorePacket[]) => {
        this.applySortFilter(states);
    }

    applySortFilter = (states: CorePacket[]) => {
        // transfer select state
        for (var dev of this.state.states) {
            for (var dev2 of states) {
                if (dev2.key == dev.key) {
                    if (dev.selected) { dev2.selected = dev.selected }
                }
            }
        }

        // show current username devices
        var tempstates = _.clone(states);
        if (this.props.username) {
            tempstates = _.filter(tempstates, (dev) => {
                if (dev.username == undefined) return false;
                return (dev.username == this.props.username)
            })
        }

        // apply sorts
        if (this.state.sort) {
            if (this.state.sort.selected == "up") {
                tempstates = _.sortBy(tempstates, (d) => {
                    if (d.selected == undefined) { return false } else { return d.selected }
                }).reverse()
            }

            if (this.state.sort.selected == "down") {
                tempstates = _.sortBy(tempstates, (d) => {
                    if (d.selected == undefined) { return false } else { return d.selected }
                })
            }

            if (this.state.sort.id == "up") {
                tempstates = _.sortBy(tempstates, (d) => { return d.id })
            }

            if (this.state.sort.id == "down") {
                tempstates = _.sortBy(tempstates, (d) => { return d.id }).reverse()
            }

            if (this.state.sort.lastseen == "up") {
                tempstates = _.sortBy(tempstates, (d) => { return d["_last_seen"] }).reverse()
            }

            if (this.state.sort.lastseen == "down") {
                tempstates = _.sortBy(tempstates, (d) => { return d["_last_seen"] })
            }

            if (this.state.sort.alarm == "up") {
                tempstates = _.sortBy(tempstates, (d) => { return d.alarm })
            }

            if (this.state.sort.alarm == "down") {
                tempstates = _.sortBy(tempstates, (d) => { return d.alarm }).reverse()
            }

            if (this.state.sort.warning == "up") {
                tempstates = _.sortBy(tempstates, (d) => { return d.warning })
            }

            if (this.state.sort.warning == "down") {
                tempstates = _.sortBy(tempstates, (d) => { return d.warning }).reverse()
            }

            if (this.state.sort.shared == "up") {
                tempstates = _.sortBy(tempstates, (d) => { return d.shared })
            }

            if (this.state.sort.shared == "down") {
                tempstates = _.sortBy(tempstates, (d) => { return d.shared }).reverse()
            }

            if (this.state.sort.public == "up") {
                tempstates = _.sortBy(tempstates, (d) => { return d.public })
            }

            if (this.state.sort.public == "down") {
                tempstates = _.sortBy(tempstates, (d) => { return d.public }).reverse()
            }
        }

        // apply search
        if (this.state.search) {
            if (this.state.search != "") {
                tempstates = _.filter(tempstates, (dev) => {
                    if (dev.id.toLowerCase().indexOf(this.state.search) >= 0) { return true } else return false;
                })
            }
        }
        // var states: CorePacket[] = _.filter(_.clone(api.data.states), (dev: CorePacket) => {
        //     if (dev.id.indexOf("") >= 0) { return true } else return false
        // })
        this.setState({ states: tempstates });
    }

    onMenu = (data) => {

        if (data.sort) {
            this.setState({ sort: data.sort }, () => {
                this.applySortFilter(_.clone(api.data.states));
            })
        }

        if (data.search != undefined) {
            this.setState({ search: data.search.trim() }, () => {
                this.applySortFilter(_.clone(api.data.states));
            })
        }
    }

    // handles clicks on devices in the list.. like for selecting/deselecting
    handleAction = (device) => {
        return (action) => {
            if (action.select != undefined) {
                var states = _.clone(this.state.states)
                for (var dev in states) {
                    if (states[dev].key == device.key) {
                        states[dev].selected = action.select;
                    }
                }
                this.setState({ states })
            }
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
                                    <DeviceListItem device={value} key={index} action={this.handleAction(value)} />
                                )
                            }
                        )}

                    </div>) : (<div>loading</div>)}
                </div>
            </div>
        )
    }
}