import { colors } from './colors';
import { spacing, containerWidth } from './spacing';
import { typography } from './typography';
import { breakpoints, mediaQueries } from './breakpoints';
import { zIndex } from './zIndex';

export const theme = {
  colors,
  spacing,
  containerWidth,
  typography,
  breakpoints,
  mediaQueries,
  zIndex,
} as const;

export type Theme = typeof theme; 