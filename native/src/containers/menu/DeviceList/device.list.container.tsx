// TODO Display the data
import React from 'react';
import { NavigationScreenProps } from "react-navigation";
import { any } from 'prop-types';
import { Layouts } from './device.list.component';
import { Text } from 'react-native';
// import { DeviceListContainerData } from "./type";
// import { routes } from "./routes";

export class DeviceListContainer extends React.Component<NavigationScreenProps> {

  state = {
    data: any,
  };

  getDeviceList = async () => {
    // var data = await response.json()
    try {
      const response = await fetch("https://prototype.dev.iotnxt.io/api/v3/states", {
        method: "GET",
        headers: {
          "Authorization": "Basic YXBpOmtleS1iZDBkdXJucDlncDZyenp0azFsNjh5dzl3NHVodXM2OA==",
          "Content-Type": "application/json"
        },
      });
      const data = await response.json();

      this.setState({ data: data });
      // const data = responseJson;
      // console.log(data)
    }
    catch (err) {
      return console.error(err.toString());
    }
    // return responseJson;
  }

  componentDidMount = () => {
    this.getDeviceList();
  }

  // private data: DeviceListContainerData[] = routes;
  private navigationKey: string = "DeviceListContainer";

  // private onItemSelect = (index: number) => {
  //   const { [index]: selectedItem } = this.data;

  //   this.props.navigation.navigate({
  //     key: this.navigationKey,
  //     routeName: selectedItem.route,
  //   });
  // };

  // public render(): React.ReactNode {
  //   return <Text>{this.state.data}</Text>;
  // }

  render = () => <Text>HEllo</Text>;
  // render = () => <Text>{this.state.data}</Text>;
}
