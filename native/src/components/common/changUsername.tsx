import React from 'react';
import { View, Button, Text, TextInput, AsyncStorage } from 'react-native';

interface Props {
    account: string;
}

class ChangeUsername extends React.Component<Props> {

    state = {
        username: undefined,
        disablebutton: true,
        usernameInfo: "Username must be more than 3 characters.",
        account: undefined
    }

    constructor(props) {
        super(props)
        // this.setState({ account: props.navigation.state.params.account })
    }

    private changeUn = async () => {
        await fetch('https://prototype.dev.iotnxt.io/api/v3/account/updateusername', {
            method: 'POST',
            headers: {
                "Authorization": this.state.account.auth,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: this.state.username
            }),
        }).then((response) => response.text())
            .then((responseJson) => {
                this.setState({ usernameInfo: "Username Updated" }, () => {
                    this.setState({ disablebutton: true })
                })
            })
            .catch((error) => {
                console.log(error)
            });
    }

    private onUnChange = async (username) => {
        if (username.length >= 3) {
            await fetch('https://prototype.dev.iotnxt.io/api/v3/account/checkupdateusername', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username.toLowerCase()
                }),
            }).then((response) => response.text())
                .then((responseJson) => {
                    if (JSON.parse(responseJson).available == true) {
                        this.setState({ usernameInfo: "" }, () => {
                            this.setState({ disablebutton: false })
                            this.setState({ username })
                        })

                    } else {
                        this.setState({ usernameInfo: "Username not available." }, () => {
                            this.setState({ disablebutton: true })
                            this.setState({ username })
                        })
                    }
                })
                .catch((error) => {
                    console.log(error)
                });
        } else {
            this.setState({ usernameInfo: "Username must be more than 3 characters." }, () => {
                this.setState({ disablebutton: true })
            })
        }
    }

    public render(): React.ReactNode {
        return (
            <View style={{ margin: 10 }}>
                <View>
                    <Text>Username</Text>
                    <Text>Please change your username below.</Text>
                    <Text>This must be unique across the system.</Text>

                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1, color: "black", marginBottom: 10 }}
                        placeholder="Gateway ID"
                        onChangeText={(username) => { this.onUnChange(username) }}
                    // value={this.state.text}
                    />

                    <Text>{this.state.usernameInfo}</Text>
                </View>
                <View>
                    <Button title="SAVE" onPress={this.changeUn} disabled={this.state.disablebutton} />
                </View>
            </View>
        );
    }
}

export default ChangeUsername;