import {
  dark,
  light,
} from '@eva-design/eva';
import { default as appTheme } from './appTheme.json';
import { ThemeType } from '@kitten/theme';

interface ThemeRegistry {
  ['Storm Trooper']: ThemeType;
  ['The Dark Side']: ThemeType;
  ['App Theme']: ThemeType;
}

export type ThemeKey = keyof ThemeRegistry;

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
