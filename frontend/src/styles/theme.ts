// frontend/src/styles/theme.ts
import { createTheme } from '@mui/material/styles';

// Professional color palette
export const theme = createTheme({
  palette: {
    primary: {
      main: '#1E3A8A', // Deep Blue - Trust, professionalism
      light: '#3B5BA5',
      dark: '#152C6B',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0F766E', // Teal - Growth, reliability
      light: '#2A9D8F',
      dark: '#0A5C55',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#10B981', // Green - Completed/Fixed
      light: '#34D399',
      dark: '#059669',
    },
    warning: {
      main: '#F59E0B', // Orange - Manageable/Pending
      light: '#FBBF24',
      dark: '#D97706',
    },
    error: {
      main: '#DC2626', // Red - Critical
      light: '#EF4444',
      dark: '#B91C1C',
    },
    info: {
      main: '#3B82F6', // Blue - Information
      light: '#60A5FA',
      dark: '#2563EB',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
          borderRadius: 12,
        },
      },
    },
  },
});

// Status colors mapping (from your Excel)
export const statusColors = {
  critical: '#DC2626',
  warning: '#F59E0B',
  good: '#10B981',
  pending: '#6B7280',
  fixed: '#10B981',
  inProgress: '#3B82F6',
};
