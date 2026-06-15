import type { SxProps, Theme } from '@mui/material/styles';

const MD_UP = '@media (min-width:900px)';

/** Hide scrollbar while keeping scroll via wheel, trackpad, or touch. */
export const hideScrollbarSx: SxProps<Theme> = {
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
    width: 0,
    height: 0,
  },
};

/** Hide scrollbars from md breakpoint up; visible on smaller screens for touch affordance. */
export const hideScrollbarMdUpSx: SxProps<Theme> = {
  [MD_UP]: hideScrollbarSx as Record<string, unknown>,
};

/** Touch-friendly momentum scrolling on iOS. */
export const touchScrollSx: SxProps<Theme> = {
  WebkitOverflowScrolling: 'touch',
};

/**
 * Mobile-only shell scroll (below TopBar). Desktop keeps overflow hidden;
 * pages continue to use their own inner scroll regions.
 */
export const shellMainScrollSx: SxProps<Theme> = {
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: { xs: 'auto', md: 'hidden' },
  overscrollBehavior: 'contain',
  ...touchScrollSx,
  ...hideScrollbarMdUpSx,
};

/** Fixed app page root — fills shell, does not scroll itself. */
export const pageRootSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  height: '100%',
  overflow: 'hidden',
  '@media (max-width:899.95px)': {
    // Allow page to grow on mobile so shell scroll can reach content below the fold.
    height: 'auto',
    minHeight: '100%',
    flex: '1 0 auto',
  },
};

/** Primary inner scroll region (vertical). */
export const scrollPanelSx: SxProps<Theme> = {
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  overflow: 'auto',
  ...touchScrollSx,
  ...hideScrollbarMdUpSx,
  '@media (max-width:899.95px)': {
    flex: '1 1 auto',
    minHeight: 'min(50dvh, 420px)',
  },
};

/** Fixed-height body for tables / chat — children manage internal scroll. */
export const pageFixedBodySx: SxProps<Theme> = {
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  '@media (max-width:899.95px)': {
    // Keep table/chat inner scroll on mobile with a usable min height.
    flex: '1 1 auto',
    minHeight: 'min(55dvh, 480px)',
  },
};

/** Horizontal inner scroll (bar/column charts, wide tables). */
export const scrollPanelXsx: SxProps<Theme> = {
  overflowX: 'auto',
  overflowY: 'hidden',
  ...touchScrollSx,
  ...hideScrollbarMdUpSx,
};

/** Vertical inner scroll (horizontal bar charts, tall lists). */
export const scrollPanelYsx: SxProps<Theme> = {
  overflowY: 'auto',
  overflowX: 'hidden',
  ...touchScrollSx,
  ...hideScrollbarMdUpSx,
};

/** Table / panel inner scroll. */
export const tableScrollSx: SxProps<Theme> = {
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  overflow: 'auto',
  ...touchScrollSx,
  ...hideScrollbarMdUpSx,
};

export const panelPaperSx: SxProps<Theme> = {
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  border: 1,
  borderColor: 'divider',
};

/** Auth pages — full viewport scroll. */
export const authPageScrollSx: SxProps<Theme> = {
  minHeight: { xs: '100dvh', md: '100vh' },
  overflow: 'auto',
  ...touchScrollSx,
  ...hideScrollbarMdUpSx,
};

export function mergeScrollSx(...parts: Array<SxProps<Theme> | undefined>): SxProps<Theme> {
  return parts.filter(Boolean) as SxProps<Theme>;
}

export { MD_UP };
