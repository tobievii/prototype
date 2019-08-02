import React from 'react';
import { View, Button, Text, TextInput, AsyncStorage } from 'react-native';
import { PasswordValidator } from '../../../src/core/validators';
import { ValidationInput } from '../../../src/components/common';

interface Props {
    account: string;
}

class ChangePassword extends React.Component<Props> {

    state = {
        password: undefined,
        newPassword: undefined,
        newPasswordConfirm: undefined,
        newPasswordEditable: false,
        newPasswordConfirmEditable: false,
        disablebutton: true,
        passwordInfo: "Enter Current Password.",
        account: undefined
    }

    constructor(props) {
        super(props)
        // console.log(props)
        // if (props.navigation) {
        //     this.setState({ account: props.navigation.state.params.account })
        // }

    }

    private changeCookie = async (username) => {
        fetch("https://prototype.dev.iotnxt.io/api/v3/passChanged", {
            method: "POST", body: JSON.stringify({ username: username }), headers: { "Accept": "application/json", "Content-Type": "application/json" },
        }).then(response => response.json()).then(serverresponse => {
            this.setState({ passwordInfo: "Password successfully changed", disablebutton: true })
        }).catch(err => console.error(err.toString()));
    }

    private changePassword = async () => {
        if (this.state.password == undefined || this.state.password == "" || this.state.newPasswordConfirm == this.state.password) {
            this.setState({ passwordInfo: "Please check the current password and verify information above. Current password and new must be different." })
            this.setState({ disablebutton: true })
        } else {
            await fetch("https://prototype.dev.iotnxt.io/api/v3/admin/userpassword", {
                method: "POST",
                headers: {
                    "Authorization": this.state.account.auth,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pass: this.state.newPasswordConfirm,
                    user: this.state.account.username,
                    current: this.state.password
                })
            }).then(response => response.json()).then(data => {
                if (data == false) {
                    this.setState({ passwordInfo: "The current password you entered is incorrect" })
                } else {
                    this.changeCookie(this.state.account.username)
                }
            }).catch(err => console.error(err.toString()))
        }
    }

    private onPassChange = async (info) => {
        if (info.field == "new") {
            this.setState({ newPassword: info.pass })
        } else if (info.field == "confirm") {
            this.setState({ newPasswordConfirm: info.pass }, () => {
                if (this.state.password == undefined) {
                    this.setState({ passwordInfo: "Current Password required" })
                } else {
                    if (info.pass == this.state.newPassword) {
                        this.setState({ passwordInfo: "Passwords Match" })
                        this.setState({ disablebutton: false })
                    } else {
                        this.setState({ passwordInfo: "New password must match with confirmation password." })
                        this.setState({ disablebutton: true })
                    }
                }
            })
        }

        if (this.state.newPasswordConfirm == this.state.password) {
            this.setState({ passwordInfo: "New password must not be the same as the current password" })
            this.setState({ disablebutton: true })
        }
    }

    private currentP = (password: string) => {
        if (password != undefined) {
            this.setState({ password })
        }
    }

    public render(): React.ReactNode {
        return (
            <View style={{ margin: 10 }}>
                <Text>Password</Text>
                <View>
                    <Text>Current Password</Text>
                    <ValidationInput
                        secureTextEntry={true}
                        validator={PasswordValidator}
                        style={{ height: 40, color: "white", marginBottom: 10 }}
                        placeholder="Current Password"
                        onChangeText={this.currentP}
                    />
                </View>
                <View>
                    <Text>New Password</Text>
                    <ValidationInput
                        secureTextEntry={true}
                        validator={PasswordValidator}
                        style={{ height: 40, color: "white", marginBottom: 10 }}
                        placeholder="New Password"
                        onChangeText={(pass) => { if (pass != undefined) { this.onPassChange({ pass: pass, field: "new" }) } }}
                    />
                </View>
                <View>
                    <Text>New Password Confirmation</Text>
                    <ValidationInput
                        secureTextEntry={true}
                        validator={PasswordValidator}
                        style={{ height: 40, color: "white", marginBottom: 10 }}
                        placeholder="New Password Confirmation"
                        onChangeText={(pass) => { if (pass != undefined) { this.onPassChange({ pass: pass, field: "confirm" }) } }}
                    />
                </View>
                <View>
                    <Text style={{ marginVertical: 10 }}>{this.state.passwordInfo}</Text>
                    <Button title="Change Password" onPress={this.changePassword} disabled={this.state.disablebutton} />
                </View>
            </View>
        );
    }
}

export default ChangePassword;