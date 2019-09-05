
module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: '用户体验中心',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'author', content: process.env.npm_package_author || ''},
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    {
      src: '~/assets/style/reset.scss',
      lang: 'scss'
    },
    {
      src: '~/assets/style/element-variables.scss',
      lang: 'scss'
    }
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/element-ui',
    '~/plugins/common.js',
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],
  /*
  ** Nuxt.js proxy
  */
  proxy: {
    // '/api': {
    //   target: 'http://www.xxx.com',
    //   changeOrigin: true,
    //   pathRewrite: {
    //     '^/api ': ''
    //   }
    // }
  },
  /*
  ** 环境配置
  */
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:8400'
  },
  server: {
    port: 8400, // default: 3000
    host: 'localhost', // default: localhost,
  },
  /*
  ** Build configuration
  */
  build: {
    transpile: [/^element-ui/],
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    },
    analyze: {
      analyzerMode: 'static'
    }
  }
}
