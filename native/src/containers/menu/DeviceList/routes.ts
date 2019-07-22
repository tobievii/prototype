import { ImageStyle, StyleProp } from "react-native";
import {
  MenuIconAuth,
  MenuIconAuthDark,
} from "../../../../src/assets/icons";
import { ThemeKey, ThemeService } from "../../../../src/core/themes";
import { DeviceListContainerData } from "./type";

export const routes: DeviceListContainerData[] = [
  // {
  //   title: "Auth",
  //   icon: (style: StyleProp<ImageStyle>, theme: ThemeKey) => {
  //     return ThemeService.select(
  //       {
  //         "Storm Trooper": MenuIconAuth(style),
  //         "The Dark Side": MenuIconAuthDark(style)
  //       },
  //       theme
  //     );
  //   },
  //   route: "Auth"
  // },
];
