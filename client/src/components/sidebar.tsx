import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, NavLink } from 'react-router-dom'
import { Grommet, Box, Button, Heading, Collapsible, ResponsiveContext, Layer } from 'grommet';
import { Notification, FormClose } from 'grommet-icons';

import "../prototype.scss"

import { api } from "../api"
import { theme, colors } from "../theme";
import { position } from "polished";

interface SideBarProps {
    open: boolean;
    toggle: Function;
}

interface SideBarState {
    [index: string]: any;
}

export class SideBar extends React.Component<SideBarProps, SideBarState> {
    state = {}

    contents() {
        return (<div style={{ height: "100%", boxSizing: "border-box", overflow: "hidden" }}>
            <div style={{ background: colors.spotA }}><button onClick={() => { this.props.toggle(); }}>X</button></div>
            <div style={{ background: colors.panels }}>sidebarB</div>
        </div>)
    }

    render() {


        var size = "large";
        if (window.innerWidth < 800) { size = "small" }

        if (this.props.open == false) {
            return (<div></div>)
        }

        if (size == "small") {
            return (
                <div style={{
                    width: "100%",
                    height: "100%",
                    background: colors.spotB,
                    zIndex: 1000,
                    position: "absolute",
                    top: 0,
                    right: 0
                }}>
                    {this.contents()}
                </div>);
        } else {
            return (
                <div style={{
                    float: "right",
                    width: "500px",
                    background: colors.panels,
                    position: "absolute",
                    top: 0,
                    right: 0,
                    height: "100%"
                }}>
                    {this.contents()}
                </div>
            )
        }

    }
}


