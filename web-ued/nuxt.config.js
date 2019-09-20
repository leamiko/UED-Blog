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
      { name: 'author', content: process.env.npm_package_author || '' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        src: 'https://cdn.staticfile.org/clipboard.js/2.0.4/clipboard.min.js',
        type: 'text/javascript'
      },
      {
        src: 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js',
        type: 'text/javascript'
      }
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
    },
    {
      src: '~/assets/style/base.scss',
      lang: 'scss'
    }
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/element-ui',
    '~/plugins/common.js'
    // '~/plugins/axios.js'
  ],
  router: {
    // 路由中间件
    middleware: 'auth',
    extendRoutes(routes) {
      // 捕获未知路由，然后统一跳转到404
      routes.push({
        path: '*',
        redirect: '/404'
      })
    },
    scrollBehavior() {
      // 路由跳转，滚动条置顶
      return { x: 0, y: 0 }
    }
  },
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/axios', '@nuxtjs/proxy'],
  /*
   ** Nuxt.js proxy
   */
  proxy: {
    // '/api_nuxt': {
    //   target: process.env.BASE_URL,
    //   changeOrigin: true,
    //   pathRewrite: {
    //     '^/api_nuxt': '/api_nuxt'
    //   }
    // }
  },
  /*
   ** 环境配置
   */
  env: {},
  server: {
    port: 3002, // default: 3000
    host: '127.0.0.1' // default: localhost,
  },
  /*
   ** Build configuration
   */
  build: {
    // 提取css
    extractCSS: true,
    transpile: [/^element-ui/],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      // if (ctx.isDev && ctx.isClient) {
      //   config.module.rules.push({
      //     enforce: 'pre',
      //     test: /\.(js|vue)$/,
      //     loader: 'eslint-loader',
      //     exclude: /(node_modules)/
      //   })
      // }
    },
    analyze: {
      analyzerMode: 'static'
    }
  }
}
