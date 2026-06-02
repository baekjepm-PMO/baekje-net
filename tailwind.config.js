const pantone = {
  aquaGray: '#A5B2AA',
  regatta: '#497AB7',
  rinsingRivulet: '#5CC6C3',
  duskyCitron: '#E3CC81',
  cloudDancer: '#F0EEE9',
  stretchLimo: '#2B2C30',
};

const regattaScale = {
  50: '#F2F6FB',
  100: '#E1EAF6',
  200: '#C7D8EF',
  300: '#9FBBE0',
  400: pantone.regatta,
  500: pantone.regatta,
  600: pantone.regatta,
  700: pantone.regatta,
  800: '#39577F',
  900: '#304868',
  950: '#202F44',
};

const neutralScale = {
  50: '#F8F7F3',
  100: '#ECEDE8',
  200: '#DADDD7',
  300: '#C2C9C2',
  400: pantone.aquaGray,
  500: '#7F8A88',
  600: '#646F70',
  700: '#4E585B',
  800: '#42494C',
  900: pantone.stretchLimo,
  950: '#252A2C',
};

const aquaScale = {
  50: '#F4F7F5',
  100: '#E7ECE9',
  200: '#CED8D3',
  300: pantone.aquaGray,
  400: pantone.aquaGray,
  500: pantone.aquaGray,
  600: '#687571',
  700: '#515D59',
  800: '#424B48',
  900: '#38403E',
  950: '#202624',
};

const rivuletScale = {
  50: '#EFFBFA',
  100: '#D7F4F2',
  200: '#B3EAE7',
  300: pantone.rinsingRivulet,
  400: pantone.rinsingRivulet,
  500: pantone.rinsingRivulet,
  600: '#2A8F8E',
  700: '#267473',
  800: '#255D5D',
  900: '#234E4E',
  950: '#112E2F',
};

const citronScale = {
  50: '#FCF9E9',
  100: '#F7F0C8',
  200: pantone.duskyCitron,
  300: pantone.duskyCitron,
  400: pantone.duskyCitron,
  500: '#BD9731',
  600: '#A27627',
  700: '#825723',
  800: '#6D4724',
  900: '#5D3C23',
  950: '#351F11',
};

const cloudScale = {
  50: '#FCFBF8',
  100: '#F8F7F3',
  200: pantone.cloudDancer,
  300: '#E4E3DF',
  400: '#CDCCC7',
  500: '#AAA9A3',
  600: '#85847F',
  700: '#686761',
  800: '#55544F',
  900: '#474640',
  950: '#282722',
};

const inkScale = {
  50: '#F4F5F5',
  100: '#E7E9E9',
  200: '#D1D5D6',
  300: '#B1B8BA',
  400: '#8A9497',
  500: '#6D777A',
  600: '#586164',
  700: '#474F52',
  800: '#3D4447',
  900: pantone.stretchLimo,
  950: '#1E2224',
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        white: pantone.cloudDancer,
        black: pantone.stretchLimo,
        primary: regattaScale,
        neutral: neutralScale,
        aqua: aquaScale,
        regatta: regattaScale,
        rivulet: rivuletScale,
        citron: citronScale,
        cloud: cloudScale,
        ink: inkScale,
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
