import React from "react";

interface MyProps {
    [index: string]: any;
}

interface MyState {
    [index: string]: any;
}

export class Options extends React.Component<MyProps, MyState> {
    state = {};

    render() {
        return (<div className="widgetMenu" style={{
            position: "absolute",
            zIndex: 100,
            width: "auto",
            minWidth: 250,
            fontSize: 14,
            top: 20
        }} >OPTIONS</div >)
    }
}
