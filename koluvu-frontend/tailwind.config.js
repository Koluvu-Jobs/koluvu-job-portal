/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,mdx}",
    "./pages/**/*.{js,jsx,ts,tsx,mdx}",
    "./index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: [
          "Poppins",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        // Primary brand colors
        brand: {
          orange: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#fa7f04', // Main header orange
            600: '#e6720a',
            700: '#c2410c',
            800: '#9a3412',
            900: '#7c2d12',
          },
          green: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981',
            600: '#059669', // Main footer green
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
          }
        }
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-delayed': 'float 3s ease-in-out infinite 1.5s',
        'shimmer': 'shimmer 2s infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(40, 167, 69, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(40, 167, 69, 0.8), 0 0 40px rgba(40, 167, 69, 0.4)' },
        },
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(40, 167, 69, 0.5)',
        'glow-orange': '0 0 20px rgba(250, 127, 4, 0.5)',
      }
    },
  },
  plugins: [],
};
