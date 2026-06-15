import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Box, Button, Typography } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Something went wrong
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            An unexpected error occurred. Please refresh the page.
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}
