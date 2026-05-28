// Color schemes generated from your design system

export const lightColors = {
  // Brand Colors
  primary: '#4b91e2',
  primaryHover: '#3278c9',
  primaryActive: '#185eaf',
  primaryLight: '#b1f7ff',
  primaryDark: '#004595',
  
  secondary: '#9ab6e5',
  secondaryHover: '#819dcc',
  secondaryActive: '#6783b2',
  secondaryLight: '#ffffff',
  secondaryDark: '#4e6a99',
  
  accent: '#f0f2f5',
  accentHover: '#d7d9dc',
  accentActive: '#bdbfc2',
  accentLight: '#ffffff',
  accentDark: '#a3a5a9',

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
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  error: '#ef4444',
  errorLight: '#fee2e2',
  info: '#3b82f6',
  infoLight: '#dbeafe',

  // Surface Colors
  background: '#ffffff',
  card: '#ffffff',
  modal: '#ffffff',
  elevated: '#ffffff',
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Text Colors
  textPrimary: '#171717',
  textSecondary: '#525252',
  textTertiary: '#737373',
  textDisabled: '#a3a3a3',
  textOnPrimary: '#000000',
  textOnSecondary: '#000000',
  textOnAccent: '#000000',

  // Border Colors
  border: '#e5e5e5',
  borderMuted: '#f5f5f5',
  borderStrong: '#d4d4d4',
  borderFocus: '#4b91e2',
};

export const darkColors = {
  // Brand Colors (same as light for consistency)
  primary: '#4b91e2',
  primaryHover: '#65abfb',
  primaryActive: '#7ec4ff',
  primaryLight: '#185eaf',
  primaryDark: '#7ec4ff',
  
  secondary: '#9ab6e5',
  secondaryHover: '#b3d0ff',
  secondaryActive: '#cde9ff',
  secondaryLight: '#6783b2',
  secondaryDark: '#cde9ff',
  
  accent: '#f0f2f5',
  accentHover: '#ffffff',
  accentActive: '#ffffff',
  accentLight: '#bdbfc2',
  accentDark: '#ffffff',

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
  warning: '#fbbf24',
  warningLight: '#92400e',
  error: '#f87171',
  errorLight: '#7f1d1d',
  info: '#60a5fa',
  infoLight: '#1e3a8a',

  // Surface Colors
  background: '#000000',
  card: '#0a0a0a',
  modal: '#141414',
  elevated: '#1f1f1f',
  overlay: 'rgba(255, 255, 255, 0.1)',

  // Text Colors
  textPrimary: '#fafafa',
  textSecondary: '#d4d4d4',
  textTertiary: '#a3a3a3',
  textDisabled: '#525252',
  textOnPrimary: '#000000',
  textOnSecondary: '#000000',
  textOnAccent: '#000000',

  // Border Colors
  border: '#2a2a2a',
  borderMuted: '#1f1f1f',
  borderStrong: '#404040',
  borderFocus: '#4b91e2',
};

export type Colors = typeof lightColors;
