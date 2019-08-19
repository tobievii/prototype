import React from "react";
import ReactDOM from "react-dom";
import { api } from "../api"

import { Menu, Button } from "grommet"

import { User } from "../../../server/core/interfaces";

interface MyProps {
    account: User;
    states: [];
}

interface MyState {
    [index: string]: any;
}


export class DeviceList extends React.Component<MyProps, MyState> {
    constructor(props) {
        super(props);
    }

    render() {
        const states = this.props.states;
        return (
            <div style={{ width: "100%" }}>
                <Button
                    label="Add device"
                    primary
                    onClick={() => alert('hello, world')}
                />

                <Menu
                    label="Modify"
                    items={[
                        { label: 'Dashboard Preset', onClick: () => { } },
                        { label: 'Script Preset', onClick: () => { } },
                        { label: 'Share', onClick: () => { } },
                        { label: 'Delete', onClick: () => { } }
                    ]}
                />

                <div style={{ overflowX: "scroll", width: "100%" }}>
                    {(this.props.states) ? (<div>{JSON.stringify(this.props.states)}</div>) : (<div>loading</div>)}
                </div>


            </div>
        )
    }
}