import { createTheme } from '@mui/material/styles';
import typography from './Typography';
import { shadows } from './Shadows';

const baselightTheme = createTheme({
  direction: 'ltr',
  palette: {
    primary: {
      main: '#2E3B55',        
      light: '#5C6F91',       
      dark: '#1C263B',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#D97706',      
      light: '#FCD34D',
      dark: '#B45309',
      contrastText: '#ffffff',
    },
    success: {
      main: '#16A34A',        
      light: '#D1FAE5',
      dark: '#15803D',
      contrastText: '#ffffff',
    },
    info: {
      main: '#2563EB',       
      light: '#DBEAFE',
      dark: '#1D4ED8',
      contrastText: '#ffffff',
    },
    error: {
      main: '#DC2626',         
      light: '#FECACA',
      dark: '#B91C1C',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#F59E0B',       
      light: '#FEF3C7',
      dark: '#B45309',
      contrastText: '#ffffff',
    },
    grey: {
      100: '#F9FAFB',
      200: '#F3F4F6',
      300: '#E5E7EB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
    },
    text: {
      primary: '#1F2937',       
      secondary: '#4B5563', 
    },
    action: {
      disabledBackground: '#E5E7EB',
      hoverOpacity: 0.08,
      hover: '#F3F4F6',
    },
    divider: '#E5E7EB',
    background: {
      default: '#F9FAFB',
      paper: '#ffffff',
    },
  },
  typography,
  shadows,
});

export { baselightTheme };
