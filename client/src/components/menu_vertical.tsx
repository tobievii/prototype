import React from "react";
import { BrowserRouter, Route, Link, NavLink } from "react-router-dom";
import { theme, colors } from "../theme"
import { clone } from "../utils/lodash_alt"
import { Dropdown } from "./dropdown"
import { TextAlignProperty, StandardLonghandProperties } from "csstype";
import { button } from "./dashboard/widgets";

export interface MenuItems {
    /** show only icon on small screens */
    responsive: boolean,
    text: string,
    icon?: string,
    onClick: any,
    link?: string,
    menuitems?: MenuItems[]
    enabled?: boolean
}

interface MenuProps {
    align?: TextAlignProperty,
    active?: string;
    menuitems: MenuItems[],
    style?: {
        color?: string
        background?: string
    },
    fill?: boolean,
    height?: number | string
}

interface MenuState { }


export class MenuVertical extends React.Component<MenuProps, MenuState> {
    state = {
        active: 0,
        useLinks: false,
        align: "left"
    }


    componentWillMount = () => {

        if (this.props.align) { this.setState({ align: this.props.align }) }

        if (this.props.active) {
            for (var m in this.props.menuitems) {
                if (this.props.menuitems[m].text.toLowerCase().indexOf(this.props.active.toLowerCase()) >= 0) {
                    console.log("found active")
                    this.setState({ active: m, useLinks: true })
                    //this.props.menuitems[m].onClick();
                }
            }
        }
    }

    drawbutton = (icon, size, item) => {
        return <span><i className={"fa fa-" + icon} ></i> {((size == "small") && (item.responsive)) ? "" : item.text}</span>
    }

    render() {
        var size = "large";
        if (window.innerWidth < 800) { size = "small" }



        return (
            <div style={{ display: "flex", flexDirection: "column" }}>
                {this.props.menuitems.map((item, i, arr) => {

                    var onClick = (e) => {
                        this.setState({ active: i })
                        if (item.onClick) item.onClick();
                    }

                    var icon = (item.icon) ? item.icon : "angle-right";

                    return (item.link)
                        ? <div key={i} style={{ padding: colors.padding }}><NavLink exact to={item.link}  >{this.drawbutton(icon, size, item)}</NavLink></div>
                        : <div key={i} style={{ padding: colors.padding }} onClick={onClick} > {this.drawbutton(icon, size, item)} </div>
                }
                )}
            </div >
        )
    }
}
