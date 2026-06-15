import type { SxProps, Theme } from '@mui/material/styles';

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

/** Fixed app page root — fills shell, does not scroll itself. */
export const pageRootSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  height: '100%',
  overflow: 'hidden',
};

/** Primary inner scroll region (vertical). */
export const scrollPanelSx: SxProps<Theme> = {
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  ...hideScrollbarSx,
};

/** Horizontal inner scroll (bar/column charts, wide tables). */
export const scrollPanelXsx: SxProps<Theme> = {
  overflowX: 'auto',
  overflowY: 'hidden',
  ...hideScrollbarSx,
};

/** Vertical inner scroll (horizontal bar charts, tall lists). */
export const scrollPanelYsx: SxProps<Theme> = {
  overflowY: 'auto',
  overflowX: 'hidden',
  ...hideScrollbarSx,
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

export function mergeScrollSx(...parts: Array<SxProps<Theme> | undefined>): SxProps<Theme> {
  return parts.filter(Boolean) as SxProps<Theme>;
}
