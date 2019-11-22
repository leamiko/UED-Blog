const express = require('express')
var session = require('express-session')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
var web_api = require('./routes/web_api')
var system_api = require('./routes/system_api')
var wxapp_api = require('./routes/wxapp_api')
const bodyParser = require('body-parser')
var cors = require('cors')

const app = express()

// 自定义跨域中间件
var allowCors = function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
}

// process.on('unhandledRejection', (reason, p) => {
//   console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
//   // application specific logging, throwing an error, or other logic here
// });

// 使用跨域中间件
app.use(allowCors)

//cors 跨域配置--- 非whitelist无效
var whitelist = ['http://127.0.0.1:3002', 'http://localhost:8081']
var corsOptionsDelegate = function(req, callback) {
  var corsOptions

  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = {
      origin: true
    } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = {
      origin: false
    } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}
app.use(cors(corsOptionsDelegate)) // 非whitelist无效

// 使用 session 中间件
app.use(
  session({
    secret: '12345', // 对session id 相关的cookie 进行签名
    name: 'nssid',
    resave: false,
    rolling: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30 // 设置 session 的有效时间，单位毫秒  30天
    }
    // store: new MongoStore({
    //   url: "mongodb://session:session@localhost:27017/session",
    //   collection: "sessions"
    // })
  })
)

app.use('/static', express.static('static'))

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

require('dotenv').config()

// 前端API
app.use('/web_api', web_api)

// 小程序
app.use('/wxapp_api', wxapp_api)

//判断系统是否登录
var isLogin = function(req, res, next) {
  if (req.headers.referer) {
    if (req.headers.referer.split('/')[3] == 'system') {
      if (req.originalUrl !== '/api/login') {
        if (!req.session.admin) {
          return res.json({
            status_code: 403,
            message: '登录过期，请重新登录！',
            data: null
          })
        } else {
          next()
        }
      } else {
        next()
      }
    } else {
      next()
    }
  } else {
    next()
  }
}
app.use(isLogin)

// 错误处理中间件
app.use((err, req, res, next) => {
  res.send({
    status_code: 201,
    message: err.message
  })
})

// 系统API
app.use('/api', system_api)

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
