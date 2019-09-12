import React from "react";
import { theme, colors } from "../../theme"

import { Button } from "../button"

export interface PopupProps {
    title?: string
    onClose?: Function
}

export interface PopUpState {
    title: string;
}



export class Popup<T extends PopupProps> extends React.Component<T, {}> {
    state = {
        title: "default"
    }

    close() {
        if (this.props.onClose) { this.props.onClose() }
    }

    popuprender(children) {
        var size = "large";
        if (window.innerWidth < 800) { size = "small" }

        return (
            <div style={{

                position: "absolute",
                top: 0, left: 0, right: 0, bottom: 0,
                background: colors.backgroundPopup,
                paddingTop: "300px",
                zIndex: 1000
            }}>
                <div style={{
                    boxShadow: "0px 0px 25px 0px rgba(0,0,0,0.5)",
                    background: colors.panels,
                    padding: 0, width: "500px", margin: "0 auto",
                    borderTopRightRadius: "12px"
                    //border: "2px solid rgba(0,0,0,0.1)"
                }}>

                    <div style={{
                        borderTopRightRadius: "12px",
                        background: "rgba(0,0,0,0.1)",
                        display: "flex", flexDirection: "row"
                    }}>
                        <div style={{ flex: "1", paddingTop: colors.padding, textAlign: "center" }}>{this.state.title}</div>

                        <div style={{ flex: "0" }}><Button onClick={() => { this.close() }} /></div>
                        {/* <div style={{
                            width: "38px", height: "38px",
                            background: colors.alarm,
                            float: "right",
                            textAlign: "center",
                            paddingTop: "10px",
                            boxSizing: "border-box"
                        }}><i className="fas fa-times"></i></div> */}


                    </div>
                    <div style={{ height: "100%", padding: colors.padding * 2 }}>
                        {children}
                    </div>

                </div>
            </div >
        )
    }
}
