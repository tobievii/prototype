import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, NavLink } from 'react-router-dom'
import { api } from "../api"
import { User } from "../../../server/shared/interfaces"
import { colors } from "../theme";

interface MyProps { }
interface MyState { }

export class Settings extends React.Component<MyProps, MyState> {


    state = {}


    render() {

        return (
            <div style={{ padding: 20 }}>
                <h2>SETTINGS</h2>
            </div>
        );
    }
}

