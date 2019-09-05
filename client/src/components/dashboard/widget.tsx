import React from "react";
import { CorePacket, WidgetType } from "../../../../server/shared/interfaces";
import * as widgets from './widgets'
import { OptionMenu } from "./optionmenu"
import { objectByString } from "../../../../server/shared/shared"

interface MyProps {
    widget: WidgetType;
    state: CorePacket;
    [index: string]: any;
}

interface MyState {
    [index: string]: any;
}

export class Widget extends React.Component<MyProps, MyState> {
    state = {
        showMenu: false
    };

    handleActionMenu = (data) => {
        console.log("handleActionMenu", data)
        if (data.type) { }
        if (data.remove) { }
    }

    render() {
        if (!this.props.widget) { return <div>error</div> }

        // if (this.props.widget.type.toLowerCase() == "gauge") {
        //     return (<WidgetGauge />)
        // }

        var WidgetToDraw = widgets[this.props.widget.type.toLowerCase()]

        // Obtain OPTIONS from widget class
        var WidgetOptions = []
        if (WidgetToDraw) WidgetOptions = new WidgetToDraw().options()

        // datapath={data.datapath.split("root.")[1]
        var value;
        if (this.props.widget.datapath) {
            value = objectByString(this.props.state, this.props.widget.datapath.split("root.")[1])
        }


        return (<div
            style={{ background: "rgba(255, 255, 255, 0.03)", height: "100%", position: "relative", display: "flex", flexDirection: "column" }}

            onDrag={e => { e.preventDefault(); e.stopPropagation(); }} >

            <div className="widgetTitleBar" style={{ background: "rgba(0, 0, 0, 0.3)", display: "flex" }}  >
                <div className="widgetGrab" style={{ flex: "1 auto", cursor: "grab", padding: 5 }}>{this.props.widget.dataname} </div>
                <div className="widgetOptions">
                    <div className="widgetOptionsButton"
                        onClick={() => { this.setState({ showMenu: !this.state.showMenu }) }}
                        style={{ cursor: "pointer", padding: "7px", color: "rgba(255, 255, 255, 0.1)" }} ><i className="fas fa-wrench"  ></i></div>

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
                    ? <div><WidgetToDraw
                        widget={this.props.widget}
                        state={this.props.state}
                        value={value}
                    /></div>
                    : <div>Error {this.props.widget.type.toLowerCase()} widget not found</div>}


                {/* {Object.keys(Widgets).map((widgetClassName, i) => {
                    var WidgetToDraw = Widgets[widgetClassName]
                    return <span key={i}> <WidgetToDraw /></span>
                })} */}

            </div>


        </div >)
    }
}
