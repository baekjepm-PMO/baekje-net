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

const blueFusionScale = {
  50: pantone.cloudDancer,
  100: pantone.cloudDancer,
  200: pantone.cloudCover,
  300: pantone.balticSea,
  400: pantone.blueFusion,
  500: pantone.blueFusion,
  600: pantone.blueFusion,
  700: pantone.blueFusion,
  800: pantone.hematite,
  900: pantone.blueFusion,
  950: pantone.blueFusion,
};

const neutralScale = {
  50: pantone.cloudDancer,
  100: pantone.cloudDancer,
  200: pantone.cloudCover,
  300: pantone.cloudCover,
  400: pantone.cloudCover,
  500: pantone.hematite,
  600: pantone.hematite,
  700: pantone.blueFusion,
  800: pantone.blueFusion,
  900: pantone.blueFusion,
  950: pantone.blueFusion,
};

const vistaScale = {
  50: pantone.cloudDancer,
  100: pantone.veiledVista,
  200: pantone.veiledVista,
  300: pantone.veiledVista,
  400: pantone.veiledVista,
  500: pantone.veiledVista,
  600: pantone.hematite,
  700: pantone.blueFusion,
  800: pantone.blueFusion,
  900: pantone.blueFusion,
  950: pantone.blueFusion,
};

const balticScale = {
  50: pantone.cloudDancer,
  100: pantone.cloudDancer,
  200: pantone.balticSea,
  300: pantone.balticSea,
  400: pantone.balticSea,
  500: pantone.balticSea,
  600: pantone.blueFusion,
  700: pantone.blueFusion,
  800: pantone.blueFusion,
  900: pantone.blueFusion,
  950: pantone.blueFusion,
};

const mistScale = {
  50: pantone.cloudDancer,
  100: pantone.goldenMist,
  200: pantone.goldenMist,
  300: pantone.goldenMist,
  400: pantone.goldenMist,
  500: pantone.goldenMist,
  600: pantone.hematite,
  700: pantone.blueFusion,
  800: pantone.blueFusion,
  900: pantone.blueFusion,
  950: pantone.blueFusion,
};

const violetScale = {
  50: pantone.cloudDancer,
  100: pantone.quietViolet,
  200: pantone.quietViolet,
  300: pantone.quietViolet,
  400: pantone.quietViolet,
  500: pantone.quietViolet,
  600: pantone.hematite,
  700: pantone.blueFusion,
  800: pantone.blueFusion,
  900: pantone.blueFusion,
  950: pantone.blueFusion,
};

const cloudScale = {
  50: pantone.cloudDancer,
  100: pantone.cloudDancer,
  200: pantone.cloudDancer,
  300: pantone.cloudCover,
  400: pantone.cloudCover,
  500: pantone.cloudCover,
  600: pantone.hematite,
  700: pantone.hematite,
  800: pantone.blueFusion,
  900: pantone.blueFusion,
  950: pantone.blueFusion,
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        white: pantone.cloudDancer,
        black: pantone.blueFusion,
        cloud: cloudScale,
        neutral: neutralScale,
        primary: blueFusionScale,
        ink: blueFusionScale,
        aqua: vistaScale,
        regatta: blueFusionScale,
        rivulet: balticScale,
        citron: mistScale,
        violet: violetScale,
        'cloud-dancer': pantone.cloudDancer,
        'veiled-vista': pantone.veiledVista,
        'baltic-sea': pantone.balticSea,
        'golden-mist': pantone.goldenMist,
        'quiet-violet': pantone.quietViolet,
        'cloud-cover': pantone.cloudCover,
        hematite: pantone.hematite,
        'blue-fusion': pantone.blueFusion,
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'Inter', 'sans-serif'],
      },
      lineHeight: {
        heading: '1.2',
        body: '1.5',
      },
      boxShadow: {
        premium: '0 24px 70px rgb(83 104 124 / 0.14)',
        'premium-sm': '0 12px 34px rgb(83 104 124 / 0.1)',
      },
    },
  },
  plugins: [],
};
