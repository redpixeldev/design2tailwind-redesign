/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.astro",
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      'Recoleta': 'Recoleta',
      'Gordita': 'gordita',
      'Bootstrap': 'bootstrap-icons',
      'Eustache': 'eustacheregular',
      'Noteworthy': 'Noteworthy Light',
      'Awesome': 'FontAwesome',
    },
    container: {
      center: true,
      padding: '12px',
    },
    extend: {
      screens: {
        // Custom breakpoint for small mobile (480px+)
        'xs': '480px',
        // Tailwind defaults are used: sm 640px, md 768px, lg 1024px, xl 1280px, 2xl 1536px
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.container': {
          maxWidth: '100%',
          margin: 'auto',
          '@screen sm': {
            maxWidth: '640px',
            margin: 'auto',
          },
          '@screen md': {
            maxWidth: '720px',
            margin: 'auto',
          },
          '@screen lg': {
            maxWidth: '960px',
            margin: 'auto',
          },
          '@screen xl': {
            maxWidth: '1140px',
            margin: 'auto',
          },
          '@screen 2xl': {
            maxWidth: '1320px',
            margin: 'auto',
          },
        }
      })
    }
  ],
}
