import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { toast } from 'react-toastify';

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Uncaught error:', error, info);
    toast.error('An unexpected error occurred.');
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ px: 4, py: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Something went wrong.
          </Typography>
          <Typography variant="body1" gutterBottom>
            {this.state.error?.message || 'Please try refreshing the page.'}
          </Typography>
          <Button variant="contained" onClick={this.handleReload} sx={{ mt: 2 }}>
            Reload
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
