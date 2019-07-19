import React from "react";
import Modal from 'react-modal';
import zxcvbn from "zxcvbn"

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: '50%',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: "none",
        background: "rgba(0, 0, 0, 0.1)",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        maxHeight: 'calc(100vh - 210px)',
        overflowY: 'auto',
        padding: "0"
    },
    overlay: {
        background: "rgba(23, 47, 64, 0.85)",
        zIndex: 1002
    }
};

export default class ChangePassword extends React.PureComponent {

    minlength = 6;

    state = {
        password: "",
        confirm: "",
        message: "",
        messagepass: "",
        currentpassword: "",
        passwordStrength: "",
        errorMessage: "",
        suggestions: [],
        color: "",
        color2: "Dark Brown"
    }

    constructor(props) {
        super(props);
    }
    measureStrength = (password) => {

        let score = 0
        let passwordStrength
        let color = this.state.color;
        let regexPositive = [
            "[A-Z]",
            "[a-z]",
            "[0-9]",
            "\\W",
        ]
        regexPositive.forEach((regex, index) => {
            if (new RegExp(regex).test(password)) {
                score += 1
            }
        })
        switch (score) {
            case 0:
                color = "Blue"
            case 1:
                passwordStrength = "Password strength is weak.",
                    color = "Red"
                break;
            case 2:
            case 3:
                passwordStrength = "Password strength is okay, but it could be stronger",
                    color = "Orange"
                break;
            case 4:
            case 5:
                passwordStrength = "Your password is strong"
                color = "Green"
                break;
        }
        this.setState({
            passwordStrength,
            color
        })
    }

    validate = (e) => {
        let password = this.state.password
        this.measureStrength(password)
        if (password.length < this.minlength) {
            this.setState({
                passwordStrength: "Password must be minimum of " + this.minlength + " Characters",
            })
        }
    }

    handleChange = (e) => {
        this.validate(e)
    }

    passwordInput = (pass) => {
        const evaluation = zxcvbn(this.state.password)
        return (evt) => {
            this.handleChange()
            this.setState({ password: evt.target.value, score: evaluation.score, suggestions: evaluation.feedback.suggestions })
        }
    }

    currentpassword = (pass) => {
        return (evt) => {
            this.setState({ currentpassword: evt.target.value })
        }
    }

    confirmInput = (confirm) => {
        return (evt) => {
            this.setState({ confirm: evt.target.value, passwordStrength: "" })
            if (this.state.password === evt.target.value) {
                this.setState({ color2: "Green" })
            } else {
                this.setState({ color2: "Red" })
            }
        }
    }

    dbUpdate = (username) => {
        fetch("/api/v3/passChanged", {
            method: "POST", body: JSON.stringify({ username: username }), headers: { "Accept": "application/json", "Content-Type": "application/json" },
        }).then(response => response.json()).then(serverresponse => {
            this.alert()
        }).catch(err => console.error(err.toString()));
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
                        pass:this.state.password,
                        user: this.props.account.username,
                        current:this.state.currentpassword
                    })
                }).then(response => response.json()).then(data => {
                    if (data == false) {
                        this.setState({ message: "The current password you entered is incorrect" })
                    } else if (this.state.password.length < this.minlength) {
                        this.setState({
                            message: "Password must be minimum of " + this.minlength + " Characters",
                        })
                    }
                    else if (this.state.currentpassword == this.state.password) {
                        this.setState({ message: "Your new password cannot match your current password" })
                    } else {
                        this.setState({ message: "Password has successfully been changed" })
                        this.dbUpdate(this.props.account.username)
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

    changepassbutton = () => {
        if (this.state.password == this.state.confirm) {
            if (this.state.password.length > this.minlength && this.state.confirm.length > this.minlength) {
                return (
                    <button
                        className="btn-spot floatLeft"
                        style={{ float: "right" }}
                        onClick={() => { this.checkpassword(); }}
                    >
                        CHANGE PASSWORD
                                </button>
                )
            }
            else {
                return (
                    <button disabled
                        className="btn-spot2 floatLeft"
                        style={{ float: "right", cursor: "not-allowed" }}
                    >
                        CHANGE PASSWORD
                                </button>
                )
            }
        } else if (this.state.password != this.state.confirm) {
            return (
                <button disabled
                    className="btn-spot2 floatLeft"
                    style={{ float: "right", cursor: "not-allowed" }}
                >
                    CHANGE PASSWORD
                            </button>
            )

        }
    }

    render() {
        const { suggestions } = this.state
        return (
            <div >
                <center>
                    <Modal style={customStyles} isOpen={this.props.isOpen}>
                        <span className={"fas fa-times navLink cross"} onClick={() => { this.props.closeModel(); }} style={{ paddingRight: 10, float: "right" }}></span>
                        <center>
                            <div>
                                <div style={{ paddingTop: "25px" }}>
                                </div>
                                <br></br>
                                Current password:
                                <br></br>
                                <input
                                    className="fullWidth"
                                    type="password"
                                    placeholder="current password"
                                    name="current"
                                    style={{ marginBottom: 5, width: "50%" }}
                                    onChange={this.currentpassword("current")}
                                    value={this.state.currentpassword}
                                    spellCheck="false"
                                />
                                <br></br>
                                <br></br>
                                New password:
                                <br></br>
                                <input
                                    className="fullWidth"
                                    type="password"
                                    placeholder="new password"
                                    name="password"
                                    onChange={this.passwordInput("password")}
                                    value={this.state.password}
                                    style={{ marginBottom: 5, width: "50%", borderColor: this.state.color }}
                                    autoComplete="off"
                                    spellCheck="false"
                                />
                                <br></br>
                                <span style={{ textColor: this.state.color }}>{this.state.passwordStrength}</span>
                                <br></br>
                                Confirm password:
                                <br></br>
                                <input
                                    className="fullWidth"
                                    type="password"
                                    placeholder="confirm password"
                                    name="confirm"
                                    style={{ marginBottom: 5, width: "50%", borderColor: this.state.color2 }}
                                    onChange={this.confirmInput("confirm")}
                                    value={this.state.confirm}
                                    autoComplete="off"
                                    spellCheck="false"
                                />
                                <br></br>
                                <br></br>
                                <span
                                    className="serverError"
                                    style={{ fontSize: "11px" }}
                                >
                                    {this.state.message}
                                </span>
                                <br></br>
                                <br></br>
                                <div style={{ textAlign: "left" }}>
                                    {suggestions.map((s, index) =>
                                        <li key={index}>
                                            {"Tip: " + s}
                                        </li>
                                    )}
                                </div>
                                {this.changepassbutton()}
                            </div>
                        </center>
                    </Modal>
                </center>
            </div >
        )
    }
}
