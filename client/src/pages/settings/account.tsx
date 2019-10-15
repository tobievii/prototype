import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, NavLink } from 'react-router-dom'
import { api } from "../../api"
import { User } from "../../../../server/shared/interfaces"
import { colors } from "../../theme";
import { AccountTypeBadge } from "../../components/account_type_badge";

interface MyProps { }
interface MyState { }

export class Account extends React.Component<MyProps, MyState> {
    state = {}

    render() {
        const account: User = api.data.account;

        return (
            <div>
                <span>email: {account.email}</span> {(account.emailverified)
                    ? <span style={{ color: colors.good }}>Verified</span>
                    : <span style={{ color: colors.alarm }}>Unverified</span>} <br />

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

