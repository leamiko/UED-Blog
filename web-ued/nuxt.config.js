module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: '用户体验中心',
    meta: [
      { charset: 'utf-8' },
      { name: 'name', content: process.env.npm_package_name || '' },
      { name: 'version', content: process.env.npm_package_version || '' },
      {
        name: 'viewport',
        content:
          'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no'
      },
      {
        name: 'organization',
        content: process.env.npm_package_organization || ''
      },
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
    {
      src: '~/assets/style/element-variables.scss',
      lang: 'scss'
    },
    {
      src: '~/assets/style/reset.scss',
      lang: 'scss'
    },
    {
      src: '~/assets/style/base.scss',
      lang: 'scss'
    },
    // 富文本编辑器样式
    '~/assets/style/quill/quill.core.css',
    // '~/assets/style/quill/quill.bubble.css',
    '~/assets/style/quill/quill.snow.css',
    // 动画
    '~/assets/style/animate.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/element-ui',
    '~/plugins/common.js',
    { src: '~plugins/vue-quill-editor.js', ssr: false }
    // '~/plugins/axios.js'
  ],
  router: {
    // 路由中间件
    middleware: 'auth',
    extendRoutes(routes) {
      // 捕获未知路由，然后统一跳转到404
      routes.push({
        path: '*',
        redirect: '/'
      })
    },
    scrollBehavior: function(to, from, savedPosition) {
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
  modules: ['@nuxtjs/axios', '@nuxtjs/proxy', '@nuxtjs/dotenv'],
  axios: {
    proxy: true, // 表示开启代理
    prefix: '/', // 表示给请求url加个前缀 /api
    // credentials: true // 表示跨域请求时是否需要使用凭证
    progress: false
  },
  /*
   ** Nuxt.js proxy
   */
  // proxy: {
  //   '/api': {
  //     target: 'http://ued.lunz.cn', // 目标接口域名
  //     changeOrigin: true, // 表示是否跨域
  //     pathRewrite: {
  //       '^/api': '/' // 把 /api 替换成 /
  //     }
  //   }
  // },
  // proxy: [
  //   [
  //     '/apis/', //拦截目录
  //     {
  //       target: process.env.BASE_URL, // 代理api主机
  //       pathRewrite: { '^/apis/': '' }
  //     }
  //   ]
  // ],
  /*
   ** 环境配置
   */
  env: {
    NODE_ENV: process.env.NODE_ENV,
    WX_WEB_ID: process.env.WX_WEB_ID,
    WX_WEB_SECRET: process.env.WX_WEB_SECRET,
    WX_APP_ID: process.env.WX_APP_ID,
    WX_APP_SECRET: process.env.WX_APP_SECRET,
    BASE_URL: process.env.BASE_URL,
    DB_URL: process.env.DB_URL
  },
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
