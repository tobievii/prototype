import React from "react";
import { useScreens } from "react-native-screens";
import {
  createAppContainer,
  createBottomTabNavigator,
  createStackNavigator,
  NavigationContainer,
  NavigationRouteConfigMap
} from "react-navigation";
import {
  MapViewContainer,
  DeviceListContainer,
  MenuContainer,
  ThemesContainer
} from "@src/containers/menu";
import {
  ForgotPasswordContainer,
  SignInContainer,
  SignUpContainer
} from "@src/components/login";
import {
  MenuNavigationOptions,
} from "./options";
// import { SignIn } from "@src/components/signIn/signIn.component";

const AuthNavigationMap: NavigationRouteConfigMap = {
  ["Sign In"]: SignInContainer,
  ["Sign Up"]: SignUpContainer,
  ["Forgot Password"]: ForgotPasswordContainer
};

const LayoutsNavigator: NavigationContainer = createStackNavigator(
  {
    ["Device List"]: DeviceListContainer
  },
  {
    defaultNavigationOptions: MenuNavigationOptions
  }
);

const ComponentsNavigator: NavigationContainer = createStackNavigator(
  {
    ["Map View"]: MapViewContainer,
  },
  {
    defaultNavigationOptions: MenuNavigationOptions
  }
);


const ThemesNavigator: NavigationContainer = createStackNavigator(
  {
    ["Themes"]: ThemesContainer
  },
  {
    defaultNavigationOptions: MenuNavigationOptions
  }
);

const MenuNavigator: NavigationContainer = createBottomTabNavigator(
  {
    ["Layouts"]: LayoutsNavigator,
    ["Components"]: ComponentsNavigator,
    ["Themes"]: ThemesNavigator
  },
  {
    tabBarComponent: MenuContainer
  }
);

const AppNavigator: NavigationContainer = createStackNavigator(
  {
    ["Home"]:
    // SignInContainer,
    MenuNavigator,
    ...AuthNavigationMap,
  },
  {
    headerMode: "screen",
    defaultNavigationOptions: {
      header: null
    }
  }
);

const createAppRouter = (
  container: NavigationContainer
): NavigationContainer => {
  useScreens();
  return createAppContainer(container);
};

export const Router: NavigationContainer = createAppRouter(AppNavigator);
