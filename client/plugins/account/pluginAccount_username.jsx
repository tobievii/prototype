import React, { Component } from "react";
import ChangePassword from "../../components/changePassword";
import { ChangeUsername } from "../../components/changeUsername";
export class SetUsername extends React.Component {

    state = {
        available: false,
        username: undefined,
        message: "",
        isOpen: false,
        usernameSet: false
    }

    componentDidMount() {
    }

    openModal = (origination) => {
        this.setState({ isOpen: true });
    }

    checkUpdateUsername = () => {
        fetch('/api/v3/account/checkupdateusername', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: this.state.username })
        }).then(response => response.json()).then((data) => {
            if (data.available == true) {
                this.setState({ available: true })
            } else {
                this.setState({ available: false })
            }
        }).catch(err => console.error(err.toString()))
    }

    changePassword = () => {
        this.openModal();
    }

    render() {
        if (this.props) {
            if (this.state.username == undefined) {
                if (this.props.username) {
                    this.setState({ username: this.props.username });
                }
            }
        }
        return (
            <div>
                <ChangePassword account={this.props.account} isOpen={this.state.isOpen} closeModel={() => { this.setState({ isOpen: false }) }} />
                <ChangeUsername account={this.props.account} isOpen={this.state.usernameSet} closeModel={() => { this.setState({ usernameSet: false }); this.props.usernameUpdated(); }} />
                <div style={{ display: "grid", gridTemplateColumns: "45% 45% 10%" }}>

                    <div>
                        <br /><br />
                        <h3> CHANGE USERNAME </h3><br />
                        <button
                            className="btn-spot floatLeft"
                            style={{ float: "center", opacity: 0.8 }}
                            onClick={() => { this.setState({ usernameSet: true }, () => { console.log(this.state) }) }}
                        >
                            CHANGE USERNAME
                                </button>
                    </div>
                    <div>
                        <br /><br />
                        <h3> CHANGE PASSWORD </h3><br />
                        <button
                            className="btn-spot floatLeft"
                            style={{ float: "center", opacity: 0.8 }}
                            onClick={this.changePassword}
                        >
                            CHANGE PASSWORD
                                </button>
                    </div>
                    <div>
                        <br /><br /><br /><br /><br />
                        <a href="/signout"><button className="btn-spot" style={{ float: "right", opacity: 0.8 }} > SIGN OUT</button></a>
                    </div>
                </div>
            </div>
        )
    }
}


