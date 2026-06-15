import { Outlet } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';

export function AdminRoute() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Admin access required
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          This section is only available to administrators.
        </Typography>
        <Button variant="contained" href="/dashboard">
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return <Outlet />;
}
