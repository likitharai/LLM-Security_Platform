// Centralized theme variables for non-Tailwind contexts (like Canvas, Recharts, or JS logic)
export const theme = {
  colors: {
    // Brand colors mapping to Tailwind's indigo
    primary: {
      light: '#e0e7ff', // 100
      main: '#4f46e5',  // 600
      dark: '#312e81',  // 900
    },
    // Status colors mapping to emerald, amber, red
    status: {
      safe: '#10b981',      // Emerald 500
      warning: '#f59e0b',   // Amber 500
      critical: '#ef4444',  // Red 500
      masked: '#6366f1'     // Indigo 500
    },
    // Background and text mapping to slate
    neutral: {
      bg: '#f8fafc',    // 50
      surface: '#ffffff', // white
      border: '#e2e8f0',  // 200
      text: '#0f172a'     // 900
    }
  },
  
  // Recharts specific palette
  chartPalette: ['#10b981', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6'],
  
  // Standard border radiuses
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
  }
};