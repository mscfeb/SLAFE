export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'sla_ops_theme';

export function getStoredThemePreference(): ThemePreference {
  const value = localStorage.getItem(STORAGE_KEY);
  if (value === 'light' || value === 'dark' || value === 'system') {
    return value;
  }
  return 'system';
}

export function storeThemePreference(preference: ThemePreference) {
  localStorage.setItem(STORAGE_KEY, preference);
}

export function getSystemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function resolveDarkMode(preference: ThemePreference): boolean {
  if (preference === 'system') return getSystemPrefersDark();
  return preference === 'dark';
}

export function cycleThemePreference(current: ThemePreference): ThemePreference {
  if (current === 'light') return 'dark';
  if (current === 'dark') return 'system';
  return 'light';
}
