/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf8',
          100: '#ccfbef',
          200: '#99f6de',
          300: '#5ceaca',
          400: '#2dd4ab',
          500: '#14b88e',
          600: '#0d9473',
          700: '#0A4D3E',
          800: '#0a5f4c',
          900: '#064e3b',
          950: '#022c22',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'Inter', 'sans-serif'],
      },
      lineHeight: {
        heading: '1.2',
        body: '1.5',
      },
    },
  },
  plugins: [],
};
