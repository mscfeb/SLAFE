import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { store } from '@/app/store';
import { createAppTheme } from '@/theme';
import { AuthBootstrap } from './AuthBootstrap';
import {
  cycleThemePreference,
  getStoredThemePreference,
  resolveDarkMode,
  storeThemePreference,
  type ThemePreference,
} from './themePreference';

export type { ThemePreference } from './themePreference';

interface ThemeModeContextValue {
  themePreference: ThemePreference;
  resolvedDarkMode: boolean;
  setThemePreference: (preference: ThemePreference) => void;
  cycleTheme: () => void;
  /** @deprecated use resolvedDarkMode */
  darkMode: boolean;
  /** @deprecated use cycleTheme */
  toggleTheme: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue>({
  themePreference: 'system',
  resolvedDarkMode: false,
  setThemePreference: () => undefined,
  cycleTheme: () => undefined,
  darkMode: false,
  toggleTheme: () => undefined,
});

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>(getStoredThemePreference);
  const [systemDark, setSystemDark] = useState(() => resolveDarkMode('system'));

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const resolvedDarkMode = useMemo(() => {
    if (themePreference === 'system') return systemDark;
    return themePreference === 'dark';
  }, [themePreference, systemDark]);

  const setThemePreference = useCallback((preference: ThemePreference) => {
    storeThemePreference(preference);
    setThemePreferenceState(preference);
  }, []);

  const cycleTheme = useCallback(() => {
    setThemePreferenceState((prev) => {
      const next = cycleThemePreference(prev);
      storeThemePreference(next);
      return next;
    });
  }, []);

  const theme = useMemo(
    () => createAppTheme(resolvedDarkMode ? 'dark' : 'light'),
    [resolvedDarkMode],
  );

  const contextValue = useMemo(
    () => ({
      themePreference,
      resolvedDarkMode,
      setThemePreference,
      cycleTheme,
      darkMode: resolvedDarkMode,
      toggleTheme: cycleTheme,
    }),
    [themePreference, resolvedDarkMode, setThemePreference, cycleTheme],
  );

  return (
    <Provider store={store}>
      <ThemeModeContext.Provider value={contextValue}>
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
