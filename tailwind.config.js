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
        stremio: {
          bg: '#0a0812',
          surface: '#120f20',
          card: '#18142b',
          cardHover: '#201b38',
          border: '#2a2448',
          borderLight: '#393260',
          accent: '#7b3fe4',
          accentHover: '#8f55f3',
          accentLight: '#a77bf7',
          pink: '#d946ef',
          muted: '#9490b0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(123, 63, 228, 0.3)',
        'glow': '0 0 25px -5px rgba(123, 63, 228, 0.4)',
        'glow-lg': '0 0 40px -8px rgba(123, 63, 228, 0.5)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
