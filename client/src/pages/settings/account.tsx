import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, NavLink } from 'react-router-dom'
import { api } from "../../api"
import { User } from "../../../../server/shared/interfaces"
import { colors } from "../../theme";

interface MyProps { }
interface MyState { }

export class Account extends React.Component<MyProps, MyState> {
    state = {}

    render() {
        const account: User = api.data.account;

        return (
            <div>
                <span>email: {account.email}</span> <br />
                <span>level: {account.level}</span> <br />
                <span>username: {account.username}</span> <br /><br />

                <button style={{ background: colors.spotB }}>change username</button><br /><br />
                <button style={{ background: colors.spotB }}>change password</button><br /><br />
                <button onClick={() => { api.location("/signout") }}>Sign out</button>
            </div>
        );
    }
}

