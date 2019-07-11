import React from 'react';
import { ImageRequireSource } from 'react-native';
import { NavigationState } from 'react-navigation';
import { mapping } from '@eva-design/eva';
import { ApplicationProvider } from '@kitten/theme';
import { DynamicStatusBar } from '@src/components/common';
import {
  ApplicationLoader,
  Assets,
} from './core/appLoader/applicationLoader.component';
import { Router } from './core/navigation/routes';
import { trackScreenTransition } from './core/utils/analytics';
import { getCurrentStateName } from './core/navigation/util';
import {
  ThemeContext,
  ThemeContextType,
  ThemeKey,
  themes,
  ThemeStore,
} from '@src/core/themes';

const images: ImageRequireSource[] = [

];

const fonts: { [key: string]: number } = {
  'ShareTechMono-Regular': require('./assets/fonts/ShareTechMono-Regular.ttf'),
};

const assets: Assets = {
  images: images,
  fonts: fonts,
};

interface State {
  theme: ThemeKey;
}

export default class App extends React.Component<{}, State> {

  public state: State = {
    theme: 'The Dark Side',
  };

  private onTransitionTrackError = (error: any): void => {
    console.warn('Analytics error: ', error.message);
  };

  private onNavigationStateChange = (prevState: NavigationState, currentState: NavigationState) => {
    const prevStateName: string = getCurrentStateName(prevState);
    const currentStateName: string = getCurrentStateName(currentState);

    if (prevStateName !== currentStateName) {
      trackScreenTransition(currentStateName)
        .catch(this.onTransitionTrackError);
    }
  };

  private onSwitchTheme = (theme: ThemeKey) => {
    ThemeStore.setTheme(theme).then(() => {
      this.setState({ theme });
    });
  };

  public render(): React.ReactNode {
    const contextValue: ThemeContextType = {
      currentTheme: this.state.theme,
      toggleTheme: this.onSwitchTheme,
    };

    return (
      <ApplicationLoader assets={assets}>
        <ThemeContext.Provider value={contextValue}>
          <ApplicationProvider
            mapping={mapping}
            theme={themes[this.state.theme]}>
            <DynamicStatusBar currentTheme={this.state.theme}/>
            <Router onNavigationStateChange={this.onNavigationStateChange}/>
          </ApplicationProvider>
        </ThemeContext.Provider>
      </ApplicationLoader>
    );
  }
}
