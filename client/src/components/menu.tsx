import React from "react";
import { BrowserRouter, Route, Link, NavLink } from "react-router-dom";
import { theme, colors } from "../theme"
import { clone } from "../utils/lodash_alt"
import { Dropdown } from "./dropdown"
import { TextAlignProperty, StandardLonghandProperties } from "csstype";
import { button } from "./dashboard/widgets";

interface MenuItems {
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
    config: {
        menuitems: MenuItems[],

    },
    style?: {
        color?: string
        background?: string
    },
    fill?: boolean,
    height?: number | string
}

interface MenuState { }


export class Menu extends React.Component<MenuProps, MenuState> {
    state = {
        active: 0,
        useLinks: false,
        align: "left"
    }


    componentWillMount = () => {

        if (this.props.align) { this.setState({ align: this.props.align }) }

        if (this.props.active) {
            for (var m in this.props.config.menuitems) {
                if (this.props.config.menuitems[m].text.toLowerCase().indexOf(this.props.active.toLowerCase()) >= 0) {
                    console.log("found active")
                    this.setState({ active: m, useLinks: true })
                    this.props.config.menuitems[m].onClick();
                }
            }
        }
    }

    render() {
        var size = "large";
        if (window.innerWidth < 800) { size = "small" }

        var align: any = this.state.align

        var menustyle = {
            color: colors.spotE,
            background: colors.panels
        }
        if (this.props.style) {
            if (this.props.style.background) { menustyle.background = this.props.style.background }
            if (this.props.style.color) { menustyle.color = this.props.style.color }
        }


        var wrapperstyle: any = { textAlign: align }

        if (this.props.fill) {
            wrapperstyle.display = "flex"
            wrapperstyle.flexFlow = "row nowrap"
            wrapperstyle.height = (this.props.height) ? this.props.height : "100%"
            //wrapperstyle.flexDirection = "row";
            //wrapperstyle.backgroundColor = "#33ffff"
        }

        return (
            <div style={wrapperstyle}>
                {this.props.config.menuitems.map((item, i, arr) => {

                    var onClick = (e) => {
                        this.setState({ active: i })
                        item.onClick();
                    }

                    var icon = (item.icon) ? item.icon : "angle-right";
                    var buttonstyle: any = (i == this.state.active)
                        ? {
                            display: "inline-block",
                            //borderTop: "1px solid " + colors.spotA,
                            color: menustyle.color,
                            background: menustyle.background
                        }
                        : {
                            display: "inline-block",
                            //borderTop: "1px solid rgba(0,0,0,0)",
                            color: menustyle.color,
                            background: menustyle.background
                        }

                    if (this.props.fill) {
                        buttonstyle.width = "100%"
                        buttonstyle.height = "100%"
                    }

                    if (item.menuitems != undefined) {
                        return <Dropdown height={this.props.height} style={buttonstyle} key={i} text={item.text} items={item.menuitems} />
                    } else {
                        if (item.link) {
                            return <NavLink exact to={item.link} key={i}  >
                                <button onClick={onClick} style={buttonstyle}>
                                    <i className={"fa fa-" + icon} ></i> {((size == "small") && (item.responsive)) ? "" : item.text}
                                </button></NavLink>
                        } else {
                            return <button key={i} onClick={onClick} style={buttonstyle}>
                                <i className={"fa fa-" + icon} ></i> {((size == "small") && (item.responsive)) ? "" : item.text}
                            </button>
                        }
                    }




                })}
            </div >
        )
    }
}
