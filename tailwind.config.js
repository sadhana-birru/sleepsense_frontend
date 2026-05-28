/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // SleepSense AI Design Tokens
        midnight: '#ADE1F7', // sky blue background
        'slate-navy': '#FFFFFF', // card background
        'royal-purple': '#57358F', // sidebar deep purple
        'purple-light': '#7D6BDB', // muted indigo accent
        'purple-dark': '#57358F',
        muted: '#334155', // secondary text

        // Legacy charcoal (backward compat)
        charcoal: {
          950: '#57358F',
          900: '#FFFFFF',
          800: '#F0F9FF',
          700: '#E2E8F0',
        },

        // Status colors
        success: '#10B981', // Success Green
        warning: '#F59E0B', // Warning Amber
        danger:  '#EF4444', // Error Red

        // Charts
        chart: {
          sleep:    '#7D6BDB', // Muted Indigo
          emotion:  '#22D3EE', // Cyan
          activity: '#2DD4BF', // Soft Teal
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '20px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'purple': '0 0 30px rgba(109,93,254,0.3)',
        'purple-lg': '0 0 50px rgba(109,93,254,0.4)',
        'glass': '0 8px 32px rgba(0,0,0,0.3)',
      },
      backdropBlur: {
        'glass': '12px',
      },
      animation: {
        'float':        'float 6s ease-in-out infinite',
        'pulse-slow':   'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'waveform':     'waveform 1.2s ease-in-out infinite',
        'shimmer':      'shimmer 2s linear infinite',
        'spin-slow':    'spin 3s linear infinite',
        'ping-slow':    'ping 2s cubic-bezier(0,0,0.2,1) infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-16px)' },
        },
        waveform: {
          '0%,100%': { transform: 'scaleY(0.4)' },
          '50%':     { transform: 'scaleY(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
