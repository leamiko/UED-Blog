var express = require('express')
const router = express.Router()

var wxapp_user = require('../controller/wxapp/user')

/* GET home page. */
router.get('/index', function(req, res, next) {
  res.json({
    name: 'hello world!'
  })
})

/* 登录注册 */
router.post('/login', function(req, res, next) {
  wxapp_user.login(req, res)
})
router.get('/logOut', function(req, res, next) {
  wxapp_user.logOut(req, res)
})
router.post('/register', function(req, res, next) {
  wxapp_user.register(req, res)
})
router.get('/wxLogin', (req, res) => {
  wxapp_user.wxLogin(req, res)
})

module.exports = router
