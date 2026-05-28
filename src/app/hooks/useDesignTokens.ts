import { useMemo } from 'react';
import {
  buttonTokens,
  formTokens,
  cardTokens,
  navTokens,
  modalTokens,
  alertTokens,
  getToken,
} from '../utils/designTokens';

export type ThemeMode = 'light' | 'dark';

export function useTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';

  const isDark =
    window.matchMedia?.('(prefers-color-scheme: dark)').matches ||
    document.documentElement.classList.contains('dark');

  return isDark ? 'dark' : 'light';
}

export function useDesignTokens() {
  const theme = useTheme();

  return useMemo(
    () => ({
      theme,
      button: {
        primary: {
          background: getToken(buttonTokens.primary.background, theme),
          text: getToken(buttonTokens.primary.text, theme),
          hover: getToken(buttonTokens.primary.hover, theme),
        },
        secondary: {
          background: getToken(buttonTokens.secondary.background, theme),
          text: getToken(buttonTokens.secondary.text, theme),
        },
        outline: {
          border: getToken(buttonTokens.outline.border, theme),
        },
        disabled: {
          background: getToken(buttonTokens.disabled.background, theme),
          text: getToken(buttonTokens.disabled.text, theme),
        },
      },
      form: {
        input: {
          background: getToken(formTokens.input.background, theme),
          border: getToken(formTokens.input.border, theme),
          borderFocus: getToken(formTokens.input.borderFocus, theme),
          text: getToken(formTokens.input.text, theme),
          placeholder: getToken(formTokens.input.placeholder, theme),
        },
        label: {
          text: getToken(formTokens.label.text, theme),
        },
        error: {
          text: getToken(formTokens.error.text, theme),
          border: getToken(formTokens.error.border, theme),
        },
      },
      card: {
        background: getToken(cardTokens.background, theme),
        border: getToken(cardTokens.border, theme),
        hoverBackground: getToken(cardTokens.hoverBackground, theme),
        shadow: getToken(cardTokens.shadow, theme),
        shadowHover: getToken(cardTokens.shadowHover, theme),
      },
      nav: {
        background: getToken(navTokens.background, theme),
        border: getToken(navTokens.border, theme),
        linkText: getToken(navTokens.linkText, theme),
        linkActive: getToken(navTokens.linkActive, theme),
        linkHover: getToken(navTokens.linkHover, theme),
      },
      modal: {
        background: getToken(modalTokens.background, theme),
        overlay: getToken(modalTokens.overlay, theme),
        shadow: getToken(modalTokens.shadow, theme),
        borderRadius: modalTokens.borderRadius,
      },
      alert: {
        primary: {
          background: getToken(alertTokens.primary.background, theme),
          border: getToken(alertTokens.primary.border, theme),
          text: getToken(alertTokens.primary.text, theme),
          icon: getToken(alertTokens.primary.icon, theme),
        },
        secondary: {
          background: getToken(alertTokens.secondary.background, theme),
          border: getToken(alertTokens.secondary.border, theme),
          text: getToken(alertTokens.secondary.text, theme),
          icon: getToken(alertTokens.secondary.icon, theme),
        },
        success: {
          background: getToken(alertTokens.success.background, theme),
          border: getToken(alertTokens.success.border, theme),
          text: getToken(alertTokens.success.text, theme),
          icon: getToken(alertTokens.success.icon, theme),
        },
        warning: {
          background: getToken(alertTokens.warning.background, theme),
          border: getToken(alertTokens.warning.border, theme),
          text: getToken(alertTokens.warning.text, theme),
          icon: getToken(alertTokens.warning.icon, theme),
        },
        error: {
          background: getToken(alertTokens.error.background, theme),
          border: getToken(alertTokens.error.border, theme),
          text: getToken(alertTokens.error.text, theme),
          icon: getToken(alertTokens.error.icon, theme),
        },
        info: {
          background: getToken(alertTokens.info.background, theme),
          border: getToken(alertTokens.info.border, theme),
          text: getToken(alertTokens.info.text, theme),
          icon: getToken(alertTokens.info.icon, theme),
        },
      },
    }),
    [theme]
  );
}
