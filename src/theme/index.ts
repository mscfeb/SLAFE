import { createTheme, type PaletteMode } from '@mui/material/styles';

export function createAppTheme(mode: PaletteMode) {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#60a5fa' : '#2563eb',
        light: isDark ? '#93c5fd' : '#3b82f6',
        dark: isDark ? '#1d4ed8' : '#1e40af',
      },
      secondary: {
        main: isDark ? '#a78bfa' : '#7c3aed',
      },
      background: {
        default: isDark ? '#0b0f19' : '#f4f6fb',
        paper: isDark ? '#111827' : '#ffffff',
      },
      divider: isDark ? 'rgba(148,163,184,0.12)' : 'rgba(15,23,42,0.08)',
      success: { main: '#22c55e' },
      warning: { main: '#f59e0b' },
      error: { main: '#ef4444' },
      info: { main: '#38bdf8' },
    },
    typography: {
      fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
      h4: { fontWeight: 700, letterSpacing: '-0.02em' },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      subtitle2: { fontWeight: 600, letterSpacing: '0.02em' },
      body2: { fontSize: '0.925rem' },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            height: '100%',
            overflow: 'hidden',
          },
          body: {
            height: '100%',
            overflow: 'hidden',
          },
          '#root': {
            height: '100%',
            overflow: 'hidden',
          },
          '*': {
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          },
          '*::-webkit-scrollbar': {
            display: 'none',
            width: 0,
            height: 0,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 600, borderRadius: 10 },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            border: `1px solid ${isDark ? 'rgba(148,163,184,0.12)' : 'rgba(15,23,42,0.08)'}`,
          },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            fontSize: '0.925rem',
            borderColor: isDark ? 'rgba(148,163,184,0.12)' : 'rgba(15,23,42,0.08)',
          },
          head: {
            fontWeight: 700,
            fontSize: '0.8rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: isDark ? '#cbd5e1' : '#475569',
          },
          body: {
            color: isDark ? '#e2e8f0' : '#1e293b',
          },
        },
      },
      MuiTablePagination: {
        styleOverrides: {
          root: {
            color: isDark ? '#cbd5e1' : '#475569',
            fontSize: '0.875rem',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600, fontSize: '0.8rem' },
        },
      },
    },
  });
}
