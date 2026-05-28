import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  lightColors,
  darkColors,
  typography,
  spacing,
  radius,
  elevation,
  breakpoints,
  motion,
} from '../theme';
import type { DesignTheme } from '../theme';

interface ThemeContextType {
  theme: DesignTheme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: 'light' | 'dark';
}

export function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(() => {
    if (defaultTheme) {
      return defaultTheme === 'dark';
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    return false;
  });

  useEffect(() => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const theme: DesignTheme = {
    colors: isDark ? darkColors : lightColors,
    typography,
    spacing,
    radius,
    elevation,
    breakpoints,
    motion,
  };

  const contextValue: ThemeContextType = {
    theme,
    isDark,
    toggleTheme: () => setIsDark((prev) => !prev),
    setTheme: setIsDark,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
