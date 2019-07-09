import React, { Component } from "react";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHdd,
  faUserCheck,
  faUserPlus,
  faDice
} from "@fortawesome/free-solid-svg-icons";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Media from "react-media";

library.add(faUserCheck);
library.add(faUserPlus);
library.add(faDice);
const Cryptr = require("cryptr");
const cryptr = new Cryptr("prototype");
var openMenu = false;
export class Account extends Component {
  state = {
    menu: 0,
    url: "/",
    form: {
      email: "",
      emailSignup: "",
      passwordSignin: "",
      passwordSignup: "",
      username: "",
      type: "password"
    },
    serverError: "",
    resetButton: "",
    forgotButton: "FORGOT PASSWORD",
    loginButton: "LOGIN",
    usedButton: null,
    clipboard: "",
    copied: false,
    available: false,
    availableEmail: false
  };

  // find out if the server allows registration
  getServerRegistrationOptions = () => {
    fetch("/api/v3/admin/registration", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(registration => {
        this.setState({ registration: registration.result });
      })
      .catch(err => console.error(err.toString()));
  };

  componentDidMount = () => {
    this.generateRandomPass();
    this.getServerRegistrationOptions();
  };

  generateRandomPass = () => {
    var form = { ...this.state.form };
    form["passwordSignup"] = this.generateDifficult(16);
    this.setState({ form });
  };

  generateDifficult = count => {
    var _sym = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

    if (count == 3) {
      _sym = "1234567890";
    }

    var str = "";
    for (var i = 0; i < count; i++) {
      var tmp = _sym[Math.round(Math.random() * (_sym.length - 1))];
      str += "" + tmp;
    }
    return str;
  };

  getMenuPageStyle = function (menu) {
    if (menu == this.state.menu) {
      return { display: "" };
    } else {
      return { display: "none" };
    }
  };

  getMenuClasses = function (num) {
    if (num == this.state.menu) {
      return "menuTab borderTopSpot paddingButton";
    } else {
      return "menuTab menuSelectable paddingButton";
    }
  };

  onClickMenuTab = function (menu) {
    return (event) => {
      if (this.state.menu == menu) {
        this.setState({ menu: 0 });
      } else {
        this.setState({ menu });
      }
    };
  };

  changeInput = name => {
    return evt => {
      var form = { ...this.state.form };
      form[name] = evt.target.value;
      if (name == "emailSignup") {
        if (form.emailSignup.indexOf("@") == -1) {
          form["username"] = evt.target.value.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
          this.checkUpdateUsername(form["username"])
          if (!this.state.available) {
            form["username"] = (evt.target.value.replace(/[^a-zA-Z0-9]/g, '') + this.generateDifficult(3)).toLowerCase();
            this.setState({ serverError: "username not available, suggestion" + form["username"] }, () => {
              setTimeout(() => {
                this.setState({ serverError: "" })
              }, 1000)
            })
          } else {
            this.setState({ serverError: "username available" }, () => {
              setTimeout(() => {
                this.setState({ serverError: "" })
              }, 1000)
            })
          }
        }
        this.validateEmail(evt.target.value)
      }
      else if (name == "username") {
        form["username"] = evt.target.value.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

        if (!this.state.available) {
          form["username"] = (evt.target.value.replace(/[^a-zA-Z0-9]/g, '') + this.generateDifficult(3)).toLowerCase();
          this.setState({ serverError: "username not available, suggestion" + form["username"] }, () => {
            setTimeout(() => {
              this.setState({ serverError: "" })
            }, 1000)
          })
        } else {
          this.setState({ serverError: "username available" }, () => {
            setTimeout(() => {
              this.setState({ serverError: "" })
            }, 1000)
          })
        }

      }

      this.setState({ form });
    };
  };

  checkUpdateUsername = (username, cb) => {
    fetch('/api/v3/account/checkupdateusername', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: username })
    }).then(response => response.json()).then((data) => {
      if (data.available == true) {
        this.setState({ available: true })
      } else {
        this.setState({ available: false })
      }
    }).catch(err => console.error(err.toString()))
  }

  validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // return re.test(String(email).toLowerCase());
    if (re.test(String(email).toLowerCase())) {
      this.setState({ availableEmail: true })
    } else {
      this.setState({ availableEmail: false })
    }
  };

  signInKey = e => {
    if (e.key == "Enter") {
      this.signIn();
    }
  };

  signIn = () => {
    this.setState({ serverError: "" });
    fetch("/signin", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.form.email,
        pass: cryptr.encrypt(this.state.form.passwordSignin)
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.signedin) {
          window.location = "/";
        }

        if (data.error) {
          this.setState({ serverError: data.error });
        }
      })
      .catch(err => console.error(err.toString()));
  };

  register = () => {
    fetch("/api/v3/admin/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.form.emailSignup,
        username: this.state.form.username,
        pass: cryptr.encrypt(this.state.form.passwordSignup)
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          this.setState({ serverError: data.error });
        } else {
          location.reload();
          this.setState({ serverError: "Registration Successful" });
        }
      })
      .catch(err => console.error(err.toString()));
  };

  ForgotPassword = () => {
    fetch("/api/v3/account/recoveraccount", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.form.email
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
          this.setState({ resetButton: "RESET PASSWORD" });
          fetch("/api/v3/admin/recoverEmailLink", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: this.state.form.email
            })
          })
            .then(response => response.json())
            .then(data => {
              // fetch("/api/v3/admin/expire", {
              //   method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
              //   body: JSON.stringify({ person: this.state.form.email, button: true })
              // }).then(response => response.json()).then(data => { })
            });
        }

        if (data.error) {
          this.setState({ serverError: data.error });
        }
      })
      .catch(err => console.error(err.toString()));
  };

  drawRegisterButton = () => {
    if (this.state.registration) {
      if (this.state.registration.userRegistration) {
        if (this.props.registrationPanel == true && openMenu == false) {
          this.setState({ menu: 2 }, () => { openMenu = true; })
        }

        return (
          <Media query="(max-width: 400px)">
            {matches =>
              matches ? (
                <div
                  className={"register " + this.getMenuClasses(2)}
                  onClick={this.onClickMenuTab(2)}
                  style={{
                    marginRight: "0",
                    right: "0",
                    width: "150",
                    float: "right"
                  }}
                >
                  REGISTER
                </div>
              ) : (
                  <div
                    className={"register " + this.getMenuClasses(2)}
                    onClick={this.onClickMenuTab(2)}
                    style={{ width: "150", float: "right" }}
                  >
                    REGISTER
                </div>
                )
            }
          </Media>
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  showButton = () => {
    if (this.state.resetButton == "") {
      return (
        <div className="row">
          <div className="col-7" style={{ textAlign: "right" }}>
            <span className="serverError" style={{ fontSize: "11px" }}>
              {this.state.serverError}
            </span>
          </div>
          <div className="loginB">
            <button
              className="btn-spot"
              style={{ float: "right" }}
              onClick={this.signIn}
            >
              <FontAwesomeIcon icon="user-check" /> Login{" "}
            </button>
            <a
              className="font-weight-bold spot"
              style={{
                float: "right",
                marginRight: 120,
                marginLeft: 15,
                marginTop: 12,
                color: "#E02430",
                cursor: "pointer"
              }}
              onClick={() => this.ForgotPassword()}
            >
              <u> {this.state.forgotButton} ? </u>{" "}
            </a>
          </div>
        </div>
      );
    } else {
      return (
        <div className="col-10" style={{ textAlign: "right" }}>
          <span className="serverError" style={{ fontSize: "auto" }}>
            Check email for Password recovery link(Valid only for 10 minutes)
          </span>
        </div>
      );
    }
  };

  levelZero = () => {
    if (this.props.loginPanel == true && openMenu == false) {
      this.setState({ menu: 1 }, () => { openMenu = true; })
    }
    return (
      <div
        className="navBar"
        style={{
          position: "absolute",
          width: 400,
          right: 20,
          top: 0,
          zIndex: 2000
        }}
      >
        <div className="row">
          <div className="col-md-12 ">
            {this.drawRegisterButton()}
            <div
              className={"login " + this.getMenuClasses(1)}
              onClick={this.onClickMenuTab(1)}
              style={{ width: "150", float: "right" }}
            >
              LOGIN
            </div>
          </div>
        </div>

        <div className="bgpanel" style={this.getMenuPageStyle(1)}>
          <div className="row" style={{ marginTop: 2, marginBottom: 5 }}>
            <div
              className="col-3"
              style={{ textAlign: "right", paddingTop: 10 }}
            >
              {" "}
              email:{" "}
            </div>
            <div className="col-9">
              {" "}
              <input
                id="emailInput2"
                placeholder="email"
                style={{ width: "100%" }}
                spellCheck="false"
                onKeyPress={this.signInKey}
                onChange={this.changeInput("email")}
                value={this.state.form.email}
                autoFocus
              />{" "}
            </div>
          </div>

          <div className="row" style={{ marginBottom: 15 }}>
            <div
              className="col-3"
              style={{ textAlign: "right", paddingTop: 10 }}
            >
              {" "}
              password:{" "}
            </div>
            <div className="col-9">
              <input
                id="password2"
                placeholder="password"
                type="password"
                style={{ width: "100%" }}
                value={this.state.form.passwordSignin}
                onChange={this.changeInput("passwordSignin")}
                onKeyPress={this.signInKey}
              />
            </div>
          </div>
          {this.showButton()}
        </div>

        <div className="bgpanel" style={this.getMenuPageStyle(2)}>
          <div className="row" style={{ marginTop: 2, marginBottom: 5 }}>
            <div
              className="col-3"
              style={{ textAlign: "right", paddingTop: 10 }}
            >
              {" "}
              email:{" "}
            </div>
            <div className="col-9">
              <input
                id="emailInput"
                placeholder="email"
                type="email"
                style={{ width: "100%" }}
                onChange={this.changeInput("emailSignup")}
                spellCheck="false"
                value={this.state.form.emailSignup}
              />
            </div>
          </div>

          <div className="row" style={{ marginTop: 2, marginBottom: 5 }}>
            <div
              className="col-3"
              style={{ textAlign: "right", paddingTop: 10 }}
            >
              {" "}
              username:{" "}
            </div>

            <div className="col-9">
              <input
                id="usernameInput"
                placeholder="username"
                type="text"
                style={{ width: "100%" }}
                onChange={this.changeInput("username")}
                spellCheck="false"
                value={this.state.form.username}
              />
            </div>
          </div>

          <div className="row" style={{ marginBottom: 15 }}>
            <div
              className="col-3"
              style={{ textAlign: "right", paddingTop: 10 }}
            >
              {" "}
              password:{" "}
            </div>
            <div className="col-7" style={{ paddingRight: 8 }}>
              <input
                id="password"
                className="password"
                type={this.state.form.type}
                placeholder="password"
                spellCheck="false"
                style={{ width: "100%" }}
                value={this.state.form.passwordSignup}
                onChange={this.changeInput("passwordSignup")}
              />{" "}
            </div>

            <div
              className="col-2"
              style={{ padding: "8px 10px 0px 0px", fontSize: "120%" }}
            >
              <div>
                <FontAwesomeIcon
                  onClick={this.generateRandomPass}
                  className="smallIconClickable"
                  icon="dice"
                  title="Generate random"
                  onMouseOver={() => {
                    var form = { ...this.state.form };
                    if (this.state.form.type == "password") {
                      form["type"] = "text";
                      this.setState({ form })
                    }
                    setTimeout(() => {
                      form["type"] = "password";
                      this.setState({ form })
                    }, 1900)
                  }}
                />

                {this.state.copied
                  ?
                  <i style={{ paddingLeft: 8, color: "green" }} className="fas fa-clipboard-check smallIconClickable" title="Copied."></i>
                  :
                  <CopyToClipboard text={this.state.form.passwordSignup} onCopy={() => this.setState({ copied: true })}>
                    <span style={{ paddingLeft: 8 }} className="fas fa-clipboard smallIconClickable" title="Copy to clipboard"></span>
                  </CopyToClipboard>
                }

              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-7" style={{ textAlign: "right" }}>
              <span className="serverError" style={{ fontSize: "11px" }}>
                {this.state.serverError}
              </span>
            </div>

            <div className="col-5">
              {this.state.available && this.state.availableEmail
                ?
                <button
                  className="btn-spot"
                  style={{ float: "right" }}
                  onClick={this.register}
                >
                  <FontAwesomeIcon icon="user-plus" /> Register
              </button>
                :
                <button
                  className="btn-spot"
                  style={{ float: "right", opacity: 0.3, cursor: "not-allowed" }}
                  title="Check above details"
                >
                  <FontAwesomeIcon icon="user-plus" /> Register
              </button>
              }
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    if (this.props.account) {
      if (this.props.account.level > 0) {
        return <span />;
      } else {
        return this.levelZero();
      }
    } else {
      return <span />;
    }
  }
}
