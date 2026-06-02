const pantone = {
  aquaGray: '#A3ADA8',
  regatta: '#587FBB',
  rinsingRivulet: '#5BC8C6',
  duskyCitron: '#E2CF7A',
  cloudDancer: '#F1F0EC',
  stretchLimo: '#343A3D',
};

const regattaScale = {
  50: '#F2F6FB',
  100: '#E1EAF6',
  200: '#C7D8EF',
  300: '#9FBBE0',
  400: '#789FD0',
  500: '#668DC6',
  600: pantone.regatta,
  700: '#46699D',
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
  300: '#B7C4BE',
  400: pantone.aquaGray,
  500: '#84918C',
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
  300: '#86DCDA',
  400: pantone.rinsingRivulet,
  500: '#37B2B0',
  600: '#2A8F8E',
  700: '#267473',
  800: '#255D5D',
  900: '#234E4E',
  950: '#112E2F',
};

const citronScale = {
  50: '#FCF9E9',
  100: '#F7F0C8',
  200: '#EFE18D',
  300: pantone.duskyCitron,
  400: '#D3B34E',
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
