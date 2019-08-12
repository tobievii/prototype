import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { any } from 'prop-types';
import { Text } from 'react-native';
import { AsyncStorage } from 'react-native';

export class DeviceListContainer extends React.Component<NavigationScreenProps> {

  state = {
    data: any,
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
      console.log(data);
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

  render = () => <Text>
    {JSON.stringify(this.state.data)};
  </Text>
}
