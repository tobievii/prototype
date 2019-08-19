import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { any } from 'prop-types';
import { AsyncStorage, ScrollView, StyleSheet, Text, View, FlatList } from 'react-native';
import { CheckBox } from 'react-native-elements';
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

      // tslint:disable-next-line: no-console
    } catch (err) {
      return console.error(err.toString());
    }
  }

  componentDidMount = () => {
    const { navigation } = this.props;
    this.setState({ user: navigation.getParam('user') });
    this.getDeviceList();
  }

  onCheckChanged(id) {
    const data = this.state.data;
    const index = data.findIndex(x => x.id === id);
    data[index].checked = !data[index].checked;
    this.setState(data);
  }

  render() {

    return (<ScrollView style={{ backgroundColor: "#162438" }}>
      {
        this.state.data.map((item, key) =>
          <View style={{ height: 50, borderColor: '#6c757d', borderBottomWidth: 1 }} key={key}>
            <View style={{ width: "100%", marginLeft: 10, flexDirection: 'row' }} >
              <CheckBox checked={item.checked} onPress={() => this.onCheckChanged(item.id)} />
              <Text style={{ width: "70%", color: '#ffffff', marginLeft: 10, marginTop: 15 }} >{item.id}</Text>
            </View>
          </View>
        )
      }
    </ScrollView>)
  }
}
