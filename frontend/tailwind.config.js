/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F5EBE0', 
        secondary: '#FFB5A7',
        customGreen: {
          light: '#6EE7B7',
          DEFAULT: '#10B981',
          dark: '#047857',
        },
      },
    },
  },
  plugins: [],
}
