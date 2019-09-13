import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { View, TouchableOpacity, ScrollView, AsyncStorage, Text } from 'react-native';
import { TopNavigation } from '@kitten/ui';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { textStyle } from '@src/components/common'
import { Widget } from './dashboard/widget';
import { DataView } from './dashboard/dataView'
var data;
export class DeviceViewContainer extends React.Component<NavigationScreenProps> {
    state: {
        device: [];
        widgetLayout;
    }
    static navigationOptions = {
        header: null,
    };
    private navigationKey: string = 'DeviceViewContainer';

    componentWillMount() {
        var { navigation } = this.props;
        this.setState({ device: navigation.getParam('user') })
        this.widgetLayoutInfo(navigation.getParam('user'))
    }

    widgetLayoutInfo = async (device) => {
        const user = JSON.parse(await AsyncStorage.getItem('user'));
        try {
            const response = await fetch('https://prototype.dev.iotnxt.io/api/v3/states/full', {
                method: 'GET',
                headers: {
                    'Authorization': user.auth,
                    'Content-Type': 'application/json',
                },
            })
            data = await response.json()
            for (var i in data) {
                if (data[i].devid == device['id']) {
                    this.setState({ widgetLayout: data[i].layout })
                }
            }
        }
        catch (err) {
            return console.error(err.toString());
        }
    }

    widgetDisplay = () => {
        if (this.state.widgetLayout) {
            return (
                this.state.widgetLayout.map((widget, i) => {
                    return (
                        <Widget device={this.state.device} widget={this.state.widgetLayout[i]} key={i} />
                    )
                }
                )
            )
        }
        else
            return (
                <View ><Text style={{ color: "white" }}>No widgets to display.....</Text></View>
            )
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
                {this.widgetDisplay()}
            </ScrollView >
        </View >
        );
    }
}


