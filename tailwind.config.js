/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: '#0e2431',
        paper: '#f5f0e6',
        amber: '#f2a93b',
        mint: '#86d7b4',
        coral: '#ee735d',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Manrope', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        lift: '0 18px 55px rgba(14, 36, 49, 0.12)',
      },
    },
  },
  plugins: [],
}
