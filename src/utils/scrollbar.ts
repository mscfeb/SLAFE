import type { SxProps, Theme } from '@mui/material/styles';

export { hideScrollbarSx, hideScrollbarMdUpSx, pageRootSx, scrollPanelSx, scrollPanelXsx, scrollPanelYsx, panelPaperSx, tableScrollSx, shellMainScrollSx, authPageScrollSx, pageFixedBodySx } from './scroll';

export function inventoryRowSx(
  theme: Theme,
  status: 'understock' | 'optimal' | 'overstock' | 'no_demand',
  current: number,
): SxProps<Theme> {
  const isDark = theme.palette.mode === 'dark';

  if (current === 0) {
    return { bgcolor: isDark ? 'rgba(239, 68, 68, 0.14)' : 'rgba(254, 226, 226, 0.9)' };
  }
  if (status === 'understock') {
    return { bgcolor: isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(254, 226, 226, 0.75)' };
  }
  if (status === 'overstock') {
    return { bgcolor: isDark ? 'rgba(245, 158, 11, 0.12)' : 'rgba(254, 243, 199, 0.85)' };
  }
  return {};
}

export const inventoryTableCellSx: SxProps<Theme> = {
  fontSize: '0.925rem',
  color: 'text.primary',
  py: 1.35,
  borderColor: 'divider',
};

export const inventoryTableHeadSx: SxProps<Theme> = {
  fontSize: '0.8rem',
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: 'text.secondary',
  bgcolor: 'background.paper',
  py: 1.5,
  borderBottom: 2,
  borderColor: 'divider',
};
