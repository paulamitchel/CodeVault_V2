/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          'sans-serif',
        ],
      },
      colors: {
        canvas: {
          light: '#FAFAFC',
          dark: '#070714',
        },
        panel: {
          dark: '#0e1026',
        },
        mint: {
          200: '#c8fadc',
        },
      },
      backdropBlur: {
        xl: '24px',
      },
      borderRadius: {
        pill: '999px',
      },
      boxShadow: {
        glass: '0 8px 30px rgb(0,0,0,0.04)',
        'glass-dark': '0 8px 30px rgb(0,0,0,0.4)',
      },
      keyframes: {
        floatAura: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(20px, -30px) scale(1.05)' },
        },
      },
      animation: {
        floatAura: 'floatAura 14s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};