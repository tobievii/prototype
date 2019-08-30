import React from 'react';
import {
  StyleType,
  ThemeType,
  withStyles,
} from '@kitten/theme';
import { ImageProps, View, TouchableOpacity, } from 'react-native';
import {
  TopNavigation,
  TopNavigationAction,
  TopNavigationActionProps,
  TopNavigationProps,
} from '@kitten/ui';
import { textStyle } from '@src/components/common';
import { SafeAreaView } from './safeAreaView.component';
import { MaterialIcons } from '@expo/vector-icons';

export interface ComponentProps {
  backIcon?: BackIconProp;
  onBackPress?: () => void;
}

export type TopNavigationBarProps = TopNavigationProps & ComponentProps;

type BackIconProp = (style: StyleType) => React.ReactElement<ImageProps>;
type BackButtonElement = React.ReactElement<TopNavigationActionProps>;

class TopNavigationBarComponent extends React.Component<TopNavigationBarProps> {

  private onBackButtonPress = () => {
    if (this.props.onBackPress) {
      this.props.onBackPress();
    }
  };

  private renderBackButton = (source: BackIconProp): BackButtonElement => {
    return (
      <TopNavigationAction
        icon={source}
        onPress={this.onBackButtonPress}
      />
    );
  };

  Control = (control) => {
    if (control == "left") {
      return (<View style={{ flexDirection: 'row' }}>
        <TouchableOpacity style={{ marginRight: 20, opacity: 0.7 }} >
          <MaterialIcons name="add" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={{ opacity: 0.7 }}>
          <MaterialIcons name="search" size={32} color="white" />
        </TouchableOpacity>
      </View>)
    }

    else if (control == "right") {
      return (<View style={{ flexDirection: 'row' }}>
        <TouchableOpacity style={{ marginLeft: 5, opacity: 0.7 }}>
          <MaterialIcons name="person" size={32} color="white" />
        </TouchableOpacity >
        <TouchableOpacity style={{ marginLeft: 5, opacity: 0.7 }} >
          <MaterialIcons name="settings" size={32} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 5, opacity: 0.7 }}>
          <MaterialIcons name="notifications" size={32} color="white" />
        </TouchableOpacity>
      </View>)
    }
  }

  public render(): React.ReactNode {
    const { themedStyle, title, backIcon } = this.props;

    return (
      <SafeAreaView style={themedStyle.safeArea}>
        <TopNavigation
          alignment='center'
          subtitleStyle={textStyle.caption1}
          leftControl={this.Control("left")}
          rightControls={this.Control("right")}
        />
      </SafeAreaView>
    );
  }
}

export const TopNavigationBar = withStyles(TopNavigationBarComponent, (theme: ThemeType) => ({
  safeArea: {
    backgroundColor: theme['background-basic-color-1'],
  },
}));
