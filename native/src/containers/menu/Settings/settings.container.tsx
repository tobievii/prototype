import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';

// import { plugins } from '../index
//temporary plugin imports. Idealy should be in ../index 
import Plugin from '../../../components/plugins/admin'
import Account from '../../../components/plugins/account'
import Iotnxt from '../../../components/plugins/iotnxt'
import { FavoritesContainer } from '../../../components/common/themes/favorites.container'

import {
    createSwitchNavigator,
    createAppContainer,
    createDrawerNavigator,
    createStackNavigator,
    NavigationScreenProps
} from 'react-navigation';

export var styles: any = {};
var navigator: any;

export class SettingsViewContainer extends React.Component<NavigationScreenProps> {
    public render(): React.ReactNode {
        navigator = this.props.navigation;
        return <AppContainer />;
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
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: 'Iot.nxt',
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

const ThemeStackNavigator = createStackNavigator({
    Themes: {
        screen: FavoritesContainer,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: "Themes",
                headerLeft: (
                    <Icon onPress={() => navigation.openDrawer()} name="md-menu" size={30} />
                )
            };
        }
    },
});

class Signoutcomp extends React.Component<NavigationScreenProps>{

    public render(): React.ReactNode {
        navigator.navigate('Home');
        return (
            <View>
            </View>
        );
    }
}

const SignStackNavigator = createStackNavigator({
    Signout: {
        screen: Signoutcomp,
    },
});

const AppDrawerNavigator = createDrawerNavigator({
    Admin: {
        screen: DashboardStackNavigator,
    },
    Account: {
        screen: AccountNavigator
    },
    Iotnxt: {
        screen: IotnxtNavigator
    },
    Theme: {
        screen: ThemeStackNavigator
    },
    Signout: {
        screen: SignStackNavigator,
    },
});

const SignoutNavigator = createDrawerNavigator({
    Signout: {
        screen: SignStackNavigator
    },
});

const AppSwitchNavigator = createSwitchNavigator({
    Dashboard: { screen: AppDrawerNavigator },
    Signout: { screen: SignoutNavigator }
});

const AppContainer = createAppContainer(AppSwitchNavigator);
