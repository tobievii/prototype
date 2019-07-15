import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { Layouts } from './device.list.component';
import { LayoutsContainerData } from './type';
import { routes } from './routes';

export class DeviceListContainer extends React.Component<NavigationScreenProps> {

  private data: LayoutsContainerData[] = routes;
  private navigationKey: string = 'DeviceListContainer';

  private onItemSelect = (index: number) => {
    const { [index]: selectedItem } = this.data;

    this.props.navigation.navigate({
      key: this.navigationKey,
      routeName: selectedItem.route,
    });
  };

  public render(): React.ReactNode {
    return (
      <Layouts
        data={this.data}
        onItemSelect={this.onItemSelect}
      />
    );
  }
}
