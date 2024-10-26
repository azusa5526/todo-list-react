/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { roboto: ['Roboto'], 'noto-sans-tc': ['Noto Sans TC'] },
      height: {
        appbar: 'var(--appbar-height)',
        boardbar: 'var(--boardbar-height)',
      },
    },
  },
  plugins: [],
};
