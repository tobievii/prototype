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
    [index: string]: any;
}

interface MenuState {
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
        }
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
            console.log("sort " + prop + " by " + direction)
            this.setState({ sort })
        }
    }

    render() {
        return (
            <div>
                <div style={theme.global.menubars}>
                    <i className="fas fa-check-double"></i> SELECT ALL

                    <Menu
                        label="Modify"
                        items={[
                            { label: 'Dashboard Preset', onClick: () => { } },
                            { label: 'Script Preset', onClick: () => { } },
                            { label: 'Share', onClick: () => { } },
                            { label: 'Delete', onClick: () => { } }
                        ]}
                    />

                    <button><i className="fas fa-trash"></i> REMOVE</button>
                </div>
                <div style={{ boxSizing: "border-box", background: theme.global.menubars.background, width: "100%", borderRight: "11px solid " + theme.global.menubars.background }} >
                    <div style={{ display: "flex", width: "100%" }}>

                        <div style={theme.global.devicelist.columns}>
                            <SortButton onChangeSort={this.changeSort("selected")} value={this.state.sort.selected} />
                        </div>

                        <div style={{ flex: 1 }}>
                            <div style={{ float: "left", paddingLeft: 10, width: theme.global.devicelist.columns.width }}><SortButton onChangeSort={this.changeSort("id")} value={this.state.sort.id} type="verticalalpha" /></div>

                            <div style={{ float: "left", paddingLeft: 50 }}>
                                <i className="fas fa-search" style={{ opacity: 0.25, padding: theme.paddings.default }} ></i>
                                <input placeholder="search" />
                            </div>



                        </div>

                        <div style={theme.global.devicelist.timecolumn}><SortButton onChangeSort={this.changeSort("lastseen")} value={this.state.sort.lastseen} /></div>
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

/*
  <div style={theme.global.menuoptions}>

                        <div style={{ width: 100 }}>
                            <i className="fas fa-sort" style={{ opacity: 0.5, position: "absolute" }}></i>
                            {this.state.sort == "select_up" && <i className="fas fa-sort-up" style={{ position: "absolute" }}></i>}
                            {this.state.sort == "select_down" && <i className="fas fa-sort-down" style={{ position: "absolute" }}></i>}
                        </div>

                    </div>

                    <div style={theme.global.menuoptions}>
                        <div style={{ width: 100 }}>
                            <i className="fas fa-sort" style={{ opacity: 0.5, position: "absolute" }}></i>
                            {this.state.sort == "name_up" && (<span><i className="fas fa-sort-up" style={{ position: "absolute" }}></i>A-Z</span>)}
                            {this.state.sort == "name_down" && (<span><i className="fas fa-sort-down" style={{ position: "absolute" }}></i> Z-A</span>)}
                        </div>
                    </div>

                    <div style={theme.global.menuoptions}> test </div>
                    */