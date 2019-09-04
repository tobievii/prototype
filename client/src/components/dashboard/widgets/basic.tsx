import React, { Component } from 'react';
import { WidgetComponentProps } from '../../../../../server/shared/interfaces';

interface State { }

export default class WidgetBasic extends React.Component<WidgetComponentProps, State> {
    state = {}

    options() {
        return "asdf"
    }

    render() {
        return (
            <div style={{ background: "#09c", wordBreak: "break-all" }}>
                <p>
                    value: {JSON.stringify(this.props.value)}<br /><br />
                    widget: {JSON.stringify(this.props.widget, null, 2)}<br /><br />
                    state: {JSON.stringify(this.props.state, null, 2)}
                </p>

            </div>
        );
    }
};

