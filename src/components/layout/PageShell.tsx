import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { pageRootSx, scrollPanelSx } from '@/utils/scroll';

interface PageShellProps {
  title: string;
  subtitle?: string;
  toolbar?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  /** When true, children manage their own internal scroll regions (e.g. AI chat). */
  fixedBody?: boolean;
  bodySx?: SxProps<Theme>;
}

export function PageShell({
  title,
  subtitle,
  toolbar,
  header,
  footer,
  children,
  fixedBody = false,
  bodySx,
}: PageShellProps) {
  return (
    <Box sx={pageRootSx}>
      <Typography variant="h4" sx={{ mb: subtitle ? 0.5 : 2, flexShrink: 0 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexShrink: 0 }}>
          {subtitle}
        </Typography>
      )}
      {toolbar && <Box sx={{ mb: 1.5, flexShrink: 0 }}>{toolbar}</Box>}
      {header && <Box sx={{ mb: 2, flexShrink: 0 }}>{header}</Box>}
      <Box
        sx={
          (fixedBody
            ? [{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }, bodySx]
            : [scrollPanelSx, bodySx]) as SxProps<Theme>
        }
      >
        {children}
      </Box>
      {footer && <Box sx={{ flexShrink: 0, mt: 1.5 }}>{footer}</Box>}
    </Box>
  );
}
