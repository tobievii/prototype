import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View, TouchableHighlight, ScrollView, TextInput, AsyncStorage, Alert, Button, TouchableOpacity } from 'react-native';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { Calendar } from './calendar';
import { WidgetButton } from './widgetButton'
import { url, version } from '../../../../app.component'
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

export class Widget extends Component {
    state: {
        showmenu;
        widgetTitle;
        widgetState;
        text;
        buttonText;
    }
    _menu = null;

    componentWillMount() {
        this.setState({ showmenu: "none", widgetTitle: this.props['widget'].type, widgetState: "white", buttonText: this.props['widget'].options.buttonText })
        if (this.props['widget'].type == "widgetButton" || this.props['widget'].type == "button") {
            if (this.props['widget'].options) {
                if (this.props['widget'].options.command) {
                    this.setState({ text: this.props['widget'].options.command })
                }
            }
            else {
                this.setState({ text: JSON.stringify({ "foo": true }) })
            }
        }
    }

    setMenuRef = ref => {
        this._menu = ref;
    };

    hideMenu = () => {
        this._menu.hide();
    };

    showMenu = () => {
        this._menu.show();
    };

    onClick = async () => {
        const user = JSON.parse(await AsyncStorage.getItem('user'));
        try {
            fetch(url + "/api/" + version + "/data/post", {
                method: "POST", headers: { 'Authorization': user.auth, "Accept": "application/json", "Content-Type": "application/json" },
                body: JSON.stringify({ id: this.props['device'].id, data: JSON.parse(this.state.text) })
            }).then(response => response.json()).then(resp => {
                Alert.alert(
                    'Command Sent',
                    this.state.text,
                    [{ text: 'Cancel', onPress: () => console.log(''), style: 'cancel', },
                    { text: 'OK', onPress: () => console.log('') },
                    ],
                    { cancelable: false },
                );
            })
        }
        catch (err) {
            return console.error(err.toString());
        }
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
        var deviceprops =
        {
            data: this.props['device'],
            widget: this.props['widget'],
            onClick: this.onClick,
        }
        if (this.state.widgetTitle == "Calendar" || this.state.widgetTitle == "calendar") {
            return (<ScrollView horizontal={true}  >
                <Calendar {...deviceprops} />
            </ScrollView>)
        }
        else if (this.state.widgetTitle == "widgetButton" || this.state.widgetTitle == "button") {
            return (<View key={this.props['widget'].i} >
                <WidgetButton {...deviceprops} />
            </View>)
        }
        else {
            return (
                <View>
                    <Text style={{ color: "white" }}>Widget has not been created yet...</Text>
                </View>
            )
        }
    }

    showCommandText = async () => {
        for (var widget in this.props['device'].layout) {
            if (this.props['device'].layout[widget].i == this.props['widget'].i) {
                this.props['device'].layout[widget].options.command = this.state.text
            }
        }
        const user = JSON.parse(await AsyncStorage.getItem('user'));
        try {
            fetch(url + "/api/" + version + "/data/post", {
                method: "POST", headers: { 'Authorization': user.auth, "Accept": "application/json", "Content-Type": "application/json" },
                body: JSON.stringify({ key: this.props['device'].key, layout: this.props['device'].layout })
            }).then(response => response.json()).then(resp => {
            })
        }
        catch (err) {
            return console.error(err.toString());
        }
    }

    textinput = () => {
        if (this.state.widgetTitle == "widgetButton" || this.state.widgetTitle == "button") {
            return (
                <View>
                    <View style={{ flexDirection: "row", width: "100%" }}>
                        <View style={{ alignContent: "flex-start" }}><Text style={{ color: "white" }}>Command:</Text></View>
                        <View style={{ alignItems: "flex-end", marginLeft: "60%" }}>
                            <TouchableOpacity onPress={this.showCommandText} >
                                <Text style={{ backgroundColor: "black", color: "white", fontSize: 20 }} >Apply</Text>
                            </TouchableOpacity></View></View>
                    <TextInput
                        placeholder={this.state.text}
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={(text) => this.setState({ text })}
                        value={this.state.text}
                        style={{ height: "50%", backgroundColor: "black", borderColor: "#262626", borderWidth: 5, color: "white" }} />
                </View>
            )
        }
        else return null
    }

    openMenu = () => {
        if (this.state.showmenu !== "none") {
            return (
                <View style={{ backgroundColor: "#262626", width: "100%", height: "100%", display: this.state.showmenu }}>
                    {/* <Picker style={{ backgroundColor: "black", height: "40%", borderWidth: 5, borderColor: "#262626" }} mode="dialog"
                    onValueChange={(itemValue) =>
                        this.setState({ widgetTitle: itemValue })}>
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
                </Picker> */}
                    <Menu
                        ref={this.setMenuRef}
                        button={
                            <Text onPress={this.showMenu} style={{ backgroundColor: "black", color: "white", width: "40%", height: "50%", fontSize: 20 }}>
                                {this.state.widgetTitle}<AntDesign name="caretdown" size={20} color="white" /> </Text>}>
                        <MenuItem onPress={() => { this.hideMenu(), this.setState({ widgetTitle: "Calendar" }), this.menuState() }}>Calendar</MenuItem>
                        <MenuItem onPress={() => { this.hideMenu(), this.setState({ widgetTitle: "widgetButton" }), this.menuState() }}>WidgetButton</MenuItem>
                        <MenuItem onPress={this.hideMenu} disabled>Blank</MenuItem>
                        <MenuDivider />
                        <MenuItem onPress={this.hideMenu}>Coming soon...</MenuItem>
                    </Menu>
                    {this.textinput()}
                </View>)
        }
    }

    render() {
        return (
            <View style={{ backgroundColor: "#262626", width: 375, height: 300 }}>
                <View style={{ backgroundColor: "black", width: "100%", height: 35, flexDirection: "row" }}>
                    <View style={{ width: "50%" }}>
                        <Text style={{ color: "white", fontSize: 25, marginLeft: 10 }}>{this.state.widgetTitle}</Text></View>
                    <View style={{ width: "50%", alignItems: "flex-end" }}>
                        <TouchableHighlight onPress={() => this.menuState()}>
                            <Text style={{ backgroundColor: "black", marginRight: 10, height: "100%" }}>
                                <FontAwesome name="wrench" size={25} color={this.state.widgetState} />
                            </Text>
                        </TouchableHighlight>
                    </View>
                </View>
                {this.openMenu()}
                {this.widget()}
            </View >
        )
    }
}