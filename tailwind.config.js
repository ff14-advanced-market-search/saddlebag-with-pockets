/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx,jsx,js}'],
  theme: {
    extend: {
      blue: {
        200: `#4878D9`,
        300: `#3F6ABF`,
        400: '#325599',
        500: `#2E4E8C`,
        600: '#263F73',
        700: `#192A4D`,
        800: '#1D3159',
        900: '#152340'
      },
      animation: {
        shrink: 'shrink 0.2s ease-in 1 normal forwards',
        grow: 'grow 0.2s ease-in 1 normal forwards'
      },
      keyframes: {
        shrink: {
          '0%': {
            transform: 'scaleY(1)',
            opacity: 1,
            height: 'fit-content'
          },
          '70%': {
            opacity: 0,
            transform: 'scaleY(0)'
          },

          '100%': {
            height: '0px',
            transform: 'scaleY(0)'
          }
        },
        grow: {
          '0%': {
            opactiy: 0,
            transform: 'scaleY(0)'
          },
          '30%': {
            opactiy: 0,
            transform: 'scaleY(0)'
          },
          '70%': {
            height: 'fit-content'
          },
          '100%': {
            transform: 'scaleY(1)',
            opacity: 1,
            height: 'fit-content'
          }
        }
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
