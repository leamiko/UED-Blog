const express = require('express')
var session = require('express-session')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
var web_api = require('./routes/web_api')
var system_api = require('./routes/system_api')
const bodyParser = require('body-parser')

const app = express()
// 自定义跨域中间件
var allowCors = function(req, res, next) {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};

// 使用跨域中间件
app.use(allowCors);
// 使用 session 中间件
app.use(
  session({
    secret: '12345', // 对session id 相关的cookie 进行签名
    name: 'nssid',
    resave: false,
    rolling: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30 // 设置 session 的有效时间，单位毫秒
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

app.use('/web_api', web_api)
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
