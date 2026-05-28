export const motion = {
  duration: {
    instant: '0ms',
    fast: '150ms',
    base: '200ms',
    moderate: '300ms',
    slow: '500ms',
  },

  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  transition: {
    fast: 'all 150ms cubic-bezier(0, 0, 0.2, 1)',
    base: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    moderate: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export type Motion = typeof motion;
