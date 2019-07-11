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
  AvatarContainer,
  BottomNavigationContainer,
  ButtonContainer,
  ButtonGroupContainer,
  CheckBoxContainer,
  InputContainer,
  ListContainer,
  OverflowMenuContainer,
  PopoverContainer,
  RadioContainer,
  TabViewContainer,
  TextContainer,
  ToggleContainer,
  TooltipContainer,
  TopNavigationContainer
} from "@src/containers/components";
import {
  MenuNavigationOptions,
} from "./options";
// import { SignIn } from "@src/components/signIn/signIn.component";

const AuthNavigationMap: NavigationRouteConfigMap = {
  ["Sign In"]: SignInContainer,
  ["Sign Up"]: SignUpContainer,
  ["Forgot Password"]: ForgotPasswordContainer
};

const ThemesNavigator: NavigationContainer = createStackNavigator(
  {
    ["Themes"]: ThemesContainer
  },
  {
    defaultNavigationOptions: MenuNavigationOptions
  }
);

const ComponentsNavigator: NavigationContainer = createStackNavigator(
  {
    ["Map View"]: MapViewContainer,
    ["Button"]: ButtonContainer,
    ["Button Group"]: ButtonGroupContainer,
    ["CheckBox"]: CheckBoxContainer,
    ["Toggle"]: ToggleContainer,
    ["Radio"]: RadioContainer,
    ["Input"]: InputContainer,
    ["Text"]: TextContainer,
    ["Avatar"]: AvatarContainer,
    ["Tab View"]: TabViewContainer,
    ["Popover"]: PopoverContainer,
    ["Tooltip"]: TooltipContainer,
    ["Overflow Menu"]: OverflowMenuContainer,
    ["List"]: ListContainer,
    ["Top Navigation"]: TopNavigationContainer,
    ["Bottom Navigation"]: BottomNavigationContainer
  },
  {
    defaultNavigationOptions: MenuNavigationOptions
  }
);

const LayoutsNavigator: NavigationContainer = createStackNavigator(
  {
    ["Device List"]: DeviceListContainer
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
