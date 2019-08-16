import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { any } from 'prop-types';
import { AsyncStorage, ScrollView, StyleSheet, Text, View, FlatList } from 'react-native';
import { CheckBox } from 'react-native-elements'

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

  private navigationKey: string = 'DeviceListContainer';
  renderItem = ({ item }) => {
    return (
      <View style={{ height: 50, width: '100%', borderColor: '#6c757d', borderBottomWidth: 1 }}>
        <Text style={{ color: '#ffffff', marginTop: 15 }}>{item.id}</Text>
      </View>
    );
  }
  render() {
    console.log(this.state.data);
    return (
      <ScrollView style={{ flex: 1, backgroundColor: "#162438" }}>
        <FlatList
          style={{ flex: 1, backgroundColor: "#162438" }}
          data={this.state.data}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={this.renderItem}
        />
      </ScrollView>
    )
  }
}
