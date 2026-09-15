/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        cinematic: ['Cinzel', 'Cinzel Decorative', 'Orbitron', 'Cinematic', 'serif', 'sans-serif'],
      },
      colors: {
        gold: {
          300: '#ffe89c',
          400: '#ffd700',
          500: '#e5a93c',
          600: '#c28522',
          700: '#8c590d',
        },
      },
    },
  },
  plugins: [],
}
