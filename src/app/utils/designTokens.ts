/**
 * Design System Token Utilities
 * Converts Figma design tokens to runtime-accessible values
 */

export interface ColorToken {
  light: string;
  dark: string;
}

export interface TokenValue {
  light: string | number;
  dark: string | number;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export const buttonTokens = {
  primary: {
    background: {
      light: '#4B91E2',
      dark: '#4B91E2',
    },
    text: {
      light: '#000000',
      dark: '#000000',
    },
    hover: {
      light: '#3278C9',
      dark: '#65ABFB',
    },
  },
  secondary: {
    background: {
      light: '#9AB6E5',
      dark: '#9AB6E5',
    },
    text: {
      light: '#000000',
      dark: '#000000',
    },
  },
  outline: {
    border: {
      light: '#4B91E2',
      dark: '#4B91E2',
    },
  },
  disabled: {
    background: {
      light: '#F5F5F5',
      dark: '#2A2A2A',
    },
    text: {
      light: '#A3A3A3',
      dark: '#525252',
    },
  },
} as const;

export const formTokens = {
  input: {
    background: {
      light: '#FFFFFF',
      dark: '#0A0A0A',
    },
    border: {
      light: '#E5E5E5',
      dark: '#2A2A2A',
    },
    borderFocus: {
      light: '#4B91E2',
      dark: '#4B91E2',
    },
    text: {
      light: '#171717',
      dark: '#FAFAFA',
    },
    placeholder: {
      light: '#737373',
      dark: '#A3A3A3',
    },
  },
  label: {
    text: {
      light: '#404040',
      dark: '#D4D4D4',
    },
  },
  error: {
    text: {
      light: '#EF4444',
      dark: '#F87171',
    },
    border: {
      light: '#EF4444',
      dark: '#F87171',
    },
  },
} as const;

export const cardTokens = {
  background: {
    light: '#FFFFFF',
    dark: '#0A0A0A',
  },
  border: {
    light: '#E5E5E5',
    dark: '#2A2A2A',
  },
  hoverBackground: {
    light: '#FAFAFA',
    dark: '#141414',
  },
  shadow: {
    light: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    dark: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  shadowHover: {
    light: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    dark: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
} as const;

export const navTokens = {
  background: {
    light: '#FFFFFF',
    dark: '#000000',
  },
  border: {
    light: '#E5E5E5',
    dark: '#2A2A2A',
  },
  linkText: {
    light: '#525252',
    dark: '#D4D4D4',
  },
  linkActive: {
    light: '#4B91E2',
    dark: '#4B91E2',
  },
  linkHover: {
    light: '#171717',
    dark: '#FAFAFA',
  },
} as const;

export const modalTokens = {
  background: {
    light: '#FFFFFF',
    dark: '#0A0A0A',
  },
  overlay: {
    light: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.5)',
  },
  shadow: {
    light: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    dark: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  borderRadius: 12,
} as const;

export const alertTokens = {
  primary: {
    background: {
      light: '#FFFFFF',
      dark: '#000016',
    },
    border: {
      light: '#4B91E2',
      dark: '#4B91E2',
    },
    text: {
      light: '#4B91E2',
      dark: '#4B91E2',
    },
    icon: {
      light: '#4B91E2',
      dark: '#4B91E2',
    },
  },
  secondary: {
    background: {
      light: '#FFFFFF',
      dark: '#000019',
    },
    border: {
      light: '#9AB6E5',
      dark: '#9AB6E5',
    },
    text: {
      light: '#9AB6E5',
      dark: '#9AB6E5',
    },
    icon: {
      light: '#9AB6E5',
      dark: '#9AB6E5',
    },
  },
  success: {
    background: {
      light: '#F0FDF4',
      dark: '#052E16',
    },
    border: {
      light: '#10B981',
      dark: '#34D399',
    },
    text: {
      light: '#065F46',
      dark: '#6EE7B7',
    },
    icon: {
      light: '#065F46',
      dark: '#6EE7B7',
    },
  },
  warning: {
    background: {
      light: '#FFFBEB',
      dark: '#78350F',
    },
    border: {
      light: '#F59E0B',
      dark: '#FBC024',
    },
    text: {
      light: '#92400E',
      dark: '#FCD34D',
    },
    icon: {
      light: '#92400E',
      dark: '#FCD34D',
    },
  },
  error: {
    background: {
      light: '#FEF2F2',
      dark: '#7F1D1D',
    },
    border: {
      light: '#EF4444',
      dark: '#F87171',
    },
    text: {
      light: '#DC2626',
      dark: '#FCA5A5',
    },
    icon: {
      light: '#DC2626',
      dark: '#FCA5A5',
    },
  },
  info: {
    background: {
      light: '#EFF6FF',
      dark: '#1E3A8A',
    },
    border: {
      light: '#3B82F6',
      dark: '#60A5FA',
    },
    text: {
      light: '#1D4ED8',
      dark: '#93C5FD',
    },
    icon: {
      light: '#1D4ED8',
      dark: '#93C5FD',
    },
  },
} as const;

export function getToken<T extends ColorToken | TokenValue>(
  token: T,
  theme: 'light' | 'dark' = 'light'
): string {
  return String(token[theme]);
}

export function getCSSVariable(name: string): string {
  return `var(--${name})`;
}
