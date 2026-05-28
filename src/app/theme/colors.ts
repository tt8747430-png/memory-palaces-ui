export const lightColors = {
  // Brand Colors
  primary: '#091A7A',
  primaryHover: '#0615a3',
  primaryActive: '#04105c',
  primaryLight: '#ADC8FF',
  primaryDark: '#020938',

  secondary: '#ADC8FF',
  secondaryHover: '#94b5ff',
  secondaryActive: '#7ba1ff',
  secondaryLight: '#e6efff',
  secondaryDark: '#6283cc',

  accent: '#10B981',
  accentHover: '#059669',
  accentActive: '#047857',
  accentLight: '#D1FAE5',
  accentDark: '#065F46',

  // Neutral Colors
  white: '#ffffff',
  gray50: '#fafafa',
  gray100: '#f5f5f5',
  gray200: '#e5e5e5',
  gray300: '#d4d4d4',
  gray400: '#a3a3a3',
  gray500: '#737373',
  gray600: '#525252',
  gray700: '#404040',
  gray800: '#262626',
  gray900: '#171717',
  black: '#000000',

  // Semantic Colors
  success: '#10b981',
  successLight: '#d1fae5',
  successDark: '#065f46',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  warningDark: '#92400e',
  error: '#ef4444',
  errorLight: '#fee2e2',
  errorDark: '#7f1d1d',
  info: '#3b82f6',
  infoLight: '#dbeafe',
  infoDark: '#1e3a8a',

  // Surface Colors
  background: '#ffffff',
  backgroundSubtle: '#fafafa',
  card: '#ffffff',
  cardGlass: 'rgba(255, 255, 255, 0.9)',
  modal: '#ffffff',
  elevated: '#ffffff',
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Text Colors
  textPrimary: '#171717',
  textSecondary: '#525252',
  textTertiary: '#737373',
  textDisabled: '#a3a3a3',
  textOnPrimary: '#ffffff',
  textOnSecondary: '#000000',
  textOnAccent: '#ffffff',

  // Border Colors
  border: '#e5e5e5',
  borderMuted: '#f5f5f5',
  borderStrong: '#d4d4d4',
  borderFocus: '#091A7A',
} as const;

export const darkColors = {
  // Brand Colors (adjusted for dark mode)
  primary: '#ADC8FF',
  primaryHover: '#c4d9ff',
  primaryActive: '#dbeaff',
  primaryLight: '#091A7A',
  primaryDark: '#f2f6ff',

  secondary: '#6283cc',
  secondaryHover: '#7ba1ff',
  secondaryActive: '#94b5ff',
  secondaryLight: '#04105c',
  secondaryDark: '#ADC8FF',

  accent: '#34d399',
  accentHover: '#6ee7b7',
  accentActive: '#a7f3d0',
  accentLight: '#065f46',
  accentDark: '#d1fae5',

  // Neutral Colors (inverted)
  white: '#000000',
  gray50: '#0a0a0a',
  gray100: '#141414',
  gray200: '#1f1f1f',
  gray300: '#2a2a2a',
  gray400: '#525252',
  gray500: '#737373',
  gray600: '#a3a3a3',
  gray700: '#d4d4d4',
  gray800: '#e5e5e5',
  gray900: '#f5f5f5',
  black: '#ffffff',

  // Semantic Colors (adjusted for dark mode)
  success: '#34d399',
  successLight: '#064e3b',
  successDark: '#d1fae5',
  warning: '#fbbf24',
  warningLight: '#78350f',
  warningDark: '#fef3c7',
  error: '#f87171',
  errorLight: '#7f1d1d',
  errorDark: '#fee2e2',
  info: '#60a5fa',
  infoLight: '#1e3a8a',
  infoDark: '#dbeafe',

  // Surface Colors
  background: '#000000',
  backgroundSubtle: '#0a0a0a',
  card: '#0a0a0a',
  cardGlass: 'rgba(10, 10, 10, 0.9)',
  modal: '#141414',
  elevated: '#1f1f1f',
  overlay: 'rgba(255, 255, 255, 0.1)',

  // Text Colors
  textPrimary: '#fafafa',
  textSecondary: '#d4d4d4',
  textTertiary: '#a3a3a3',
  textDisabled: '#525252',
  textOnPrimary: '#000000',
  textOnSecondary: '#ffffff',
  textOnAccent: '#000000',

  // Border Colors
  border: '#2a2a2a',
  borderMuted: '#1f1f1f',
  borderStrong: '#404040',
  borderFocus: '#ADC8FF',
} as const;

export type Colors = typeof lightColors;
