/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fafafa',
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#b0b0b0',
          400: '#808080',
          500: '#606060',
          600: '#404040',
          700: '#303030',
          800: '#202020',
          900: '#141414',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: ['var(--font-work-sans)', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3.5rem, 9vw, 7rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display':    ['clamp(2.5rem, 6vw, 4.5rem)', { lineHeight: '1.0',  letterSpacing: '-0.025em' }],
        'display-sm': ['clamp(1.75rem, 4vw, 2.75rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'eyebrow':    ['11px', { lineHeight: '1', letterSpacing: '0.2em' }],
      },
      letterSpacing: {
        tightest: '-0.05em',
        tighter: '-0.03em',
      },
      maxWidth: {
        container: '1400px',
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'letter-rise': 'letter-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
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
        'letter-rise': {
          '0%':   { opacity: '0', transform: 'translateY(0.6em)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
