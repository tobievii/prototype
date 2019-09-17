import React, { Component, Suspense } from "react";

import { colors } from "../theme"

import { Menu } from "../components/menu"
import { Account } from "./settings/account";

import * as plugins from '../../../plugins/plugins_list_ui'
import { MenuVertical } from "../components/menu_vertical"

interface MyProps {
    page?: string
}

interface MyState {
    //[index: string]: any
}
export class Settings extends React.Component<MyProps, MyState> {
    state = {};

    showpage(page) {



        if ((page == "account") || (page == undefined)) {
            return <Account />
        }

        var PluginToRender = plugins[page]

        return <PluginToRender />
        // if (page == "iotnxt") {
        //     return <div>Iotnxt settings</div>
        // }

        // if (page == "admin") {
        //     return <div>Admin</div>
        // }

        // if (page == "http") {
        //     return <div>HTTP</div>
        // }

        // if (page == "tcp") {
        //     return <div>TCP</div>
        // }

        // if (page == "teltonika") {
        //     return <div>Teltonika</div>
        // }

        // if (page == "hf2111a") {
        //     return <div>HF2111a</div>
        // }
    }

    render() {

        /** build the plugins menuitems list */
        var pluginsMenuItems = []
        for (var p of Object.keys(plugins).sort()) {
            pluginsMenuItems.push({ text: p, link: "/settings/" + p, icon: "plug" })
        }

        var settingsMenuItems = []
        settingsMenuItems.push({ text: "account", link: "/settings/account", icon: "user-circle" })

        return (
            <div className="apiInfo" style={{ padding: colors.padding * 2, display: "flex", flexDirection: "row" }} >

                <div style={{ background: "rgba(0,0,0,0.1)", width: 300, margin: colors.padding, padding: colors.padding * 2, }}>
                    <div>
                        <h3>SETTINGS</h3>
                        <MenuVertical active={this.props.page} menuitems={settingsMenuItems} />
                    </div>

                    <div><h3>PLUGINS</h3>
                        <MenuVertical active={this.props.page} menuitems={pluginsMenuItems} />
                    </div>
                </div>

                <div style={{ background: "rgba(0,0,0,0.1)", flex: "1", margin: colors.padding, padding: colors.padding * 2, }}>
                    <h2 style={{ textTransform: "uppercase" }}>{this.props.page}</h2>
                    {this.showpage(this.props.page)}
                </div>
            </div >
        );
    }
}

