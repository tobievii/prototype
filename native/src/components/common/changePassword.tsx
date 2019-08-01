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

        this.setState({ account: props.navigation.state.params.account })
    }

    private changePassword = async () => {
        // await fetch('https://prototype.dev.iotnxt.io/api/v3/account/updateusername', {
        //     method: 'POST',
        //     headers: {
        //         "Authorization": this.state.account.auth,
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         username: this.state.password
        //     }),
        // }).then((response) => response.text())
        //     .then((responseJson) => {
        //         this.setState({ usernameInfo: "Username Updated" }, () => {
        //             this.setState({ disablebutton: true })
        //         })
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //     });
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
    }

    private currentP = (p: string) => {
        console.log(p)
    }

    public render(): React.ReactNode {
        return (
            <View>
                <Text>Password</Text>
                <View>
                    <Text>Current Password</Text>
                    <ValidationInput
                        secureTextEntry={true}
                        validator={PasswordValidator}
                        style={{ height: 40, color: "white", margin: 10 }}
                        placeholder="Current Password"
                        onChangeText={this.currentP}
                    />
                </View>
                <View>
                    <Text>New Password</Text>
                    <ValidationInput
                        secureTextEntry={true}
                        validator={PasswordValidator}
                        style={{ height: 40, color: "white", margin: 10 }}
                        placeholder="New Password"
                        onChangeText={(pass) => { if (pass != undefined) { this.onPassChange({ pass: pass, field: "new" }) } }}
                    />
                </View>
                <View>
                    <Text>New Password Confirmation</Text>
                    <ValidationInput
                        secureTextEntry={true}
                        validator={PasswordValidator}
                        style={{ height: 40, color: "white", margin: 10 }}
                        placeholder="New Password Confirmation"
                        onChangeText={(pass) => { if (pass != undefined) { this.onPassChange({ pass: pass, field: "confirm" }) } }}
                    />
                </View>
                <View>
                    <Text>{this.state.passwordInfo}</Text>
                    <Button title="Change Password" onPress={this.changePassword} disabled={this.state.disablebutton} />
                </View>
            </View>
        );
    }
}

export default ChangePassword;