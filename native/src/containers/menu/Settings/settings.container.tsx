import React from 'react';
import { View } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';


// import { plugins } from '../index
//temporary plugin imports. Idealy should be in ../index 
import Plugin from '../../../components/plugins/admin'
import Account from '../../../components/plugins/account'
import Iotnxt from '../../../components/plugins/iotnxt'
import { FavoritesContainer } from '../../../components/common/themes/favorites.container'
import ChangeUsername from '../../../components/common/changUsername'
import ChangePassword from '../../../components/common/changePassword';

import { AsyncStorage } from 'react-native'

import {
    createSwitchNavigator,
    createAppContainer,
    createDrawerNavigator,
    createStackNavigator,
    NavigationScreenProps
} from 'react-navigation';

export var styles: any = {};
var navigator: any;
var account: any;

export class SettingsViewContainer extends React.Component<NavigationScreenProps> {
    state = {
        // account: undefined
    }

    constructor(props) {
        super(props);
    }

    public render(): React.ReactNode {
        navigator = this.props.navigation;
        return <AppContainer />;
    }
}

const AccountNavigator = createStackNavigator({
    AccountScreen: {
        screen: Account,
        // params: { account: AsyncStorage.getItem('user') },
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
            navigation.openDrawer();
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
    unsetUser = async () => {
        await AsyncStorage.clear();
    }

    public render(): React.ReactNode {
        this.unsetUser()
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
    }
});

const SignoutNavigator = createDrawerNavigator({
    Signout: {
        screen: SignStackNavigator
    },
});

const AccountNav = createStackNavigator({
    changeUsername: {
        screen: ChangeUsername,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: "Change Username",
                headerLeft: (
                    <Icon onPress={() => navigation.navigate("Account")} name="md-arrow-back" size={30} />
                )
            };
        }
    },
    changePassword: {
        screen: ChangePassword,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: "Change Password",
                headerLeft: (
                    <Icon onPress={() => navigation.navigate("Account")} name="md-arrow-back" size={30} />
                )
            };
        }
    }
});

const AppSwitchNavigator = createSwitchNavigator({
    Dashboard: { screen: AppDrawerNavigator },
    Signout: { screen: SignoutNavigator },
    AccountNav: { screen: AccountNav }
});

const AppContainer = createAppContainer(AppSwitchNavigator);
