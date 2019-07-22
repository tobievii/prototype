import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { styles } from '../../containers/menu/Settings/settings.container'

export const name = "Iotnxt";

class Iotnxt extends Component {
    render() {
        return (
            <View>
                <Text>ADD GATEWAY</Text>
                <View>
                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1, color: "black", margin: 10 }}
                        placeholder="Gateway ID"
                    // onChangeText={(text) => this.setState({text})}
                    // value={this.state.text}
                    />

                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1, color: "black", margin: 10 }}
                        placeholder="Secret"
                    // onChangeText={(text) => this.setState({text})}
                    // value={this.state.text}
                    />

                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1, color: "black", margin: 10 }}
                        placeholder="Host Address"
                    // onChangeText={(text) => this.setState({text})}
                    // value={this.state.text}
                    />

                    <TextInput
                        style={{ height: 40, borderColor: 'gray', borderWidth: 1, color: "black", margin: 10 }}
                        placeholder="Public key"
                    // onChangeText={(text) => this.setState({text})}
                    // value={this.state.text}
                    />


                </View>
            </View>
        );
    }
}

export default Iotnxt;