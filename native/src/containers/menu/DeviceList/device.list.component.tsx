import React from 'react';
import {
  withStyles,
  ThemeType,
  ThemedComponentProps,
} from 'react-native-ui-kitten';
import { LayoutsList } from '../../../../src/components/menu';
import { DeviceData } from './type';

interface ComponentProps {
  data: DeviceData[];
  onItemSelect: (index: number) => void;
}

type Props = ThemedComponentProps & ComponentProps;


class LayoutsComponent extends React.Component<Props> {

  private onItemPress = (index: number) => {
    this.props.onItemSelect(index);
  };

  public render(): React.ReactNode {
    const { themedStyle, data } = this.props;

    return (
      <LayoutsList
        contentContainerStyle={themedStyle.contentContainer}
        data={data}
        onItemPress={this.onItemPress}
      />
    );
  }
}

export const Layouts = withStyles(LayoutsComponent, (theme: ThemeType) => ({
  container: {
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  item: {
    flex: 1,
    height: 160,
    marginHorizontal: 8,
    marginVertical: 8,
  },
}));
