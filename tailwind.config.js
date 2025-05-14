/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './resources/**/*.blade.php',
    './resources/js/**/*.tsx',
    './resources/js/**/*.ts',
    './resources/js/**/*.jsx',
    './resources/js/**/*.js',
  ],
  theme: {
   extend: {
  fontFamily: {
    raleway: ['Raleway', 'sans-serif'],
    coolvetica: ['COOLVETICA-RG', 'sans-serif'],
  },



      colors: {
        primary: '#F49A1A',
        dark: '#000000',
      },
    },
  },
  plugins: [],
};
