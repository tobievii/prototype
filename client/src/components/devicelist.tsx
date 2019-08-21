import React from "react";
import ReactDOM from "react-dom";
import { api } from "../api"

import { Menu, Button, Box } from "grommet"
import { User, CorePacket, } from "../../../server/core/interfaces";
import { blendrgba } from "../../../server/utils/utils"

import { prototypeTheme, theme } from "../theme"

import { SortButton } from "./sortbutton"

import { DeviceListItem } from "./devicelistitem"
import { DeviceListMenu } from "./devicelistmenu"
interface MyProps {
    account: User;
    states: [];
}

interface MyState {
    [index: string]: any;
}

export class DeviceList extends React.Component<MyProps, MyState> {

    state = { sort: "name_up" }

    constructor(props) {
        super(props);
    }

    render() {
        const states = this.props.states;

        return (
            <div style={{
                width: "100%",
                height: "100%", overflow: "hidden", display: "flex", flexDirection: "column"
            }} >
                <div style={{ background: theme.global.titlebars.background }}>
                    <button style={theme.global.devicelist.addevice} onClick={() => alert('hello, world')} >+ ADD DEVICE</button>
                </div>

                <div style={theme.global.menubars}>
                    <DeviceListMenu />
                </div>

                <div style={{ overflowX: "hidden", width: "100%", flex: 1, overflowY: "scroll" }}>
                    {(this.props.states) ? (<div>

                        {this.props.states.map(
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