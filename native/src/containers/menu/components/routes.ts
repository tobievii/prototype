import {
  ImageStyle,
  StyleProp,
} from 'react-native';
import {
  ComponentsIconAvatar,
  ComponentsIconAvatarDark,
  ComponentsIconBottomNavigation,
  ComponentsIconBottomNavigationDark,
  ComponentsIconButton,
  ComponentsIconButtonDark,
  ComponentsIconButtonGroup,
  ComponentsIconButtonGroupDark,
  ComponentsIconCheckBox,
  ComponentsIconCheckBoxDark,
  ComponentsIconInput,
  ComponentsIconInputDark,
  ComponentsIconList,
  ComponentsIconListDark,
  ComponentsIconOverflowMenu,
  ComponentsIconOverflowMenuDark,
  ComponentsIconPopover,
  ComponentsIconPopoverDark,
  ComponentsIconRadio,
  ComponentsIconRadioDark,
  ComponentsIconTabView,
  ComponentsIconTabViewDark,
  ComponentsIconText,
  ComponentsIconTextDark,
  ComponentsIconToggle,
  ComponentsIconToggleDark,
  ComponentsIconTooltip,
  ComponentsIconTooltipDark,
  ComponentsIconTopNavigation,
  ComponentsIconTopNavigationDark,
} from '@src/assets/icons';
import {
  ThemeKey,
  ThemeService,
} from '@src/core/themes';
import { ComponentsContainerData } from './type';

export const routes: ComponentsContainerData[] = [
  {
    title: 'Button',
    icon: (style: StyleProp<ImageStyle>, theme: ThemeKey) => {
      return ThemeService.select({
        'Storm Trooper': ComponentsIconButton(style),
        'The Dark Side': ComponentsIconButtonDark(style),
      }, theme);
    },
    route: 'Button',
  },
  {
    title: 'Button Group',
    icon: (style: StyleProp<ImageStyle>, theme: ThemeKey) => {
      return ThemeService.select({
        'Storm Trooper': ComponentsIconButtonGroup(style),
        'The Dark Side': ComponentsIconButtonGroupDark(style),
      }, theme);
    },
    route: 'Button Group',
  },
  {
    title: 'Checkbox',
    icon: (style: StyleProp<ImageStyle>, theme: ThemeKey) => {
      return ThemeService.select({
        'Storm Trooper': ComponentsIconCheckBox(style),
        'The Dark Side': ComponentsIconCheckBoxDark(style),
      }, theme);
    },
    route: 'CheckBox',
  },
  {
    title: 'Toggle',
    icon: (style: StyleProp<ImageStyle>, theme: ThemeKey) => {
      return ThemeService.select({
        'Storm Trooper': ComponentsIconToggle(style),
        'The Dark Side': ComponentsIconToggleDark(style),
      }, theme);
    },
    route: 'Toggle',
  },
  {
    title: 'Radio',
    icon: (style: StyleProp<ImageStyle>, theme: ThemeKey) => {
      return ThemeService.select({
        'Storm Trooper': ComponentsIconRadio(style),
        'The Dark Side': ComponentsIconRadioDark(style),
      }, theme);
    },
    route: 'Radio',
  },
  {
    title: 'Input',
    icon: (style: StyleProp<ImageStyle>, theme: ThemeKey) => {
      return ThemeService.select({
        'Storm Trooper': ComponentsIconInput(style),
        'The Dark Side': ComponentsIconInputDark(style),
      }, theme);
    },
    route: 'Input',
  },
  {
    title: 'Text',
    icon: (style: StyleProp<ImageStyle>, theme: ThemeKey) => {
      return ThemeService.select({
        'Storm Trooper': ComponentsIconText(style),
        'The Dark Side': ComponentsIconTextDark(style),
      }, theme);
    },
    route: 'Text',
  },
  {
    title: 'Avatar',
    icon: (style: StyleProp<ImageStyle>, theme: ThemeKey) => {
      return ThemeService.select({
        'Storm Trooper': ComponentsIconAvatar(style),
        'The Dark Side': ComponentsIconAvatarDark(style),
      }, theme);
    },
    route: 'Avatar',
  },
  {
    title: 'Popover',
    icon: (style: StyleProp<ImageStyle>, theme: ThemeKey) => {
      return ThemeService.select({
        'Storm Trooper': ComponentsIconPopover(style),
        'The Dark Side': ComponentsIconPopoverDark(style),
      }, theme);
    },
    route: 'Popover',
  },
  {
    title: 'Tooltip',
    icon: (style: StyleProp<ImageStyle>, theme: ThemeKey) => {
      return ThemeService.select({
        'Storm Trooper': ComponentsIconTooltip(style),
        'The Dark Side': ComponentsIconTooltipDark(style),
      }, theme);
    },
    route: 'Tooltip',
  },
  {
    title: 'Overflow Menu',
    icon: (style: StyleProp<ImageStyle>, theme: ThemeKey) => {
      return ThemeService.select({
        'Storm Trooper': ComponentsIconOverflowMenu(style),
        'The Dark Side': ComponentsIconOverflowMenuDark(style),
      }, theme);
    },
    route: 'Overflow Menu',
  },
  {
    title: 'Tab View',
    icon: (style: StyleProp<ImageStyle>, theme: ThemeKey) => {
      return ThemeService.select({
        'Storm Trooper': ComponentsIconTabView(style),
        'The Dark Side': ComponentsIconTabViewDark(style),
      }, theme);
    },
    route: 'Tab View',
  },
  {
    title: 'List',
    icon: (style: StyleProp<ImageStyle>, theme: ThemeKey) => {
      return ThemeService.select({
        'Storm Trooper': ComponentsIconList(style),
        'The Dark Side': ComponentsIconListDark(style),
      }, theme);
    },
    route: 'List',
  },
  {
    title: 'Top Navigation',
    icon: (style: StyleProp<ImageStyle>, theme: ThemeKey) => {
      return ThemeService.select({
        'Storm Trooper': ComponentsIconTopNavigation(style),
        'The Dark Side': ComponentsIconTopNavigationDark(style),
      }, theme);
    },
    route: 'Top Navigation',
  },
  {
    title: 'Bottom Navigation',
    icon: (style: StyleProp<ImageStyle>, theme: ThemeKey) => {
      return ThemeService.select({
        'Storm Trooper': ComponentsIconBottomNavigation(style),
        'The Dark Side': ComponentsIconBottomNavigationDark(style),
      }, theme);
    },
    route: 'Bottom Navigation',
  },
];
