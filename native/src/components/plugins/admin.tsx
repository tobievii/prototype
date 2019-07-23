import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../containers/menu/Settings/settings.container'

export const name = "ADMIN";

class Plugin extends Component {
    render() {
        return (
            <View>
                <Text>ADMIN Screen</Text>
            </View>
        );
    }
}

export default Plugin;