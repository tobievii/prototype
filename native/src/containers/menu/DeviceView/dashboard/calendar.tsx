import React, { Component } from 'react';
import { Text, Dimensions, AsyncStorage } from 'react-native';
import { ContributionGraph } from 'react-native-chart-kit'
import { url, version } from '../../../../app.component'
const screenWidth = Dimensions.get('window').width
const chartConfig = {
    backgroundGradientFrom: '#262626',
    backgroundGradientTo: '#262626',
    color: (opacity = 1) => `rgba(255, 57, 66, ${opacity})`,
    strokeWidth: 2
}
var data;
var d = new Date();
var year = d.getFullYear();
export class Calendar extends Component {
    state: {
        data;
        packets;
    }

    componentWillMount = () => {
        this.setState({ data: false })
        this.setState({ packet: [] })
        this.example()
    }

    addpackets = (data) => {
        var result = [];
        if (url !== "https://8bo.org") {
            for (var i in data) {
                result.push({ date: data[i].timestamp, count: 0 })
            }
            for (var i in result) {
                for (var r in result) {
                    if (result[i].date.slice(0, 10) == result[r].date.slice(0, 10)) {
                        result[r].count += 1
                    }
                }
            }
            this.setState({ packets: result })
        }
        else {
            for (var i in data) {
                result.push({ date: data[i].day, count: data[i].value })
            }
            this.setState({ packets: result })
        }
        this.setState({ data: true })
    }

    displayCalendar = () => {
        if (this.state.data == true) {
            return (<ContributionGraph
                values={this.state.packets}
                endDate={new Date(year + '-12-31')}
                numDays={365}
                width={screenWidth * 3}
                height={220}
                chartConfig={chartConfig}
                accessor={this.state.packets.timestamp}
            />)
        }
        else {
            return (<Text style={{ color: "white", textAlign: "center" }}>Loading...</Text>)
        }
    }
    example = async () => {
        const user = JSON.parse(await AsyncStorage.getItem('user'));
        try {
            if (url !== "https://8bo.org") {
                const response = await fetch(url + '/api/' + version + '/packets', {
                    method: 'POST',
                    headers: {
                        'Authorization': user.auth,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: this.props['data'].id })
                })
                data = await response.json()
                this.addpackets(data)
            }
            else {
                const response = await fetch(url + '/api/' + version + '/activity', {
                    method: 'POST',
                    headers: {
                        'Authorization': user.auth,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ key: this.props['data'].key })
                })
                data = await response.json()
                this.addpackets(data)
            }
        }
        catch (err) {
            return console.error(err.toString());
        }
    }

    render() {
        return (
            this.displayCalendar())
    }
}