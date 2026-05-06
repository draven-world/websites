/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        ink: {
          50:  '#fafafa',
          100: '#e5e5e5',
          300: '#a3a3a3',
          500: '#737373',
          700: '#262626',
          800: '#1a1a1a',
          900: '#111111',
          950: '#0a0a0a',
        },
        accent: {
          lime: '#c6ff3d',
        },
        // legacy alias - keeps existing brand-* references compiling
        // during migration; deleted in Task 21
        brand: {
          50:  '#fafafa',
          100: '#e5e5e5',
          200: '#262626',
          300: '#a3a3a3',
          400: '#737373',
          500: '#737373',
          600: '#262626',
          700: '#262626',
          800: '#1a1a1a',
          900: '#111111',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: ['var(--font-pp-montreal)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['var(--font-pp-machina)', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'display-xxl': ['clamp(4.5rem, 12vw, 11rem)', { lineHeight: '0.9',  letterSpacing: '-0.04em' }],
        'display-xl':  ['clamp(3rem, 8vw, 7rem)',     { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display':     ['clamp(2rem, 5vw, 4rem)',     { lineHeight: '1.0',  letterSpacing: '-0.025em' }],
        'display-sm':  ['clamp(1.5rem, 3.5vw, 2.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'title':       ['1.25rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'caption':     ['0.75rem', { lineHeight: '1.3', letterSpacing: '0.15em' }],
        'nav':         ['0.8125rem', { lineHeight: '1.0', letterSpacing: '0.18em' }],
      },
      letterSpacing: {
        tightest: '-0.05em',
        tighter: '-0.03em',
        widest: '0.18em',
        wider2: '0.25em',
      },
      maxWidth: {
        container: '1400px',
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'breathe': 'breathe 4s ease-in-out infinite',
        'badge-bounce': 'badge-bounce 0.6s ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'breathe': {
          '0%, 100%': { transform: 'scale(1.0)' },
          '50%':      { transform: 'scale(1.02)' },
        },
        'badge-bounce': {
          '0%':   { transform: 'scale(1.0)' },
          '40%':  { transform: 'scale(1.4)' },
          '100%': { transform: 'scale(1.0)' },
        },
      },
    },
  },
  plugins: [],
}
