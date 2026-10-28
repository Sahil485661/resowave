/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          green: '#1DB954',
          'green-hover': '#1ed760',
          base: '#121212',
          surface: '#181818',
          card: '#242424',
          highlight: '#2a2a2a',
          divider: '#282828',
          subtext: '#a7a7a7',
          muted: '#727272',
        },
      },
      fontFamily: {
        sans: ['Circular', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
