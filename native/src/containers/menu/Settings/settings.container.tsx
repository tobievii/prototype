import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';

// import { plugins } from '../index
//temporary plugin imports. Idealy should be in ../index 
import Plugin from '../../../components/plugins/admin'
import Account from '../../../components/plugins/account'
import Iotnxt from '../../../components/plugins/iotnxt'

import {
    createSwitchNavigator,
    createAppContainer,
    createDrawerNavigator,
    createStackNavigator
} from 'react-navigation';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: "#101720",
        color: "white",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export class SettingsViewContainer extends React.Component {
    render() {
        return <AppContainer style={styles.container} />;
    }
}

const AccountNavigator = createStackNavigator({
    AccountScreen: {
        screen: Account,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: 'Account',
                headerLeft: (
                    <Icon onPress={() => navigation.openDrawer()} name="md-menu" size={30} />
                )
            };
        }
    }
});

const IotnxtNavigator = createStackNavigator({
    Iotnxt: {
        screen: Iotnxt,
        headerStyle: styles.container,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: 'Iot.nxt',
                headerContainer: { styles },
                headerLeft: (
                    <Icon onPress={() => navigation.openDrawer()} name="md-menu" size={30} />
                )
            };
        }
    }
});

const DashboardStackNavigator = createStackNavigator({
    Admin: {
        screen: Plugin,
        headerStyle: styles.container,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: "Admin",
                headerLeft: (
                    <Icon onPress={() => navigation.openDrawer()} name="md-menu" size={30} />
                )
            };
        }
    },
});

const AppDrawerNavigator = createDrawerNavigator({
    ADMIN: {
        screen: DashboardStackNavigator,
    },
    Account: {
        screen: AccountNavigator
    },
    Iotnxt: {
        screen: IotnxtNavigator
    },
});

const AppSwitchNavigator = createSwitchNavigator({
    Dashboard: { screen: AppDrawerNavigator }
});

const AppContainer = createAppContainer(AppSwitchNavigator);
