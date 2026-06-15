import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetActiveAlertsQuery } from '@/services/alertsApi';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/hooks/useAppStore';
import { logout } from '@/features/auth/authSlice';
import { ThemeToggle } from '@/components/auth/ThemeToggle';

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
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
        width: '100%',
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Toolbar sx={{ gap: 1, justifyContent: 'flex-end' }}>
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{ display: { md: 'none' }, mr: 'auto' }}
        >
          <MenuIcon />
        </IconButton>

        <ThemeToggle />

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
