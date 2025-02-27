/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#06D6A1',
        primaryText: '#1E1F22',
        secondary: '#FFFFFF',
        secondaryText: '#1E1F22',
        background: '#313338',
        backgroundText: '#FFFFFF',
      },
    },
  },
  plugins: [],
};
