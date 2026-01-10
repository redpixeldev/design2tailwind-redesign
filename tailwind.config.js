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
        // Legacy Bootstrap-style breakpoints (to be removed gradually)
        '2xl': {
          'min': '1200px',
          'max': '1399px'
        },
        'xxl': {
          'min': '1536px',
        },
        'xl': {
          'min': '1200px',
        },
        'lg': {
          'min': '992px',
          'max': '1199.98px'
        },
        'md': {
          'min': '768px',
          'max': '991.98px'
        },
        'sm': {
          'min': '576px',
          'max': '767.98px'
        },
        'xsm': {
          'max': '575.98px'
        },
        // Custom mobile-first breakpoint for small mobile
        'xs': '480px',
      },
    },
  },
  plugins: [
    function ({
    addComponents
  })

	 {
    addComponents({
      '.container': {
        maxWidth: '100%',
				margin: 'auto',
        '@screen sm': {
          maxWidth: '540px',
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
        '@screen xxl': {
          maxWidth: '1320px',
					margin: 'auto',
        },
      }
    })
  }],
}
