import React from "react";
import { CorePacket, WidgetType } from "../../../../server/shared/interfaces";
import * as widgets from './widgets'
import { OptionMenu } from "./optionmenu"
import { objectByString } from "../../../../server/shared/shared"
import { colors } from "../../theme";

interface MyProps {
    widget: WidgetType;
    state: CorePacket;
    action: Function;
    [index: string]: any;
}

interface WidgetState {
    showMenu: boolean
}

export class Widget extends React.Component<MyProps, WidgetState> {
    state = {
        showMenu: false
    };

    /** pass action up to parent dashboard */
    handleActionMenu = (data) => {
        this.props.action(data);
    }

    render() {
        if (!this.props.widget) { return <div>error</div> }
        if (!this.props.widget.type) { return <div>error1</div> }

        var WidgetToDraw = widgets[this.props.widget.type.toLowerCase()]

        // Obtain OPTIONS from widget class
        var WidgetOptions = []
        if (WidgetToDraw) WidgetOptions = new WidgetToDraw().options()

        var value;
        if (this.props.widget.datapath) {
            value = objectByString(this.props.state, this.props.widget.datapath)
        }

        return (<div style={{ background: "#0e0e0e", height: "100%", position: "relative", display: "flex", flexDirection: "column", border: colors.borders }}

            onDrag={e => { e.preventDefault(); e.stopPropagation(); }} >

            <div className="widgetTitleBar" style={{ background: "rgba(0, 0, 0, 0.1)", display: "flex" }}  >
                <div className="widgetGrab" style={{ flex: "1 auto", cursor: "grab", padding: 5, textAlign: "center", opacity: 0.5 }}>{this.props.widget.dataname} </div>
                <div className="widgetOptions">
                    <div className="widgetOptionsButton"
                        onClick={() => { this.setState({ showMenu: !this.state.showMenu }) }}
                        style={{
                            cursor: "pointer", padding: "7px", color: (this.state.showMenu) ? "rgba(255, 255, 255, 0.75)" : "rgba(255, 255, 255, 0.1)"
                        }} ><i className="fas fa-wrench"  ></i></div>

                    {(this.state.showMenu) ? <OptionMenu
                        options={WidgetOptions}
                        action={this.handleActionMenu}
                        widgettypename={this.props.widget.type.toLowerCase()}
                        widgettypes={Object.keys(widgets).sort()}
                        widget={this.props.widget}
                        state={this.props.state} /> : <div></div>}
                </div>
            </div>

            <div style={{ padding: "5px", flex: "1 auto", overflowY: "auto" }}>
                {(WidgetToDraw != undefined)
                    ? <div style={{ height: "100%" }}><WidgetToDraw
                        widget={this.props.widget}
                        state={this.props.state}
                        value={value}
                    /></div>
                    : <div>Error {this.props.widget.type.toLowerCase()} widget not found</div>}
            </div>
        </div >)
    }
}
