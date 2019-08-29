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
  SettingsViewContainer,
  DeviceListContainer,
  FavoritesContainer,
  MenuContainer,
  // DocsContainer,
  SupportContainer,
  DeviceViewContainer,
} from '../../../src/containers/menu';

import {
  ForgotPasswordContainer,
  SignInContainer,
  SignUpContainer,
} from '../../../src/components/auth';

import { MenuNavigationOptions } from './options';

// import { AsyncStorage } from 'react-native'
// var auth;
console.disableYellowBox = true; //set to false to view warnings
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

const SettingsNavigator: NavigationContainer = createStackNavigator(
  {
    ['Settings']: SettingsViewContainer,
  },
  {
    defaultNavigationOptions: MenuNavigationOptions,
  },
);

const DeviceView: NavigationContainer = createStackNavigator(
  {
    ['DeviceView']: DeviceViewContainer,
  },
);

const MenuNavigator: NavigationContainer = createBottomTabNavigator(
  {
    ['Device List']: DeviceListNavigator,
    ['Map View']: MapViewNavigator,
    ['Favorites']: FavoritesNavigator,
    // ['Docs']: DocsNavigator,
    ['Support']: SupportNavigator,
    ['Settings']: SettingsNavigator,
    ['Device']: DeviceView,
  },
  {
    tabBarComponent: MenuContainer,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
);

const AuthNavigationMap: NavigationRouteConfigMap = {
  ['Sign In']: SignInContainer,
  ['Sign Up']: SignUpContainer,
  ['Forgot Password']: ForgotPasswordContainer,
  ['logged']: MenuNavigator,
};

const AppNavigator: NavigationContainer = createStackNavigator(
  {
    ['Home']: SignInContainer,
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

export let Router: NavigationContainer = createAppRouter(AppNavigator);
