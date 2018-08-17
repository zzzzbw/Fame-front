// noinspection JSAnnotator
module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Blog',
    titleTemplate: '%s - Fame',
    meta: [
      {charset: 'utf-8'},
      {'http-equiv': 'cleartype', content: 'on'},
      {'http-equiv': 'Cache-Control'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no'},
      {hid: 'description', name: 'description', content: 'A nuxt blog by Fame'},
      {hid: 'keywords', name: 'keywords', content: 'vue, nuxt, java, spring-boot, maven'},
      {name: 'author', content: 'zzzzbw@gmail.com'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ],
    noscript: [
      {innerHTML: 'This website requires JavaScript.'}
    ]
  },
  /*
 ** Global CSS
 */
  css: [
    {src: '~assets/css/main.css'},
    {src: '~assets/css/normalize.css'},
    {src: '~assets/css/github-markdown.css'},
    'highlight.js/styles/darcula.css',
    {src: '~assets/css/icon.css'}
  ],
  plugins: [
    '~/plugins/api.js',
    '~/plugins/global.js',
    '~/plugins/filters.js',
    '~/plugins/highlight.js'
  ],
  router: {
    linkActiveClass: 'active',
    // nuxt 的bug,scrollToTop不生效，要重写scrollBehavior方法
    scrollBehavior: function (to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        let position = {}
        if (to.matched.length < 2) {
          position = {x: 0, y: 0}
        } else if (to.matched.some(r => r.components.default.options.scrollToTop)) {
          position = {x: 0, y: 0}
        }
        if (to.hash) {
          position = {selector: to.hash}
        }
        return position
      }
    }
  },
  /*
  ** Customize the progress bar color
  */
  loading: {color: '#5764c6'},
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
