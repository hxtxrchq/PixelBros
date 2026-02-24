/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Paleta oficial manual de marca Pixel Bros */
        brand: {
          purple:  '#474192', /* 45% – principal */
          red:     '#e73c50', /* 30% – acento rojo */
          blue:    '#4357a2', /* azul medio */
          navy:    '#1d3e8c', /* azul marino */
          coral:   '#eb5a44', /* coral/naranja */
          sky:     '#5ab3e5', /* azul cielo */
          teal:    '#61bfc0', /* teal */
        },
        primary: '#e73c50',
        bg: '#1a1c52',
        surface: '#1a1c52',
        text: {
          primary: '#111111',
          secondary: '#4B4B4B',
        },
        border: '#E6E6EA',
      },
      fontFamily: {
        display: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'zoom-in': 'zoomIn 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
