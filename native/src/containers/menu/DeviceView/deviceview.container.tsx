import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { TopNavigation } from '@kitten/ui';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { textStyle } from '@src/components/common'
import { Widget } from './dashboard/widget';
import { DataView } from './dashboard/dataView'
export class DeviceViewContainer extends React.Component<NavigationScreenProps> {
    state: {
        device: [];
        dragging: false
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
        return (<View style={{ height: "100%", backgroundColor: '#202020' }}>
            <TopNavigation
                alignment='center'
                title={this.state.device['id'].toString()}
                leftControl={this.Controls("left")}
                titleStyle={textStyle.subtitle}
                rightControls={this.Controls("right")}
                style={{ position: "relative", backgroundColor: "#262626" }}
            ></TopNavigation>
            <ScrollView>
                <ScrollView>
                    <DataView data={this.state.device} />
                </ScrollView >
                <Widget device={this.state.device} />
            </ScrollView >
        </View >
        );
    }
}


