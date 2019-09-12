import React from "react";
import { theme, colors } from "../theme"

interface MenuProps {
    onClick: any
}

interface MenuState { }


export class Button extends React.Component<MenuProps, MenuState> {
    state = {}

    render() {
        return (
            <button style={{
                borderTopRightRadius: "0px",
                width: "40px", height: "40px",
                background: colors.alarm,
                float: "right",
                textAlign: "center",
                padding: "9px",
                boxSizing: "border-box",
                cursor: "pointer",
                fontSize: "20px",
                border: "1px solid rgba(170, 39, 55,1)",
                borderTop: "1px solid #dd3e47"
            }} onClick={this.props.onClick} ><i className="fas fa-times"></i></button>
        )
    }
}