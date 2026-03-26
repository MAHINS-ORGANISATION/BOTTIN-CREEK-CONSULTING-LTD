import { Platform } from 'react-native';

/** Deep navy & warm brass — law consultancy, refined */
export const Palette = {
  navy: '#0a1628',
  navyMid: '#132337',
  navySoft: '#1c2d44',
  brass: '#c4a35a',
  brassMuted: '#9a7b3c',
  sapphire: '#2b59c3',
  sapphireSoft: '#e4ebff',
  teal: '#1f8a70',
  rose: '#d96c8b',
  sun: '#f6c453',
  cream: '#f7f4ec',
  creamDark: '#e8e2d4',
  paper: '#fdfcfa',
  /** Warm limestone canvas — main app backdrop (light) */
  canvasLightTop: '#faf7f2',
  canvasLightBottom: '#ebe4d9',
  /** Deep twilight canvas — main app backdrop (dark) */
  canvasDarkTop: '#0e1624',
  canvasDarkBottom: '#06090f',
  ink: '#0d1117',
  inkMuted: '#5c6570',
  success: '#2d6a4f',
  overlay: 'rgba(10, 22, 40, 0.55)',
} as const;

export const Colors = {
  light: {
    text: Palette.ink,
    textSecondary: Palette.inkMuted,
    background: Palette.canvasLightTop,
    backgroundTop: Palette.canvasLightTop,
    backgroundBottom: Palette.canvasLightBottom,
    backgroundElevated: '#fffefb',
    tint: Palette.brass,
    tintDark: Palette.navy,
    icon: Palette.inkMuted,
    tabIconDefault: '#8a9199',
    tabIconSelected: Palette.brass,
    border: 'rgba(10, 22, 40, 0.08)',
    card: '#ffffff',
    cardMuted: '#f3efe8',
    accent: Palette.sapphire,
    accentSoft: Palette.sapphireSoft,
    accentWarm: Palette.sun,
    gradientStart: Palette.navy,
    gradientEnd: Palette.navySoft,
  },
  dark: {
    text: Palette.cream,
    textSecondary: '#a8b0bc',
    background: Palette.canvasDarkTop,
    backgroundTop: Palette.canvasDarkTop,
    backgroundBottom: Palette.canvasDarkBottom,
    backgroundElevated: '#152030',
    tint: Palette.brass,
    tintDark: Palette.cream,
    icon: '#a8b0bc',
    tabIconDefault: '#6b7280',
    tabIconSelected: Palette.brass,
    border: 'rgba(247, 244, 236, 0.1)',
    card: Palette.navyMid,
    cardMuted: Palette.navySoft,
    accent: Palette.rose,
    accentSoft: 'rgba(217, 108, 139, 0.18)',
    accentWarm: Palette.sun,
    gradientStart: '#050a10',
    gradientEnd: Palette.navy,
  },
};

export type ThemeColors = (typeof Colors)['light'] | (typeof Colors)['dark'];

export const Spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
};

export const Fonts = Platform.select({
  ios: {
    display: 'CormorantGaramond_600SemiBold',
    displayBold: 'CormorantGaramond_700Bold',
    sans: 'DMSans_400Regular',
    sansMedium: 'DMSans_500Medium',
    sansBold: 'DMSans_700Bold',
  },
  android: {
    display: 'CormorantGaramond_600SemiBold',
    displayBold: 'CormorantGaramond_700Bold',
    sans: 'DMSans_400Regular',
    sansMedium: 'DMSans_500Medium',
    sansBold: 'DMSans_700Bold',
  },
  default: {
    display: 'CormorantGaramond_600SemiBold',
    displayBold: 'CormorantGaramond_700Bold',
    sans: 'DMSans_400Regular',
    sansMedium: 'DMSans_500Medium',
    sansBold: 'DMSans_700Bold',
  },
  web: {
    display: "'Cormorant Garamond', Georgia, serif",
    displayBold: "'Cormorant Garamond', Georgia, serif",
    sans: "'DM Sans', system-ui, sans-serif",
    sansMedium: "'DM Sans', system-ui, sans-serif",
    sansBold: "'DM Sans', system-ui, sans-serif",
  },
});
