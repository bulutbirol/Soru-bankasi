/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        line: token('line'),
        fg: token('fg'),
        muted: token('muted'),
        brand: token('brand'),
        'brand-deep': token('brand-deep'),
        'brand-soft': token('brand-soft'),
        'brand-ink': token('brand-ink'),
        sun: token('sun'),
        'sun-deep': token('sun-deep'),
        'sun-soft': token('sun-soft'),
        'sun-ink': token('sun-ink'),
        danger: token('danger'),
        'danger-soft': token('danger-soft'),
        sky: token('sky'),
        'sky-deep': token('sky-deep'),
      },
      fontFamily: {
        display: ['Nunito', 'Segoe UI', 'sans-serif'],
        sans: ['Nunito', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
