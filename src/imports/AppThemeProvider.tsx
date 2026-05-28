import React, { createContext, useContext, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { lightColors, darkColors } from './colorSchemes';
import { typography } from './typography';
import { spacing } from './spacing';
import { radius } from './radius';
import { elevation } from './elevation';
import { breakpoints } from './breakpoints';
import { motion } from './motion';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: typeof lightColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within AppThemeProvider');
  }
  return context;
};

interface AppThemeProviderProps {
  children: ReactNode;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({
  children,
  isDark = false,
  onToggleTheme = () => {}
}) => {
  const theme = {
    colors: isDark ? darkColors : lightColors,
    typography,
    spacing,
    radius,
    elevation,
    breakpoints,
    motion
  };

  const contextValue = {
    isDark,
    toggleTheme: onToggleTheme,
    colors: theme.colors
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
