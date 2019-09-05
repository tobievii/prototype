import React from "react";
import * as options from './options'
import { CorePacket, WidgetType, OptionComponentProps } from "../../../../server/shared/interfaces"


interface MyState {
    [index: string]: any;
}

interface OptionProps {
    name: string;
    option: any;
}

/** This instantiates the correct option widget for the menu entry */
export class Option extends React.Component<OptionProps, MyState> {
    render() {
        var OptionToDraw = options[this.props.option.type.toLowerCase()]
        if (!OptionToDraw) { return <div>Error {this.props.option.type.toLowerCase()}</div> }
        return <div><OptionToDraw name={this.props.name} option={this.props.option} /></div>
    }
}

interface OptionMenuProps {
    /** array of the possible widgets to choose from */
    options: object[]
    action: Function
    /** currently selected widget type: eg "guage" or "graph" */
    widgettypename: string
    widgettypes: string[]
    widget: WidgetType
    state: CorePacket
}

/** This builds the option menu */
export class OptionMenu extends React.Component<OptionMenuProps, MyState> {
    state = {
        options: []
        // options: [{ name: "min", type: "input", value: 1 },
        // { name: "max", type: "input", value: 2 },
        // { name: "color", type: "color", value: "#11cc88" }]
    };

    render() {
        var options = [];

        if (this.props.options) {
            console.log("OptionsMenu", this.props.options)
            options = this.props.options;
        }

        return (<div className="widgetMenu" style={{
            position: "absolute",
            zIndex: 100,
            width: "auto",
            minWidth: 250,
            fontSize: 14,
            top: 35,
            background: "rgba(128,128,128,0.5)",
            padding: 5
        }} >

            <div>Change type:
                <select
                    value={this.props.widgettypename}
                    onChange={(e => this.props.action({ type: e.target.value }))}>
                    {this.props.widgettypes.map((widgettype, i) => {
                        return <option key={i}>{widgettype}</option>
                    })}
                </select>
            </div>

            <div><button onClick={e => this.props.action({ remove: true })}><i className="fas fa-trash-alt"></i> REMOVE</button></div>

            {Object.keys(options).map((x, i) => {
                return <div key={i}><Option name={x} option={options[x]} /></div>
            })}
        </div >)
    }
}
