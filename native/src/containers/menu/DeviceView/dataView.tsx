import React, { Component } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Text, View, TouchableHighlight, TouchableOpacity } from 'react-native';

export class DataView extends React.Component {
    state: {
        open;
    }

    componentWillMount() {
        this.setState({ open: "none" })
    }
    open = () => {
        if (this.state.open == "none") {
            this.setState({ open: "" })
        }
    }
    renderData = (data, level, path) => {
        if (data == null) { }
        if (typeof data == "string") {
            return <View ><Text style={{ textAlign: "right", color: "#ccc", marginRight: 5 }}>{data}</Text></View>
        }
        if (typeof data == "number") {
            return <View><Text style={{ textAlign: "right", color: "#15e47a", marginRight: 5 }}>{data}</Text></View>
        }
        if (typeof data == "boolean") {
            if (data == true) {
                return <View style={{ alignItems: 'flex-end' }}><Text style={{ textAlign: "right", color: "#e4c315", marginRight: 5 }}>{data.toString()}</Text></View>
            } else {
                return <View><Text style={{ textAlign: "right", color: "#15b9e4", marginRight: 5 }}>{data.toString()}</Text></View>
            }

        }
        if (typeof data == "object") {
            if (data == null) {
                return <View ><Text style={{ color: "#f77f77" }} >null</Text></View >
            }

            if (Array.isArray(data)) {
                return <View>{this.renderObject(data, level + 1, path)}</View>
            }
            else {
                if (Object.keys(data).length > 1) {
                    return <View >{this.renderObject(data, level + 1, path)}</View>
                } else {
                    return <View >{this.renderObject(data, level + 1, path)}</View>
                }
            }
        }
    }

    renderObject = (data, level, path) => {
        return (
            <View style={{ backgroundColor: "rgba(212, 211, 211,0.1)" }}>
                {Object.keys(data).map((name, i) => {

                    if (typeof data[name] == "object") {
                        return (
                            <View style={{ marginLeft: 24, backgroundColor: "rgba(212, 211, 211,0.3)" }} key={i}>
                                <Text style={{ color: "white" }}>{name}:</Text>
                                <View style={{ display: "" }}>{this.renderData(data[name], level, path + "." + name)}</View>
                            </View>)
                    } else {
                        return (
                            <View style={{ marginLeft: 12 }} key={i}  >
                                <Text style={{ color: "white", flexDirection: 'row' }}>{name}:</Text>
                                <View >{this.renderData(data[name], level, path + "." + name)}</View>
                            </View>)
                    }
                })}
            </View >
        )
    }

    render() {

        if (this.props.data) {
            if (this.props.data.payload) {
                return (
                    <View>
                        {this.renderObject(this.props.data.payload, 0, "root")}
                    </View>
                );
            } else {
                return (
                    <View>
                        {this.renderObject(this.props.data, 0, "root")}
                    </View>
                );
            }
        } else {
            return (<Text>loading..</Text >)
        }

    }
}