/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        spinning: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        growX: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        }
      },
      animation: {
        'spin-slow': 'spinning 3s linear infinite',
        'grow-x': 'growX .25s ease-in-out',
        'infinite-grow-x': 'growX 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
