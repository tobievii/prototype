import React from "react";
import { BrowserRouter, Route, Link, NavLink } from "react-router-dom";
import { theme, colors } from "../theme"
import { SortButton } from "./sortbutton"
import { clone } from "../utils/lodash_alt"
import { Dropdown } from "./dropdown"
import { TextAlignProperty } from "csstype";

interface MenuProps {
    align?: TextAlignProperty,
    active?: string;
    config: {
        menuitems: {
            /** show only icon on small screens */
            responsive: boolean,
            text: string,
            icon?: string,
            onClick: any,
            link?: string
        }[]
    }
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

        return (
            <div style={{ textAlign: align }}>
                {this.props.config.menuitems.map((item, i, arr) => {

                    var onClick = (e) => {
                        this.setState({ active: i })
                        item.onClick();
                    }

                    var icon = (item.icon) ? item.icon : "angle-right";
                    var style: any = (i == this.state.active)
                        ? {
                            borderBottom: "0px",
                            borderTop: "1px solid " + colors.spotA,
                            background: colors.panels
                        }
                        : { borderBottom: "0px" }

                    if (item.link) {
                        return <NavLink exact to={item.link} key={i}  ><button onClick={onClick} style={style}>
                            <i className={"fa fa-" + icon} ></i> {((size == "small") && (item.responsive)) ? "" : item.text}
                        </button></NavLink>
                    } else {
                        return <button key={i} onClick={onClick} style={style}>
                            <i className={"fa fa-" + icon} ></i> {((size == "small") && (item.responsive)) ? "" : item.text}
                        </button>
                    }


                })}
            </div >
        )
    }
}
