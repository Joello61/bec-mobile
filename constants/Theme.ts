import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Colors = {
  // Couleurs principales
  primary: {
    DEFAULT: '#00695c',
    dark: '#004d40',
    light: '#26a69a',
  },
  secondary: {
    DEFAULT: '#ffb300',
    dark: '#ff8f00',
    light: '#ffd54f',
  },
  accent: {
    DEFAULT: '#f4511e',
    dark: '#d84315',
    light: '#ff7043',
  },
  info: {
    DEFAULT: '#0d47a1',
    dark: '#01579b',
    light: '#1976d2',
  },
  
  // Couleurs neutres
  white: '#ffffff',
  gray: {
    50: '#f5f5f5',
    100: '#eeeeee',
    200: '#e0e0e0',
    300: '#bdbdbd',
    400: '#9e9e9e',
    500: '#757575',
    600: '#616161',
    700: '#424242',
    800: '#303030',
    900: '#212121',
  },
  
  // Couleurs sémantiques
  success: '#00695c',
  warning: '#ffb300',
  error: '#f4511e',
  
  // Navigation & Système (Important pour Expo Router)
  light: {
    text: '#212121',
    background: '#ffffff',
    tint: '#00695c', // primary.DEFAULT
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#00695c',
  },
  dark: {
    text: '#ffffff',
    background: '#121212',
    surface: '#1e1e1e',
    tint: '#ffb300', // secondary.DEFAULT
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#ffb300',
  },
};

export const Typography = {
  fontFamily: {
    sans: 'Inter',
    heading: 'Inter',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  }, // TypeScript n'aime pas les nombres ici pour fontWeight, strings only
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 12,
  },
};

export const Transitions = {
  fast: 150,
  base: 300,
  slow: 500,
};

export const Layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  tabBarHeight: 60,
  headerHeight: 56,
};

export default {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  Transitions,
  Layout,
};