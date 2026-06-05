<<<<<<< HEAD
const pantone = {
<<<<<<< HEAD
  aquaGray: '#A5B2AA',
  regatta: '#497AB7',
  rinsingRivulet: '#5CC6C3',
  duskyCitron: '#E3CC81',
  cloudDancer: '#F0EFEB',
  stretchLimo: '#2B2C30',
=======
  cloudDancer: '#F1F0EC',
  veiledVista: '#CBE8CE',
  balticSea: '#7BB7DB',
  goldenMist: '#D7CF92',
  quietViolet: '#AA95B0',
  cloudCover: '#9B9697',
  hematite: '#787470',
  blueFusion: '#53687C',
>>>>>>> efbbb1c (han commit)
};
=======
const colorVar = (name) => `rgb(var(--rgb-${name}) / <alpha-value>)`;
>>>>>>> ee8b276 (git commit 2)

const semanticScale = {
  DEFAULT: colorVar('regatta'),
  50: colorVar('cloud-dancer'),
  100: colorVar('veiled-vista'),
  200: colorVar('cloud-cover'),
  300: colorVar('baltic-sea'),
  400: colorVar('baltic-sea'),
  500: colorVar('regatta'),
  600: colorVar('regatta'),
  700: colorVar('blue-fusion'),
  800: colorVar('hematite'),
  900: colorVar('blue-fusion'),
  950: colorVar('blue-fusion'),
};

const neutralScale = {
  50: colorVar('cloud-dancer'),
  100: colorVar('cloud-dancer'),
  200: colorVar('cloud-cover'),
  300: colorVar('cloud-cover'),
  400: colorVar('cloud-cover'),
  500: colorVar('hematite'),
  600: colorVar('hematite'),
  700: colorVar('blue-fusion'),
  800: colorVar('blue-fusion'),
  900: colorVar('blue-fusion'),
  950: colorVar('blue-fusion'),
};

const softScale = {
  50: colorVar('cloud-dancer'),
  100: colorVar('veiled-vista'),
  200: colorVar('veiled-vista'),
  300: colorVar('veiled-vista'),
  400: colorVar('veiled-vista'),
  500: colorVar('veiled-vista'),
  600: colorVar('hematite'),
  700: colorVar('blue-fusion'),
  800: colorVar('blue-fusion'),
  900: colorVar('blue-fusion'),
  950: colorVar('blue-fusion'),
};

const secondaryScale = {
  50: colorVar('cloud-dancer'),
  100: colorVar('cloud-dancer'),
  200: colorVar('baltic-sea'),
  300: colorVar('baltic-sea'),
  400: colorVar('baltic-sea'),
  500: colorVar('baltic-sea'),
  600: colorVar('regatta'),
  700: colorVar('blue-fusion'),
  800: colorVar('blue-fusion'),
  900: colorVar('blue-fusion'),
  950: colorVar('blue-fusion'),
};

const warmScale = {
  50: colorVar('cloud-dancer'),
  100: colorVar('golden-mist'),
  200: colorVar('golden-mist'),
  300: colorVar('golden-mist'),
  400: colorVar('golden-mist'),
  500: colorVar('golden-mist'),
  600: colorVar('hematite'),
  700: colorVar('blue-fusion'),
  800: colorVar('blue-fusion'),
  900: colorVar('blue-fusion'),
  950: colorVar('blue-fusion'),
};

const premiumScale = {
  50: colorVar('cloud-dancer'),
  100: colorVar('quiet-violet'),
  200: colorVar('quiet-violet'),
  300: colorVar('quiet-violet'),
  400: colorVar('quiet-violet'),
  500: colorVar('quiet-violet'),
  600: colorVar('hematite'),
  700: colorVar('blue-fusion'),
  800: colorVar('blue-fusion'),
  900: colorVar('blue-fusion'),
  950: colorVar('blue-fusion'),
};

const cloudScale = {
  50: colorVar('cloud-dancer'),
  100: colorVar('cloud-dancer'),
  200: colorVar('cloud-dancer'),
  300: colorVar('cloud-cover'),
  400: colorVar('cloud-cover'),
  500: colorVar('cloud-cover'),
  600: colorVar('hematite'),
  700: colorVar('hematite'),
  800: colorVar('blue-fusion'),
  900: colorVar('blue-fusion'),
  950: colorVar('blue-fusion'),
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        white: colorVar('cloud-dancer'),
        black: colorVar('blue-fusion'),
        cloud: cloudScale,
        neutral: neutralScale,
        primary: semanticScale,
        ink: semanticScale,
        aqua: softScale,
        regatta: semanticScale,
        rivulet: secondaryScale,
        citron: warmScale,
        violet: premiumScale,
        'cloud-dancer': colorVar('cloud-dancer'),
        'veiled-vista': colorVar('veiled-vista'),
        'baltic-sea': colorVar('baltic-sea'),
        'golden-mist': colorVar('golden-mist'),
        'quiet-violet': colorVar('quiet-violet'),
        'cloud-cover': colorVar('cloud-cover'),
        hematite: colorVar('hematite'),
        'blue-fusion': colorVar('blue-fusion'),
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'Inter', 'sans-serif'],
      },
      lineHeight: {
        heading: '1.2',
        body: '1.5',
      },
      boxShadow: {
        premium: '0 24px 70px rgb(var(--rgb-blue-fusion) / 0.14)',
        'premium-sm': '0 12px 34px rgb(var(--rgb-blue-fusion) / 0.1)',
      },
    },
  },
  plugins: [],
};
