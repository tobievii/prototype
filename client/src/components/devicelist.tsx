import React from "react";

import { api } from "../api"
import { CorePacket } from "../../../server/shared/interfaces";
import { theme } from "../theme"
import { DeviceListItem } from "./devicelistitem"
import { DeviceListMenu } from "./devicelistmenu"

import { sortBy, clone, filter } from "../utils/lodash_alt"
import { logger } from "../../../server/shared/log"

interface MyProps {
    username?: string;
}

interface MyState {
    [index: string]: any;
}

export class DeviceList extends React.Component<MyProps, MyState> {
    state = {
        sort: {
            selected: "none",
            id: "none",
            lastseen: "up",
            alarm: "none",
            warning: "none",
            shared: "none",
            public: "none"
        },
        search: undefined,
        filter: "",
        states: [],
        statesraw: [],
    }

    constructor(props) {
        super(props);
    }

    componentDidMount = () => {

        this.getData();
        //dynamic updates:
        api.on("states", this.stateUpdater)
    }

    getData = () => {
        logger.log({ message: "loading devicelist", data: this.props, level: "verbose" })
        if (this.props.username) {
            api.subscribe({ username: this.props.username });

            api.states({ username: this.props.username }, (err, states: CorePacket[]) => {
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
        var tempstates = clone(states);
        if (this.props.username) {
            tempstates = filter(tempstates, (dev) => {
                if (dev.username == undefined) return false;
                return (dev.username == this.props.username)
            })
        }

        // apply sorts
        if (this.state.sort) {
            if (this.state.sort.selected == "up") {
                tempstates = sortBy(tempstates, (d) => {
                    if (d.selected == undefined) { return false } else { return d.selected }
                }).reverse()
            }

            if (this.state.sort.selected == "down") {
                tempstates = sortBy(tempstates, (d) => {
                    if (d.selected == undefined) { return false } else { return d.selected }
                })
            }

            if (this.state.sort.id == "up") {
                tempstates = sortBy(tempstates, (a, b) => { return a > b })
            }

            if (this.state.sort.id == "down") {
                tempstates = sortBy(tempstates, (a, b) => { return a > b }).reverse()
            }

            if (this.state.sort.lastseen == "up") {
                tempstates = sortBy(tempstates, (a, b) => {
                    return new Date(b["_last_seen"]).getTime() - new Date(a["_last_seen"]).getTime();
                })
            }

            if (this.state.sort.lastseen == "down") {
                tempstates = sortBy(tempstates, (a, b) => {
                    return new Date(b["_last_seen"]).getTime() - new Date(a["_last_seen"]).getTime();
                }).reverse()
            }

            if (this.state.sort.alarm == "up") {
                tempstates = sortBy(tempstates, (d) => { return (d.alarm) ? 1 : -1 }).reverse()
            }

            if (this.state.sort.alarm == "down") {
                tempstates = sortBy(tempstates, (d) => { return (d.alarm) ? 1 : -1 })
            }

            if (this.state.sort.warning == "up") {
                tempstates = sortBy(tempstates, (d) => { return (d.warning) ? 1 : -1 }).reverse()
            }

            if (this.state.sort.warning == "down") {
                tempstates = sortBy(tempstates, (d) => { return (d.warning) ? 1 : -1 })
            }

            if (this.state.sort.shared == "up") {
                tempstates = sortBy(tempstates, (d) => { return (d.shared) ? 1 : -1 }).reverse()
            }

            if (this.state.sort.shared == "down") {
                tempstates = sortBy(tempstates, (d) => { return (d.shared) ? 1 : -1 })
            }

            if (this.state.sort.public == "up") {
                tempstates = sortBy(tempstates, (d) => { return (d.public) ? 1 : -1 }).reverse()
            }

            if (this.state.sort.public == "down") {
                tempstates = sortBy(tempstates, (d) => { return (d.public) ? 1 : -1 })
            }
        }

        // apply search
        if (this.state.search) {
            if (this.state.search != "") {
                tempstates = filter(tempstates, (dev) => {
                    if (dev.id.toLowerCase().indexOf(this.state.search) >= 0) { return true } else return false;
                })
            }
        }
        // var states: CorePacket[] = filter(clone(api.data.states), (dev: CorePacket) => {
        //     if (dev.id.indexOf("") >= 0) { return true } else return false
        // })
        this.setState({ states: tempstates });
    }

    onMenu = (data) => {

        if (data.sort) {
            this.setState({ sort: data.sort }, () => {
                this.applySortFilter(clone(api.data.states));
            })
        }

        if (data.search != undefined) {
            this.setState({ search: data.search.trim() }, () => {
                this.applySortFilter(clone(api.data.states));
            })
        }
    }

    // handles clicks on devices in the list.. like for selecting/deselecting
    handleAction_deviceListItems = (device) => {
        return (action) => {
            if (action.select != undefined) {
                var states = clone(this.state.states)
                for (var dev in states) {
                    if (states[dev].key == device.key) {
                        states[dev].selected = action.select;
                    }
                }
                this.setState({ states })
            }
        }
    }

    /**
     * Handles actions coming from the menu.
     * @param action Possible values: 
     * { selectall: true|false }
     * { removeselected: true}
     */
    handleAction_deviceListMenu = (action) => {
        if (action.selectall != undefined) {
            console.log("selectall")
            var states = clone(this.state.states)
            for (var device of states) {
                device.selected = action.selectall;
            }
            this.setState({ states })
        }

        if (action.removeselected) {
            console.log("remove selected:")
            var states = clone(this.state.states)
            for (var device of states) {
                if (device.selected) {
                    this.deleteItem(device)
                }
            }
        }
    }

    deleteItem = (device) => {
        console.log("removing id:" + device.id);
        api.delete(device, (err, result) => {
            if (err) { console.log(err); }
            if (result) {
                console.log(result);
                if (result.n == 1) {
                    console.log("success")
                    var states = clone(this.state.states);
                    states = states.filter((dev) => (dev.id != device.id))
                    this.setState({ states })
                }
            }
        })
    }

    render() {
        return (
            <div style={{
                width: "100%",
                height: "100%", overflow: "hidden", display: "flex", flexDirection: "column"
            }} >
                {/* <div style={{ background: theme.global.titlebars.background }}>
                    <button style={theme.global.devicelist.addevice} onClick={() => alert('hello, world')} >+ ADD DEVICE</button>
                </div> */}

                <div style={theme.global.menubars}>
                    <DeviceListMenu onMenu={this.onMenu} action={this.handleAction_deviceListMenu} />
                </div>

                <div style={{ overflowX: "hidden", width: "100%", flex: 1, overflowY: "scroll" }}>
                    {(this.state.states) ? (<div>

                        {this.state.states.map(
                            (value: CorePacket, index, array) => {
                                return (
                                    <DeviceListItem device={value} key={index} action={this.handleAction_deviceListItems(value)} />
                                )
                            }
                        )}

                    </div>) : (<div>loading</div>)}
                </div>
            </div>
        )
    }
}