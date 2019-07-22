import React from "react";
import { NavigationScreenProps } from "react-navigation";
import { Layouts } from "./device.list.component";
import { DeviceListContainerData } from "./type";
import { routes } from "./routes";

export class DeviceListContainer extends React.Component<NavigationScreenProps> {

  componentDidMount = () => {
    fetch("https://prototype.dev.iotnxt.io/api/v3/states", {
      method: "GET",
      headers: {
        "Authorization": "Basic YXBpOmtleS1iZDBkdXJucDlncDZyenp0azFsNjh5dzl3NHVodXM2OA==",
        "Content-Type": "application/json"
      },
    })
      .then(response => response.json())
      .catch(err => console.error(err.toString()));

  }

  private data: DeviceListContainerData[] = routes;
  private navigationKey: string = "DeviceListContainer";

  private onItemSelect = (index: number) => {
    const { [index]: selectedItem } = this.data;

    this.props.navigation.navigate({
      key: this.navigationKey,
      routeName: selectedItem.route,
    });
  };

  public render(): React.ReactNode {
    return <Layouts data={this.data} onItemSelect={this.onItemSelect} />;
  }
}
