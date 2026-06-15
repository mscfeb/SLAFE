import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Box,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetActiveAlertsQuery } from '@/services/alertsApi';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/hooks/useAppStore';
import { logout } from '@/features/auth/authSlice';
import { DRAWER_WIDTH } from './Sidebar';
import { useThemeMode } from '@/app/providers/AppProviders';

interface TopBarProps {
  onMenuClick: () => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export function TopBar({ onMenuClick, search, onSearchChange }: TopBarProps) {
  const { darkMode, toggleTheme } = useThemeMode();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const { data: alerts } = useGetActiveAlertsQuery({ page: 1, page_size: 1 });

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { md: `${DRAWER_WIDTH}px` },
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <IconButton edge="start" onClick={onMenuClick} sx={{ display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'action.hover',
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            flex: 1,
            maxWidth: 420,
          }}
        >
          <SearchIcon fontSize="small" color="action" />
          <InputBase
            placeholder="Search orders..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{ ml: 1, flex: 1, fontSize: 14 }}
          />
        </Box>

        <Box sx={{ flex: 1 }} />

        <Tooltip title={darkMode ? 'Light mode' : 'Dark mode'}>
          <IconButton onClick={toggleTheme}>
            {darkMode ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
          </IconButton>
        </Tooltip>

        <IconButton onClick={() => navigate('/alerts')}>
          <Badge badgeContent={alerts?.total ?? 0} color="error">
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>

        <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
            {user?.name?.charAt(0) ?? 'U'}
          </Avatar>
        </IconButton>
        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2">{user?.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email} · {user?.role}
            </Typography>
          </Box>
          <MenuItem
            onClick={() => {
              dispatch(logout());
              navigate('/login');
            }}
          >
            Sign out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
