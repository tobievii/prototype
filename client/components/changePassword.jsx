import React, { Component } from "react";
import Modal from 'react-modal';
const Cryptr = require('cryptr');
const cryptr = new Cryptr('prototype');

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: '50%',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: "none",
        // background: "rgba(23, 47, 64, 0.85)",
        background: "rgba(0, 0, 0, 0.1)",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        maxHeight: 'calc(100vh - 210px)',
        overflowY: 'auto',
        padding: "0"
    },
    //bacground of Pop up Modal on search
    overlay: {
        background: "rgba(23, 47, 64, 0.85)",
        zIndex: 1002
    }
};

export class ChangePassword extends Component {

    state = {
        password: "",
        confirm: "",
        message: "",
        messagepass: "",
        currentpassword: "",
    }

    constructor(props) {
        super(props);
    }

    passwordInput = (pass) => {
        return (evt) => {
            this.setState({ password: evt.target.value })
        }
    }

    currentpassword = (pass) => {
        return (evt) => {
            this.setState({ currentpassword: evt.target.value })
        }
    }

    confirmInput = (confirm) => {
        return (evt) => {
            this.setState({ confirm: evt.target.value })
        }
    }

    checkpassword = () => {
        if (this.state.confirm != "" && this.state.password != "") {
            if (this.state.confirm != this.state.password) {

                this.setState({ message: "Passwords don't match" })
            }
            else {
                fetch("/api/v3/admin/userpassword", {

                    method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                    body: JSON.stringify({
                        pass: cryptr.encrypt(this.state.password),
                        user: this.props.account.username,
                        current: cryptr.encrypt(this.state.currentpassword)
                    })
                }).then(response => response.json()).then(data => {
                    if (data == false) {
                        this.setState({ message: "The current password you entered is incorrect" })
                    } else if (this.state.currentpassword == this.state.password) {
                        this.setState({ message: "Your new password cannot match your current password" })
                    } else {
                        this.setState({ message: "Password has successfully been changed" })
                        this.alert()
                    }

                }).catch(err => console.error(err.toString()))
            }
        }
        else {
            this.setState({ message: "Field(s) can not be empty" })
        }
    }

    alert = () => {
        window.alert("Your password has been changed. Please log in with your new password");
        this.props.closeModel()
        window.location.href = "/signout"
    }

    render() {
        return (
            <div >
                <center>
                    <Modal style={customStyles} isOpen={this.props.isOpen}>
                        <center>
                            <div>
                                <div style={{ paddingTop: "25px" }}>
                                    You need to change your password to continue
                                </div>
                                <br></br>
                                Current password: <br></br><input className="fullWidth" type="password" placeholder="current password" name="current" style={{ marginBottom: 5, width: "50%" }} onChange={this.currentpassword("current")} value={this.state.currentpassword} spellCheck="false" />
                                <br></br>
                                New password:
                                <br></br>
                                <input className="fullWidth" type="password" placeholder="new password" name="password" onChange={this.passwordInput("password")} value={this.state.password} style={{ marginBottom: 5, width: "50%" }} autoComplete="off" spellCheck="false" />
                                <br></br>
                                Confirm password:
                                <br></br>
                                <input className="fullWidth" type="password" placeholder="confirm password" name="confirm" style={{ marginBottom: 5, width: "50%" }} onChange={this.confirmInput("confirm")} autoComplete="off" spellCheck="false" />
                                <br></br>
                                <span className="serverError" style={{ fontSize: "11px" }} >{this.state.message}</span>
                                <br></br>
                                <button className="btn-spot floatLeft" style={{ float: "center" }} onClick={() => { this.checkpassword(); }}>CHANGE PASSWORD</button>
                            </div>
                        </center>
                    </Modal>
                </center>
            </div >
        )
    }
}
