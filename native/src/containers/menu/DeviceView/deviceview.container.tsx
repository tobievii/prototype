import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View } from 'react-native';
import { ArrowIosBackFill } from '@src/assets/icons';
import { TopNavigationBar } from '../../../core/navigation/components/topNavigationBar.component';
export class DeviceViewContainer extends React.Component<NavigationScreenProps> {
    state: {
        device: {};

    }

    private navigationKey: string = 'DeviceViewContainer';

    componentWillMount() {
        const { navigation } = this.props;
        this.setState({ device: navigation.getParam('user') })
    }

    render() {
        return (<View>
            <Text>{JSON.stringify(this.state.device)}</Text></View >
        );
    }
}


