import React, { Component } from "react";
import ChangePassword from "../../components/changePassword";
const Cryptr = require('cryptr');
const cryptr = new Cryptr('prototype');
export class SetUsername extends React.Component {

    state = {
        available: false,
        username: undefined,
        message: "",
        isOpen: false
    }

    componentDidMount() {

    }

    onChange = () => {
        return (evt) => {
            this.setState({ username: this.cleaner(evt.target.value) }, () => {
                this.checkUpdateUsername();
            })
        }
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



    showButton = () => {
        if (this.state.available == false) {
            return (<div>not available try a different username.</div>)
        } else {
            return (<button onClick={this.updateUsername} className="btn-spot" style={{ float: "right" }} > SAVE</button>)
        }
    }

    updateUsername = () => {
        fetch('/api/v3/account/updateusername', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: this.state.username })
        }).then(response => response.json()).then((data) => {
            this.props.usernameUpdated();
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
                <h3 style={{ marginTop: "5px" }}> Username </h3>
                <p>Here you can change your public username. This must be unique across the system. It will affect your public url in the form of /u/username</p>
                <input
                    style={{ width: "50%" }}
                    value={this.state.username}
                    onChange={this.onChange()}
                    autoFocus={true}
                />
                {this.showButton()}<hr></hr>
                <h3> CHANGE PASSWORD </h3>
                <button
                    className="btn-spot floatLeft"
                    style={{ float: "center" }}
                    onClick={this.changePassword}
                >
                    CHANGE PASSWORD
                                </button>
            </div>
        )
    }

    cleaner(str) {
        var strLower = str.toLowerCase();
        return strLower.replace(/\W/g, '');
    }
}


