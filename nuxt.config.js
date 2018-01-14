module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'fame-front',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: 'The front of Fame blog'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },
  /*
 ** Global CSS
 */
  css: [
    'highlight.js/styles/github.css',
    {src: '~assets/css/main.css'},
    {src: '~assets/css/normalize.css'},
    {src: '~assets/css/markdown-css.css'},
    {src: '~assets/css/icon.css'}
  ],
  plugins: [
    '~/plugins/api.js',
    '~/plugins/global.js',
    '~/plugins/filters.js',
    '~/plugins/highlight.js'
  ],
  /*
  ** Customize the progress bar color
  */
  loading: {color: '#3B8070'},
  /*
  ** Build configuration
  */
  build: {
    vendor: [
      '~/plugins/api.js',
      '~/plugins/global.js',
      '~/plugins/filters.js',
      '~/plugins/highlight.js'
    ],
    extractCSS: true,
    /*
    ** Run ESLint on save
    */
    extend (config, {isDev, isClient}) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
