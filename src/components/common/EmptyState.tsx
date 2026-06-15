import { Box, Typography } from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Box
      sx={{
        py: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'text.secondary',
      }}
    >
      <InboxOutlinedIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
      <Typography variant="h6" color="text.primary">
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" sx={{ mt: 1, maxWidth: 360, textAlign: 'center' }}>
          {description}
        </Typography>
      )}
    </Box>
  );
}
