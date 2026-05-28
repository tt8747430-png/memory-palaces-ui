export { lightColors, darkColors } from './colors';
export type { Colors } from './colors';

export { typography } from './typography';
export type { Typography } from './typography';

export { spacing } from './spacing';
export type { Spacing } from './spacing';

export { radius } from './radius';
export type { Radius } from './radius';

export { elevation } from './elevation';
export type { Elevation } from './elevation';

export { breakpoints } from './breakpoints';
export type { Breakpoints } from './breakpoints';

export { motion } from './motion';
export type { Motion } from './motion';

export interface DesignTheme {
  colors: typeof import('./colors').lightColors;
  typography: typeof import('./typography').typography;
  spacing: typeof import('./spacing').spacing;
  radius: typeof import('./radius').radius;
  elevation: typeof import('./elevation').elevation;
  breakpoints: typeof import('./breakpoints').breakpoints;
  motion: typeof import('./motion').motion;
}
