/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{vue,html}'],
  theme: {
    extend: {
      colors: {
        primary: '#e77a29',
        // 渐变蓝色背景
        gradientBlue: {
          from: '#3D4B60',
          to: '#4B5768',
        },
        normalBlack: '#131414',
        gray: {
          100: '#ECF2F5',
          200: '#DCDFE6',
          300: '#909399',
          400: '#606266',
        },
        algorithm: {
          degreeOnline: '#65AECE',
          betweenessOnline: '#B8AA84',
          closenessOnline: '#CB728D',
          pageRankOnline: '#8BBE6E',
          degreeOffline: '#A482BE',
          betweenessOffline: '#DCAA54',
          closenessOffline: '#E17E7E',
          pageRankOffline: '#97C199',
        },
      },
      fontFamily: {
        DIN: ['D-DIN DIN'],
      },
      fontSize: {
        sm: '.75rem',
        md: '.875rem',
        base: '1rem',
        lg: '1.125rem',
      },
    },
  },
};
