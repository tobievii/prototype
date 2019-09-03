import React from 'react';
import {
  StyleType,
  ThemeType,
  withStyles,
} from '@kitten/theme';
import { ImageProps, View, Text, TouchableOpacity, Platform, TouchableHighlight } from 'react-native';
import {
  TopNavigation,
  TopNavigationAction,
  TopNavigationActionProps,
  TopNavigationProps,
} from '@kitten/ui';
import { textStyle } from '@src/components/common';
import { SafeAreaView } from './safeAreaView.component';
import { MaterialIcons } from '@expo/vector-icons';
import { SearchBar } from 'react-native-elements';
var devices = require('../../../containers/menu/devices');
import { NavigationScreenProps } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';

export interface ComponentProps {
  backIcon?: BackIconProp;
  onBackPress?: () => void;
}

export type TopNavigationBarProps = TopNavigationProps & ComponentProps;

type BackIconProp = (style: StyleType) => React.ReactElement<ImageProps>;
type BackButtonElement = React.ReactElement<TopNavigationActionProps>;

export class TopNavigationBarComponent extends React.Component<TopNavigationBarProps> {
  state: {
    search: ""
    searchbar;
    platform;
    newDeviceList: [];
  }

  componentWillMount() {
    this.setState({ search: "" })
    this.closeSearchBar()
    this.setState({ platform: Platform.OS })
  }

  updateSearch = search => {
    this.setState({ search });
  };

  closeSearchBar = () => {
    this.setState({ searchbar: false })
  }

  openSearchBar = () => {
    this.setState({ searchbar: true })
  }

  deviceData(item: any) {
    this.props.navigation.navigate('DeviceView', { 'user': item });
  }

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
        <TouchableOpacity style={{ opacity: 0.7 }} onPress={() => { this.openSearchBar() }}>
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

  searchList = () => {
    if (this.state.search.length > 0) {
      return (
        devices.devices.map((item, key) =>
          <TouchableHighlight style={{ height: 50, borderColor: '#6c757d', borderBottomWidth: 1 }} key={key} onPress={() => this.deviceData(item)}>
            <View style={{ width: '100%', marginLeft: 10, flexDirection: 'row', marginTop: -2 }} >
              <Text style={{ width: '70%', color: '#ffffff', marginLeft: 10, marginTop: 15 }} >{item.id}</Text>
            </View>
          </TouchableHighlight >
        )
      )
    }
  }

  public render(): React.ReactNode {
    const { themedStyle, title, backIcon } = this.props;

    if (this.state.searchbar == false) {
      return (<SafeAreaView style={themedStyle.safeArea}>
        <TopNavigation
          alignment='center'
          subtitleStyle={textStyle.caption1}
          leftControl={this.Control("left")}
          rightControls={this.Control("right")}
        />
      </SafeAreaView>)
    }
    else {
      return (
        <SafeAreaView style={themedStyle.safeArea}>
          <SearchBar
            placeholder="Type Here..."
            platform={this.state.platform}
            searchIcon={{ name: 'ios-search', color: "white", type: 'ionicon' }}
            cancelIcon={{ name: 'ios-arrow-back', color: "red", type: 'ionicon' }}
            clearIcon={{ name: "ios-close-circle", color: "red", type: 'ionicon' }}
            containerStyle={themedStyle.safeArea}
            inputStyle={{ backgroundColor: 'white' }}
            onChangeText={this.updateSearch}
            value={this.state.search}
            cancelButtonProps={{ color: "red" }}
            onCancel={() => { this.closeSearchBar() }}
          />
          <ScrollView>{this.searchList()}</ScrollView>
        </SafeAreaView>
      );
    }
  }
}

export const TopNavigationBar = withStyles(TopNavigationBarComponent, (theme: ThemeType) => ({
  safeArea: {
    backgroundColor: theme['background-basic-color-1'],
  },
}));
