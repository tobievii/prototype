import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View, TouchableOpacity, } from 'react-native';
import { NavigationBar } from 'navigationbar-react-native';
import { MenuTopNavigationParams } from '../../../core/navigation/options';
import { MenuContainer } from '../menu.container';
import {
    TopNavigation,
} from '@kitten/ui';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { textStyle } from '@src/components/common'

export class DeviceViewContainer extends React.Component<NavigationScreenProps> {
    state: {
        device: {};
    }
    static navigationOptions = {
        header: null,
    };
    private navigationKey: string = 'DeviceViewContainer';

    componentWillMount() {
        var { navigation } = this.props;
        this.setState({ device: navigation.getParam('user') })
    }

    Controls = (control) => {
        if (control == "left") {
            return (<View>
                <TouchableOpacity style={{ opacity: 0.7 }} onPress={() => this.props.navigation.goBack(null)}>
                    <Feather name="chevron-left" size={32} color="white" />
                </TouchableOpacity>
            </View>)
        }
        else if (control == "right") {
            return (<View>
                <TouchableOpacity style={{ opacity: 0.7 }} >
                    <MaterialIcons name="save" size={32} color="white" />
                </TouchableOpacity>
            </View>)
        }
    }

    render() {
        return (<View >
            <TopNavigation
                alignment='center'
                title={this.state.device['id'].toString()}
                leftControl={this.Controls("left")}
                titleStyle={textStyle.subtitle}
                rightControls={this.Controls("right")}
            ></TopNavigation>
            <Text>{JSON.stringify(this.state.device)}</Text></View >
        );
    }
}


