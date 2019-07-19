import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../containers/menu/Settings/settings.container'

export const name = "Account";

class Account extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Account Screen</Text>
            </View>
        );
    }
}

export default Account;