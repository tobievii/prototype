import React from 'react';
import { useScreens } from 'react-native-screens';

import {
  createAppContainer,
  createBottomTabNavigator,
  createStackNavigator,
  NavigationContainer,
  NavigationRouteConfigMap,
} from 'react-navigation';

import {
  MapViewContainer,
  DeviceListContainer,
  FavoritesContainer,
  MenuContainer,
  // DocsContainer,
  SupportContainer,
} from '@src/containers/menu';

import {
  ForgotPasswordContainer,
  SignInContainer,
  SignUpContainer,
} from '@src/components/auth';

import {
  MenuNavigationOptions,
} from './options';

const AuthNavigationMap: NavigationRouteConfigMap = {
  ['Sign In']: SignInContainer,
  ['Sign Up']: SignUpContainer,
  ['Forgot Password']: ForgotPasswordContainer,
};

const DeviceListNavigator: NavigationContainer = createStackNavigator(
  {
    ['Device List']: DeviceListContainer,
  },
  {
    defaultNavigationOptions: MenuNavigationOptions,
  },
);

const MapViewNavigator: NavigationContainer = createStackNavigator(
  {
    ['Map View']: MapViewContainer,
  },
  {
    defaultNavigationOptions: MenuNavigationOptions,
  },
);


const FavoritesNavigator: NavigationContainer = createStackNavigator(
  {
    ['Favorites']: FavoritesContainer,
  },
  {
    defaultNavigationOptions: MenuNavigationOptions,
  },
);

// const DocsNavigator: NavigationContainer = createStackNavigator(
//   {
//     ['Docs']: DocsContainer,
//   },
//   {
//     defaultNavigationOptions: MenuNavigationOptions,
//   },
// );

const SupportNavigator: NavigationContainer = createStackNavigator(
  {
    ['Support']: SupportContainer,
  },
  {
    defaultNavigationOptions: MenuNavigationOptions,
  },
);

const MenuNavigator: NavigationContainer = createBottomTabNavigator(
  {
    ['Device List']: DeviceListNavigator,
    ['Map View']: MapViewNavigator,
    ['Favorites']: FavoritesNavigator,
    // ['Docs']: DocsNavigator,
    ['Support']: SupportNavigator,
  },
  {
    tabBarComponent: MenuContainer,
  },
);

const AppNavigator: NavigationContainer = createStackNavigator(
  {
    ['Home']:
    // SignInContainer,+
    // AuthNavigationMap,
    MenuNavigator,
    ...AuthNavigationMap,
  },
  {
    headerMode: 'screen',
    defaultNavigationOptions: {
      header: null,
    },
  },
);

const createAppRouter = (
  container: NavigationContainer,
): NavigationContainer => {
  useScreens();
  return createAppContainer(container);
};

export const Router: NavigationContainer = createAppRouter(AppNavigator);
