import { IconButton, Tooltip } from '@mui/material';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import SettingsBrightnessOutlinedIcon from '@mui/icons-material/SettingsBrightnessOutlined';
import { useThemeMode, type ThemePreference } from '@/app/providers/AppProviders';

const LABELS: Record<ThemePreference, string> = {
  light: 'Light mode',
  dark: 'Dark mode',
  system: 'System theme',
};

function ThemeIcon({ preference }: { preference: ThemePreference }) {
  if (preference === 'dark') return <DarkModeOutlinedIcon />;
  if (preference === 'system') return <SettingsBrightnessOutlinedIcon />;
  return <LightModeOutlinedIcon />;
}

export function ThemeToggle() {
  const { themePreference, cycleTheme, resolvedDarkMode } = useThemeMode();

  const detail =
    themePreference === 'system'
      ? ` (currently ${resolvedDarkMode ? 'dark' : 'light'})`
      : '';

  return (
    <Tooltip title={`${LABELS[themePreference]}${detail} — click to change`}>
      <IconButton onClick={cycleTheme} size="small" color="inherit">
        <ThemeIcon preference={themePreference} />
      </IconButton>
    </Tooltip>
  );
}
