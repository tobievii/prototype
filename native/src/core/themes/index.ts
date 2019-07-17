import {
  dark,
  light,
} from '@eva-design/eva';
import { ThemeType } from 'react-native-ui-kitten';

interface ThemeRegistry {
  ['Storm Trooper']: ThemeType;
  ['The Dark Side']: ThemeType;
  ['App Theme']: ThemeType;
}

export type ThemeKey = keyof ThemeRegistry;
var appTheme = {
  "color-primary-100": "#FFF6F2",
  "color-primary-200": "#FFE1D4",
  "color-primary-300": "#FFBD9E",
  "color-primary-400": "#FF854D",
  "color-primary-500": "#f3353a"
}

export const themes: ThemeRegistry = {
  'Storm Trooper': light,
  'The Dark Side': dark,
  'App Theme': appTheme,
};

export {
  ThemeContext,
  ThemeContextType,
} from './themeContext';

export { ThemeStore } from './theme.store';
export { ThemeService } from './theme.service';
