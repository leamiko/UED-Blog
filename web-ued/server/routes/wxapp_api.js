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

/* 文章API */
//获取blog详情
router.get('/getBlog', function(req, res, next) {
  web_blog.getBlog(req, res)
})
//首页列表
router.get('/getHomeList', function(req, res, next) {
  //调用controller方法
  web_blog.getHomeList(req, res)
})
//写字推荐
router.post('/getWriteBest', function(req, res, next) {
  //调用controller方法
  web_blog.getWriteBest(req, res)
})
//写字列表
router.post('/getWriteList', function(req, res, next) {
  //调用controller方法
  web_blog.getWriteList(req, res)
})
//blog点赞
router.get('/likeBlog', function(req, res, next) {
  //调用controller方法
  web_blog.likeBlog(req, res)
})
//blog评论
router.post('/commentBlog', function(req, res, next) {
  //调用controller方法
  web_blog.commentBlog(req, res)
})
//评论点赞
router.get('/commentLike', function(req, res, next) {
  //调用controller方法
  web_blog.commentLike(req, res)
})
//blog评论
router.post('/replyBlog', function(req, res, next) {
  //调用controller方法
  web_blog.replyBlog(req, res)
})
//获取blog评论
router.get('/getBlogComment', function(req, res, next) {
  //调用controller方法
  web_blog.getBlogComment(req, res)
})
//获取blog评论
router.get('/rankTask', function(req, res, next) {
  //调用controller方法
  web_blog.rankTask(req, res)
})

module.exports = router
