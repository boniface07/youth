 
import { createTheme } from '@mui/material';

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  palette: {
    primary: {
      main: '#1e40af',
      dark: '#1e3a8a',
      light: '#3b82f6',
    },
    secondary: {
      main: '#c23120',
      light: '#f87171',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
      tertiary: '#ff3d46',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    border: {
      main: '#ff3d46',
      secondary: '#d1d5db',
      light: '#f3f4f6',
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
    fontFamilySecondary: '"Merriweather", "Georgia", serif',
    h1: {
      fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      '@media (min-width:600px)': {
        fontSize: '4rem',
      },
      '@media (min-width:960px)': {
        fontSize: '4.5rem',
      },
    },
    h2: {
      fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: '-0.01em',
      '@media (min-width:600px)': {
        fontSize: '3rem',
      },
      '@media (min-width:960px)': {
        fontSize: '3.5rem',
      },
    },
    h3: {
      fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '0',
      '@media (min-width:600px)': {
        fontSize: '2.25rem',
      },
    },
    h4: {
      fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.35,
      letterSpacing: '0',
      '@media (min-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h5: {
      fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.01em',
      '@media (min-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h6: {
      fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.01em',
      '@media (min-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    body1: {
      fontFamily: '"Merriweather", "Georgia", serif',
      fontSize: '1.1rem',
      fontWeight: 400,
      lineHeight: 1.75,
      letterSpacing: '0.02em',
      '@media (min-width:600px)': {
        fontSize: '1.15rem',
      },
    },
    body2: {
      fontFamily: '"Merriweather", "Georgia", serif',
      fontSize: '0.95rem',
      fontWeight: 400,
      lineHeight: 1.7,
      letterSpacing: '0.02em',
      '@media (min-width:600px)': {
        fontSize: '1rem',
      },
    },
    button: {
      fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0.05em',
      textTransform: 'none',
    },
    caption: {
      fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
      fontSize: '0.85rem',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0.03em',
    },
    subtitle1: {
      fontFamily: '"Merriweather", "Georgia", serif',
      fontSize: '1.15rem',
      fontWeight: 400,
      lineHeight: 1.65,
      letterSpacing: '0.02em',
      '@media (min-width:600px)': {
        fontSize: '1.25rem',
      },
    },
    subtitle2: {
      fontFamily: '"Merriweather", "Georgia", serif',
      fontSize: '0.95rem',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0.02em',
      '@media (min-width:600px)': {
        fontSize: '1rem',
      },
    },
  },
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
    '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
    // Add more as needed
  ],
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    duration: {
      standard: 300,
    },
  },
});