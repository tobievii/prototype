import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, NavLink } from 'react-router-dom'
import { api } from "../../api"
import { User } from "../../../../server/shared/interfaces"
import { colors } from "../../theme";
import { AccountTypeBadge } from "../../components/account_type_badge";
import { AccountEmail } from "./account_email";

interface MyProps { }
interface MyState { }

export class Account extends React.Component<MyProps, MyState> {
    state = { changeEmail: false }

    render() {
        const account: User = api.data.account;

        return (
            <div>
                <AccountEmail />


                <span>level: {account.level}</span> <br />
                <span>username: {account.username}</span> <br /><br />

                <div style={{ paddingBottom: colors.padding * 2 }}>
                    <AccountTypeBadge />
                </div>


                <button style={{ background: colors.spotB }}>change username</button><br /><br />
                <button style={{ background: colors.spotB }}>change password</button><br /><br />
                <button onClick={() => { api.location("/signout") }}>Sign out</button>
            </div>
        );
    }
}

