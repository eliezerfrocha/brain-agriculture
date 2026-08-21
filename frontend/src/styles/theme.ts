export const theme = {
  colors: {
    background: '#f5f5f7',
    surface: '#ffffff',
    surfaceTranslucent: 'rgba(255, 255, 255, 0.72)',
    sidebar: 'rgba(246, 246, 248, 0.8)',
    border: 'rgba(0, 0, 0, 0.08)',
    borderStrong: 'rgba(0, 0, 0, 0.12)',
    text: '#1d1d1f',
    textMuted: '#6e6e73',
    primary: '#0071e3',
    primaryHover: '#0077ed',
    primaryActive: '#006edb',
    primarySoft: 'rgba(0, 113, 227, 0.1)',
    danger: '#ff3b30',
    dangerBg: 'rgba(255, 59, 48, 0.1)',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '18px',
    pill: '980px',
  },
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.04)',
    md: '0 8px 24px rgba(0, 0, 0, 0.08)',
    lg: '0 16px 48px rgba(0, 0, 0, 0.12)',
  },
  chartColors: ['#0071e3', '#34c759', '#ff9500', '#ff3b30', '#af52de', '#5ac8fa'],
  font: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif`,
};

export type Theme = typeof theme;
