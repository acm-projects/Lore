/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#06D6A1',
        secondary: "#B3B3B3",
        primaryText: '#1E1F22',
        secondaryText: '#B3B3B3',
        linkText: '#007aff',
        primaryAccent: "#06D6A1",
        backgroundSecondary: '#1E1F22',
        background: '#313338',
        backgroundText: '#FFFFFF',
        backgroundAccent: '#1E1F22',
        backgroundAccentText: '#FFFFFF',
      },
    },
  },
  plugins: [],
};
