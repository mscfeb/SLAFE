import { Paper, TableContainer } from '@mui/material';
import type { ReactNode } from 'react';
import { hideScrollbarSx, panelPaperSx } from '@/utils/scroll';

interface ScrollTablePanelProps {
  children: ReactNode;
  footer?: ReactNode;
}

/** Table area with internal vertical scroll and hidden scrollbar. */
export function ScrollTablePanel({ children, footer }: ScrollTablePanelProps) {
  return (
    <Paper sx={panelPaperSx}>
      <TableContainer
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          ...hideScrollbarSx,
        }}
      >
        {children}
      </TableContainer>
      {footer}
    </Paper>
  );
}
