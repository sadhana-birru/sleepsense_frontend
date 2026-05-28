import { useContext } from 'react';
import { useTheme as useThemeCtx } from '../contexts/ThemeContext';

export function useTheme() {
  return useThemeCtx();
}
