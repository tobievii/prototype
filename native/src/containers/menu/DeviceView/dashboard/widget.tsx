import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View, TouchableHighlight, TouchableOpacity, ScrollView, Picker } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Calendar } from './calendar';

export class Widget extends Component {
    state: {
        showmenu;
        widgetTitle;
        widgetState;
    }

    componentWillMount() {
        this.setState({ showmenu: "none" })
        this.setState({ widgetTitle: "Widget" })
        this.setState({ widgetState: "white" })
    }

    menuState = () => {
        if (this.state.showmenu == null || !this.state.showmenu || this.state.showmenu == "" || this.state.showmenu == undefined) {
            this.setState({ showmenu: "none" })
            this.setState({ widgetState: "white" })
        }
        else {
            this.setState({ showmenu: "" })
            this.setState({ widgetState: "red" })
        }
    }

    widget = () => {
        return (<ScrollView horizontal={true} >
            <Calendar data={this.props['device']} />
        </ScrollView>)
    }

    openMenu = () => {
        if (this.state.showmenu != "none") {
            return (<View style={{ backgroundColor: "black", width: "100%", height: "100%", display: this.state.showmenu }}>
                <Picker style={{ backgroundColor: "black" }} mode="dropdown"
                    onValueChange={(itemValue) =>
                        this.setState({ widgetTitle: itemValue, showmenu: "none", widgetState: "white" })}>
                    <Picker.Item color="grey" label="Calendar" value="Calendar" />
                    <Picker.Item color="grey" label="NivoLine" value="NivoLine" />
                    <Picker.Item color="grey" label="ChartLine" value="ChartLine" />
                    <Picker.Item color="grey" label="Zoomable" value="Zoomable" />
                    <Picker.Item color="grey" label="Blank" value="Blank" />
                    <Picker.Item color="grey" label="ThreeDWidget" value="ThreeDWidget" />
                    <Picker.Item color="grey" label="Gauge" value="Gauge" />
                    <Picker.Item color="grey" label="mesh" value="mesh" />
                    <Picker.Item color="grey" label="map" value="map" />
                    <Picker.Item color="grey" label="form" value="form" />
                    <Picker.Item color="grey" label="schedular" value="schedular" />
                    <Picker.Item color="grey" label="widgetButton" value="widgetButton" />
                    <Picker.Item color="grey" label="chart" value="chart" />
                </Picker>
            </View>)
        }
    }

    render() {
        return (
            <View style={{ backgroundColor: "#262626", width: 375, height: 250 }}>
                <View style={{ backgroundColor: "black", width: "100%", height: 35, flexDirection: "row" }}>
                    <View style={{ width: "50%" }}>
                        <Text style={{ color: "white", fontSize: 25, marginLeft: 10 }}>{this.state.widgetTitle}</Text></View>
                    <View style={{ width: "50%", alignItems: "flex-end" }}>
                        <TouchableHighlight style={{}} onPress={() => this.menuState()}>
                            <Text style={{ backgroundColor: "black", marginRight: 10, height: "100%" }}>
                                <FontAwesome name="wrench" size={25} color={this.state.widgetState} />
                            </Text>
                        </TouchableHighlight>
                    </View>
                </View>
                {this.openMenu()}
                {this.widget()}
            </View >)
    }
}