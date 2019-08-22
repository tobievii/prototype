import React from "react";
import ReactDOM from "react-dom";
import { api } from "../api"

import { Menu, Button, Box } from "grommet"
import { User, CorePacket, } from "../../../server/core/interfaces";
import { blendrgba } from "../../../server/utils/utils"

import { prototypeTheme, theme } from "../theme"

import { SortButton } from "./sortbutton"

import * as _ from "lodash"

interface MenuProps {
    onMenu: Function;
}

interface MenuState { }

export type SortVal = 'none' | 'up' | 'down';

export interface MenuSort {
    selected: SortVal
    id: SortVal
    lastseen: SortVal
    alarm: SortVal
    warning: SortVal
    shared: SortVal
    public: SortVal
}

export class DeviceListMenu extends React.Component<MenuProps, MenuState> {

    state = {
        sort: {
            selected: 'none',
            id: 'none',
            lastseen: 'none',
            alarm: 'none',
            warning: 'none',
            shared: 'none',
            public: 'none'
        },
        search: ""
    }

    constructor(props) {
        super(props);
    }

    changeSort = (prop) => {
        return (direction) => {
            var sort = _.clone(this.state.sort);
            //default others
            sort.selected = 'none'
            sort.id = 'none'
            sort.lastseen = 'none'
            sort.alarm = 'none'
            sort.warning = 'none'
            sort.shared = 'none'
            sort.public = 'none'

            //set this one
            sort[prop] = direction;
            this.setState({ sort }, () => { this.props.onMenu({ sort }) })
        }
    }

    onSearchBoxChange = (event) => {
        var search = event.target.value.toLowerCase();
        this.setState({ search }, () => { this.props.onMenu({ search }) })
    }

    render() {
        return (
            <div>
                <div style={theme.global.menubars}>
                    <div>
                        <button style={{ background: "none" }}>
                            <i className="fas fa-check-double"></i> SELECT ALL
                        </button>


                        <Menu
                            label="Modify"
                            items={[
                                { label: 'Dashboard Preset', onClick: () => { } },
                                { label: 'Script Preset', onClick: () => { } },
                                { label: 'Share', onClick: () => { } },
                                { label: 'Delete', onClick: () => { } }
                            ]}
                        />

                        <button style={{ background: "none" }}><i className="fas fa-trash"></i> REMOVE</button>
                    </div>
                </div>

                <div style={{
                    boxSizing: "border-box", background: theme.global.menubars.background, width: "100%", borderRight: "11px solid " + theme.global.menubars.background,
                    paddingBottom: "5px"
                }} >
                    <div style={{ display: "flex", width: "100%" }}>
                        <div style={theme.global.devicelist.columns}>
                            <SortButton onChangeSort={this.changeSort("selected")} value={this.state.sort.selected} />
                        </div>


                        <div style={{ width: theme.global.devicelist.columns.width }}>
                            <div style={{ float: "left", paddingLeft: 10, width: theme.global.devicelist.columns.width }}><SortButton onChangeSort={this.changeSort("id")} value={this.state.sort.id} type="verticalalpha" /></div>
                        </div>

                        <div style={{ width: "80px", textAlign: "right", paddingTop: "7px", paddingRight: "7px" }}>
                            <i className="fas fa-filter" style={{ opacity: 0.5 }} ></i>
                        </div>

                        <div style={{ flex: "5" }}>
                            <input
                                type="text"
                                placeholder="filter"
                                style={{ width: "100%" }}
                                onChange={this.onSearchBoxChange}
                                value={this.state.search}
                            />
                        </div>

                        <div style={theme.global.devicelist.timecolumn}>
                            <div style={{}}><SortButton onChangeSort={this.changeSort("lastseen")} value={this.state.sort.lastseen} /></div>
                        </div>
                        <div style={theme.global.devicelist.columns}><SortButton onChangeSort={this.changeSort("alarm")} value={this.state.sort.alarm} /></div>
                        <div style={theme.global.devicelist.columns}><SortButton onChangeSort={this.changeSort("warning")} value={this.state.sort.warning} /></div>
                        <div style={theme.global.devicelist.columns}><SortButton onChangeSort={this.changeSort("shared")} value={this.state.sort.shared} /></div>
                        <div style={theme.global.devicelist.columns}><SortButton onChangeSort={this.changeSort("public")} value={this.state.sort.public} /></div>
                    </div>
                </div>
            </div >
        )
    }
}
