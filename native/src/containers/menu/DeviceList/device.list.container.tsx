import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { any } from 'prop-types';
import { AsyncStorage, ScrollView, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements'

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

  render() {
    console.log(this.state.data);
    return (
      <ScrollView>
        {
          this.state.data.map((l, i) => (
            <ListItem
              key={i}
              leftAvatar={{ source: { uri: l.avatar_url } }}
              title={l.id}
            />
          ))
        }
      </ScrollView>
    )
  }
}
