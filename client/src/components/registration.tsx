import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, NavLink } from 'react-router-dom'

import "../prototype.scss"

import { api } from "../api"
import { emit } from "cluster";

interface MyProps {
    // getaccount: Function;
    // history: any;
}

interface MyState {
    // [index: string]: any
}

export class Registration extends React.Component<MyProps, MyState> {

    state = {
        email: "",
        pass: "",
        message: ""
    }

    onClick = () => {
        api.register({ email: this.state.email, pass: this.state.pass }, (err, result) => {
            if (err) {
                this.setState({ message: err.err })
                setTimeout(() => {
                    this.setState({ message: "attempting login..." })
                    this.signin();
                }, 1000)
            }
            if (result) {
                api.location("/")
            }
        })
    }

    signin = () => {
        api.signin(this.state.email, this.state.pass, (err, result) => {
            if (err) {
                this.setState({ message: err.err })
                setTimeout(() => {
                    this.setState({ message: "" })
                }, 1000)
            }
            if (result) {
                if (result.signedin) {
                    //this.props.getaccount();
                    //this.props.history.push("/");
                    api.location("/")
                }
            }
        })
    }

    onChange = (propname) => {
        return (evt) => {
            let tmp = {};
            tmp[propname] = evt.target.value;
            this.setState(tmp);
        }
    }

    onKeyPress = (event) => {
        if (event.key === "Enter") {
            console.log("enter!")
            this.onClick();
        }
    }

    render() {
        return (
            <div>
                <div>
                    <input
                        placeholder="Email Address"
                        type="text"
                        style={{ width: 250 }}
                        onChange={this.onChange("email")}
                        value={this.state.email.toLowerCase()} />

                    <input
                        placeholder="Password"
                        type="password"
                        style={{ width: 250 }}
                        onChange={this.onChange("pass")}
                        value={this.state.pass}
                        onKeyPress={this.onKeyPress} />

                    <button
                        onClick={this.onClick}>
                        OK</button>
                </div>

                <span>{this.state.message}</span>
            </div>
        );
    }
}

