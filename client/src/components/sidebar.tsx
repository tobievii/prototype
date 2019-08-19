import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, NavLink } from 'react-router-dom'
import { Grommet, Box, Button, Heading, Collapsible, ResponsiveContext, Layer } from 'grommet';
import { Notification, FormClose } from 'grommet-icons';

import "../prototype.scss"

import { api } from "../api"
import { theme } from "../theme";
import { position } from "polished";

interface SideBarProps {
    open: boolean;
    size: string;
    toggle: Function;
}

interface SideBarState {
    [index: string]: any;
}

export class SideBar extends React.Component<SideBarProps, SideBarState> {
    state = {}

    contents() {
        return (<div style={{ height: "100%", boxSizing: "border-box", overflow: "hidden" }}>
            <Box
                background='panelbg'
                tag='header'
                justify='end'
                align='center'
                direction='row'
            >
                <Button
                    label=""
                    primary
                    icon={<FormClose />}
                    onClick={() => { this.props.toggle(); }}
                />
            </Box>
            <Box
                fill
                background='panelbg'
                align='center'
                justify='center'
            >
                sidebarB
            </Box>
        </div>)
    }

    render() {
        if (this.props.open == false) {
            return (<div></div>)
        }

        if (this.props.size == "small") {
            return (
                <Layer>
                    {this.contents()}
                </Layer>);
        } else {
            return (
                <div style={{
                    float: "right",
                    width: theme.global.sidebar.width,
                    background: theme.global.sidebar.background,
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


