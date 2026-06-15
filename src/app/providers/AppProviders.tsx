import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { store } from '@/app/store';
import { createAppTheme } from '@/theme';
import { AuthBootstrap } from './AuthBootstrap';

interface ThemeModeContextValue {
  darkMode: boolean;
  toggleTheme: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue>({
  darkMode: false,
  toggleTheme: () => undefined,
});

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('sla_ops_theme') === 'dark',
  );

  const theme = useMemo(
    () => createAppTheme(darkMode ? 'dark' : 'light'),
    [darkMode],
  );

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('sla_ops_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  return (
    <Provider store={store}>
      <ThemeModeContext.Provider value={{ darkMode, toggleTheme }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <AuthBootstrap />
            {children}
          </SnackbarProvider>
        </ThemeProvider>
      </ThemeModeContext.Provider>
    </Provider>
  );
}
