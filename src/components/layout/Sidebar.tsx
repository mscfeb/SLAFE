import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '@/utils/constants';
import { useAuth } from '@/hooks/useAuth';

const DRAWER_WIDTH = 260;

const ICONS: Record<string, React.ReactNode> = {
  Dashboard: <DashboardOutlinedIcon />,
  Orders: <ShoppingBagOutlinedIcon />,
  Inventory: <Inventory2OutlinedIcon />,
  Alerts: <NotificationsActiveOutlinedIcon />,
  Analytics: <BarChartOutlinedIcon />,
  AI: <SmartToyOutlinedIcon />,
};

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const { isAdmin } = useAuth();

  const items = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 2.5 }}>
        <Box>
          <Typography variant="subtitle2" color="primary" fontWeight={700}>
            SLA OPS
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Eyewear Operations
          </Typography>
        </Box>
      </Toolbar>
      <List sx={{ px: 1.5, flex: 1 }}>
        {items.map((item) => {
          const active = location.pathname.startsWith(item.path);
          return (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              onClick={isMobile ? onClose : undefined}
              sx={{
                mb: 0.5,
                borderRadius: 2,
                bgcolor: active ? 'action.selected' : 'transparent',
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: active ? 'primary.main' : 'text.secondary' }}>
                {ICONS[item.icon]}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: active ? 600 : 500, fontSize: 14 }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', borderRight: 1, borderColor: 'divider' },
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
}

export { DRAWER_WIDTH };
