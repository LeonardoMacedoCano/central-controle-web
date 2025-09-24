import { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { AppTheme, DEFAULT_THEME_SYSTEM } from 'lcano-react-ui';

export const useAppTheme = (): AppTheme => {
  return useContext(ThemeContext) || DEFAULT_THEME_SYSTEM;
};
