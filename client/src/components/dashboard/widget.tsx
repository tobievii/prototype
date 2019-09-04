import React from "react";
import { CorePacket, WidgetType } from "../../../../server/shared/interfaces";

import { WidgetGauge } from "./widget_gauge"

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

        return (<div
            style={{ overflow: "hidden", height: "100%", position: "relative" }}
            className="dashboardBlock"
            onDrag={e => { e.preventDefault(); e.stopPropagation(); }} >

            <div className="widgetTitleBar" >
                <div className="widgetGrab" >{this.props.widget.dataname} </div>
                <div className="widgetOptions">
                    <div className="widgetOptionsButton"
                        onClick={() => { this.setState({ showMenu: !this.state.showMenu }) }}
                        style={{ padding: "7px" }} ><i className="fas fa-wrench"  ></i></div>
                </div>
            </div>

            <div style={{ padding: "40px 10px 10px" }}>
                {this.props.widget.type} <br />
                {JSON.stringify(this.props.state.data)}
            </div>


        </div >)
    }
}
