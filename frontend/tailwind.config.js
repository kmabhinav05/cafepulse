/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FCF9F5',
          100: '#F6EFE6', // Warm cream primary base
          200: '#EBDDCB',
          300: '#DFCBB0',
          400: '#D2B794',
        },
        espresso: {
          800: '#4D382B',
          900: '#3B2A20', // Deep espresso primary dark
          950: '#261B14',
        },
        terracotta: {
          400: '#D58265',
          500: '#C46A4A', // Muted terracotta
          600: '#AC5738',
        },
        sage: {
          400: '#A4B79F',
          500: '#8FA68A', // Subtle sage green
          600: '#758D70',
        },
        caramel: {
          400: '#E2B883',
          500: '#D9A66B', // Soft caramel accent
          600: '#C48D4D',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.45)',
          'light-solid': 'rgba(255, 255, 255, 0.75)',
          dark: 'rgba(38, 27, 20, 0.65)',
          'dark-solid': 'rgba(38, 27, 20, 0.85)',
          border: 'rgba(255, 255, 255, 0.35)',
          'border-dark': 'rgba(255, 255, 255, 0.12)',
        }
      },
      fontFamily: {
        sans: ['Inter', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', '"Fraunces"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glass-sm': '0 4px 12px 0 rgba(59, 42, 32, 0.05)',
        'glass-md': '0 8px 30px 0 rgba(59, 42, 32, 0.08), inset 0 1px 1px 0 rgba(255, 255, 255, 0.6)',
        'glass-lg': '0 16px 40px 0 rgba(59, 42, 32, 0.12), inset 0 1px 2px 0 rgba(255, 255, 255, 0.7)',
        'glass-dark': '0 12px 36px 0 rgba(0, 0, 0, 0.45), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '24px',
        '4xl': '32px',
      },
      backdropBlur: {
        xs: '4px',
        '2xl': '24px',
        '3xl': '32px',
      },
      keyframes: {
        'mesh-float': {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -40px) scale(1.08)' },
          '66%': { transform: 'translate(-25px, 20px) scale(0.95)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'mesh-float-1': 'mesh-float 18s ease-in-out infinite',
        'mesh-float-2': 'mesh-float 24s ease-in-out infinite reverse',
        'mesh-float-3': 'mesh-float 20s ease-in-out infinite 4s',
        'fade-in': 'fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
