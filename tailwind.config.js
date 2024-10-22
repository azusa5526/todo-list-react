/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      height: {
        appbar: 'var(--appbar-height)',
        boardbar: 'var(--boardbar-height)',
      },
    },
  },
  plugins: [],
};
