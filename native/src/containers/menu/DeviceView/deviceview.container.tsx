import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View } from 'react-native';
import { MenuTopNavigationParams } from '../../../core/navigation/options';
import { MenuContainer } from '../menu.container';
var currentDevice;

export class DeviceViewContainer extends React.Component<NavigationScreenProps> {
    state: {
        device: {};
    }

    static navigationOptions = MenuTopNavigationParams;

    private navigationKey: string = 'DeviceViewContainer';

    componentWillMount() {
        var { navigation } = this.props;
        this.setState({ device: navigation.getParam('user') })
    }

    deviceData() {
        this.props.navigation.navigate({
            key: this.navigationKey,
            routeName: 'Device List',
        });
    }

    render() {
        return (<View >
            <Text onPress={() => this.deviceData()}>{JSON.stringify(this.state.device)}</Text></View >
        );
    }
}


