import React from 'react';
import { SafeAreaView } from '@src/core/navigation';
import {
  ThemeProvider,
  ThemedComponentProps,
  ThemeType,
  withStyles,
} from '@kitten/theme';
import {
  BottomNavigation,
  BottomNavigationTab,
} from '@kitten/ui';
import {
  DeviceList,
  MapView,
  Favorites,
  Documentation,
  Support,
  Settings
} from '@src/assets/icons';
import { themes } from '@src/core/themes';

interface ComponentProps {
  selectedIndex: number;
  onTabSelect: (index: number) => void;
}

type Props = ThemedComponentProps & ComponentProps;

class MenuComponent extends React.Component<Props> {

  private onTabSelect = (index: number) => {
    this.props.onTabSelect(index);
  };

  bottomNav() {
    if (this.props.selectedIndex !== 5) {
      return (<BottomNavigation
        appearance='noIndicator'
        selectedIndex={this.props.selectedIndex}
        onSelect={this.onTabSelect}
        style={{ backgroundColor: "#262626" }}>
        <BottomNavigationTab
          title='Device List'
          icon={DeviceList}
        />
        <BottomNavigationTab
          title='Map View'
          icon={MapView}
        />
        <BottomNavigationTab
          title='Favorites'
          icon={Favorites}
        />
        <BottomNavigationTab
          title='Support'
          icon={Support}
        />
        {/* <BottomNavigationTab
          title='Docs'
          icon={Documentation}
        /> */}
        <BottomNavigationTab
          title='Settings'
          icon={Settings}
        />
      </BottomNavigation>)

    }
    else null
  }

  public render(): React.ReactNode {
    const { selectedIndex, themedStyle } = this.props;


    return (
      <SafeAreaView style={themedStyle.safeAreaContainer}>
        <ThemeProvider theme={{ ...this.props.theme, ...themes['App Theme'] }}>
          {this.bottomNav()}
        </ThemeProvider>
      </SafeAreaView>
    );
  }
}

export const Menu = withStyles(MenuComponent, (theme: ThemeType) => ({
  safeAreaContainer: {
    backgroundColor: theme['background-basic-color-1'],
  },
}));
