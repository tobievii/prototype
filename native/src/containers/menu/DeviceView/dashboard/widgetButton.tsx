import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View, TouchableHighlight, Alert, AsyncStorage, } from 'react-native';

export class WidgetButton extends Component {
    state: {
        color;
        background;
        command;
        buttonText;
        device;
    }

    componentWillMount() {
        this.setState({ device: this.props['data'] })
        if (!this.props['widget'].options) {
            this.setState({ color: "#111111", background: "#11cc88", buttonText: "SEND", command: JSON.stringify({ "foo": true }) })
        }
        else {
            if (this.props['widget'].options.background) {
                this.setState({ background: this.props['widget'].options.background })
            }
            else {
                this.setState({ background: "#11cc88" })
            }
            if (this.props['widget'].options.color) {
                this.setState({ color: this.props['widget'].options.color })
            }
            else {
                this.setState({ color: "#111111" })
            }
            if (this.props['widget'].options.buttonText) {
                this.setState({ buttonText: this.props['widget'].options.buttonText })
            }
            else {
                this.setState({ buttonText: "SEND" })
            }
            if (this.props['widget'].options.command) {
                this.setState({ command: this.props['widget'].options.command })
            }
            else {
                this.setState({ command: JSON.stringify({ "foo": true }) })
            }
        }
    }

    onClick = async () => {
        const user = JSON.parse(await AsyncStorage.getItem('user'));
        try {
            fetch("https://prototype.dev.iotnxt.io/api/v3/data/post", {
                method: "POST", headers: { 'Authorization': user.auth, "Accept": "application/json", "Content-Type": "application/json" },
                body: JSON.stringify({ id: this.props['data'].id, data: JSON.parse(JSON.stringify({ "foo": true })) })
            }).then(response => response.json()).then(resp => {
                console.log(resp);
                Alert.alert(
                    'Command Sent',
                    this.state.command,
                    [{ text: 'Cancel', onPress: () => console.log(''), style: 'cancel', },
                    { text: 'OK', onPress: () => console.log('') },
                    ],
                    { cancelable: false },
                );
            })
        }
        catch (err) {
            return console.error(err.toString());
        }
    }

    render() {
        return (
            <TouchableHighlight onPress={() => { this.onClick() }}>
                <View style={{ width: 375, height: 250, backgroundColor: this.state.background, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: this.state.color }}>
                        {this.state.buttonText}
                    </Text>
                </View>
            </TouchableHighlight >
        )
    }
}