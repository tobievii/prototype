import React from "react";
import { CorePacket, WidgetType } from "../../../../server/shared/interfaces";


import * as widgets from './widgets'

import { Options } from "./options"

import { objectByString } from "../../../../server/shared/shared"

interface MyProps {
    widget: WidgetType;
    state: CorePacket;
}

interface MyState {
    [index: string]: any;
}

export class Widget extends React.Component<MyProps, MyState> {
    state = {
        showMenu: false
    };

    render() {
        if (!this.props.widget) { return <div>error</div> }

        // if (this.props.widget.type.toLowerCase() == "gauge") {
        //     return (<WidgetGauge />)
        // }

        var WidgetToDraw = widgets[this.props.widget.type.toLowerCase()]

        // datapath={data.datapath.split("root.")[1]
        var value;
        if (this.props.widget.datapath) {
            value = objectByString(this.props.state, this.props.widget.datapath.split("root.")[1])
        }


        return (<div
            style={{ height: "100%", position: "relative" }}
            className="dashboardBlock"
            onDrag={e => { e.preventDefault(); e.stopPropagation(); }} >

            <div className="widgetTitleBar" >
                <div className="widgetGrab" >{this.props.widget.dataname} </div>
                <div className="widgetOptions">
                    <div className="widgetOptionsButton"
                        onClick={() => { this.setState({ showMenu: !this.state.showMenu }) }}
                        style={{ padding: "7px" }} ><i className="fas fa-wrench"  ></i></div>

                    {(this.state.showMenu) ? <Options /> : <div></div>}
                </div>
            </div>

            <div style={{ padding: "40px 10px 10px" }}>


                {(WidgetToDraw != undefined)
                    ? <div><WidgetToDraw
                        widget={this.props.widget}
                        state={this.props.state}
                        value={value}
                    /></div>
                    : <div>{this.props.widget.type} <br />
                        {JSON.stringify(this.props.state.data)}</div>}


                {/* {Object.keys(Widgets).map((widgetClassName, i) => {
                    var WidgetToDraw = Widgets[widgetClassName]
                    return <span key={i}> <WidgetToDraw /></span>
                })} */}

            </div>


        </div >)
    }
}
