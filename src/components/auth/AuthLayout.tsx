import { Box, Card, CardContent } from '@mui/material';
import type { ReactNode } from 'react';
import { authPageScrollSx } from '@/utils/scroll';
import { ThemeToggle } from './ThemeToggle';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Box
      sx={{
        ...authPageScrollSx,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
        position: 'relative',
      }}
    >
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
        <ThemeToggle />
      </Box>
      <Card sx={{ width: '100%', maxWidth: 420, my: 2 }}>
        <CardContent sx={{ p: 4 }}>{children}</CardContent>
      </Card>
    </Box>
  );
}
