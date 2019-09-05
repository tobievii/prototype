import React, { Component } from 'react';
import { WidgetComponentProps } from '../../../../../server/shared/interfaces';

import { WidgetComponent } from "./widgetcomponent"

export default class WidgetBasic extends WidgetComponent {
    state = {
        options: {
            color: { type: "color", default: "#ffff00" }
        }
    }

    options() {
        return this.state.options
    }

    render() {


        var color = this.state.options.color.default

        // widget options:
        if (this.props.widget.options) {
            var db = this.props.widget.options;
            if (db.color) color = db.color
        }
        //

        return (
            <div style={{ color, wordBreak: "break-all" }}>

                {JSON.stringify(this.props.value)}

                {/* <p>
                    value: <br /><br />
                    widget: {JSON.stringify(this.props.widget, null, 2)}<br /><br />
                    state: {JSON.stringify(this.props.state, null, 2)}
                </p> */}
            </div>
        );
    }
};

