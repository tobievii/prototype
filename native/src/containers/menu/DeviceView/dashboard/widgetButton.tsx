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


    render() {
        return (
            <TouchableHighlight onPress={ this.props.onClick }>
                <View style={{ width: "100%", height: "100%", backgroundColor: this.state.background, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: this.state.color }}>
                        {this.state.buttonText}
                    </Text>
                </View>
            </TouchableHighlight >
        )
    }
}