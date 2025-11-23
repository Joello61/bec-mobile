/** @type {import('tailwindcss').Config} */
module.exports = {
  // Important pour NativeWind
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  
  presets: [require('nativewind/preset')],
  
  theme: {
    extend: {
      // Couleurs principales (adaptées de ton globals.css)
      colors: {
        // Couleurs avec support automatique du dark mode via CSS variables
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          dark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
          light: 'rgb(var(--color-primary-light) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary) / <alpha-value>)',
          dark: 'rgb(var(--color-secondary-dark) / <alpha-value>)',
          light: 'rgb(var(--color-secondary-light) / <alpha-value>)',
        },
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        info: 'rgb(var(--color-info) / <alpha-value>)',
        
        // Couleurs sémantiques (changent automatiquement avec le thème)
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        foreground: 'rgb(var(--color-text) / <alpha-value>)',
        muted: 'rgb(var(--color-text-secondary) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        
        // Grays statiques (si vous en avez besoin)
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
      },
      
      // Typographie
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      
      // Border Radius
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        full: '9999px',
      },
      
      // Shadows (supporté par NativeWind avec elevation)
      elevation: {
        sm: 2,
        md: 4,
        lg: 8,
        xl: 12,
      },
      
      // Transitions (durées)
      transitionDuration: {
        fast: '150ms',
        base: '300ms',
        slow: '500ms',
      },
    },
  },
  
  plugins: [],
};