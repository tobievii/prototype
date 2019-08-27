import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { AsyncStorage, ScrollView, Text, View, TouchableHighlight } from 'react-native';
import { CheckBox } from 'react-native-elements';
var devices = require('../devices');
export class DeviceListContainer extends React.Component<NavigationScreenProps> {

  state = {
    data: [],
  };

  getDeviceList = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('user'));

    try {
      const response = await fetch('https://prototype.dev.iotnxt.io/api/v3/states', {
        method: 'GET',
        headers: {
          'Authorization': user.auth,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      this.setState({ data: data });
      for (var i in data) {
        if (data[i].data.gps) {
          data[i].data.gps['latitude'] = data[i].data.gps.lat
          data[i].data.gps['longitude'] = data[i].data.gps.lon;
          delete data[i].data.gps.lat
          delete data[i].data.gps.lon
        }
      }
      devices.devices = data
    } catch (err) {
      return console.error(err.toString());
    }
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    this.setState({ user: navigation.getParam('user') });
    this.getDeviceList();
  }

  onCheckChanged(id: any) {
    const data = this.state.data;
    const index = data.findIndex(x => x.id === id);
    data[index].checked = !data[index].checked;
    this.setState(data);
  }

  deviceData() {
    alert('Hold on! Enterprise edition only');
  }

  render() {

    return (<ScrollView style={{ backgroundColor: '#162438' }}>
      {
        this.state.data.map((item, key) =>
          <TouchableHighlight style={{ height: 50, borderColor: '#6c757d', borderBottomWidth: 1 }} key={key}
            onPress={() => this.deviceData()}>
            <View style={{ width: '100%', marginLeft: 10, flexDirection: 'row', marginTop: -2 }} >
              <CheckBox checked={item.checked} checkedColor='limegreen' onPress={() => this.onCheckChanged(item.id)} />
              <Text style={{ width: '70%', color: '#ffffff', marginLeft: 10, marginTop: 15 }} >{item.id}</Text>
            </View>
          </TouchableHighlight >,
        )
      }
    </ScrollView>);
  }
}
