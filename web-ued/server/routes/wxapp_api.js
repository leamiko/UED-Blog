var express = require('express')
const router = express.Router()

var wxapp_user = require('../controller/wxapp/user')
var wxapp_blog = require('../controller/wxapp/blog')

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
router.get('/isLogin', (req, res) => {
  wxapp_user.isLogin(req, res)
})

/* 文章API */
//获取blog详情
router.get('/getBlog', function(req, res, next) {
  wxapp_blog.getBlog(req, res)
})
//写字列表
router.post('/getList', function(req, res, next) {
  //调用controller方法
  wxapp_blog.getList(req, res)
})
//blog点赞
router.get('/likeBlog', function(req, res, next) {
  //调用controller方法
  wxapp_blog.likeBlog(req, res)
})
//blog评论
router.post('/commentBlog', function(req, res, next) {
  //调用controller方法
  wxapp_blog.commentBlog(req, res)
})
//评论点赞
router.get('/commentLike', function(req, res, next) {
  //调用controller方法
  wxapp_blog.commentLike(req, res)
})
//blog评论
router.post('/replyBlog', function(req, res, next) {
  //调用controller方法
  wxapp_blog.replyBlog(req, res)
})
//获取blog评论
router.get('/getBlogComment', function(req, res, next) {
  //调用controller方法
  wxapp_blog.getBlogComment(req, res)
})
//我的文章
router.post('/getMyBlog', function(req, res, next) {
  //调用controller方法
  wxapp_blog.getMyBlog(req, res)
})
//我的赞
router.post('/getMyLike', function(req, res, next) {
  //调用controller方法
  wxapp_blog.getMyLike(req, res)
})

module.exports = router
