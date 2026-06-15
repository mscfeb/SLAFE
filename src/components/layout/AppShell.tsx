import { Box, Container } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { shellMainScrollSx } from '@/utils/scroll';

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        height: { xs: '100dvh', md: '100vh' },
        maxHeight: { xs: '100dvh', md: '100vh' },
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        {/* Mobile: extra shell scroll. Desktop: unchanged — inner page scroll only. */}
        <Box sx={shellMainScrollSx}>
          <Container
            maxWidth="xl"
            sx={{
              px: { xs: 2, sm: 3 },
              py: { xs: 2, md: 3 },
              flex: 1,
              minHeight: 0,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                minWidth: 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Outlet />
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
