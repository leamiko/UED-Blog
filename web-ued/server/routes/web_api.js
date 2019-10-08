var express = require('express')
const router = express.Router()
const { verifyMiddleware } = require('../middleware/verify.js')

var web_user = require('../controller/web/user')
var web_blog = require('../controller/web/blog')
var web_bugCtrler = require('../controller/web/bug')

/* GET home page. */
router.get('/index', function(req, res, next) {
  res.json({
    name: 'hello world!'
  })
})

/* 登录注册 */
router.post('/login', function(req, res, next) {
  web_user.login(req, res)
})
router.get('/logOut', function(req, res, next) {
  web_user.logOut(req, res)
})
router.post('/register', function(req, res, next) {
  web_user.register(req, res)
})
router.get('/callback', (req, res) => {
  web_user.wxLogin(req, res)
})

/* 文章API */
//获取blog详情
router.get('/getBlog', function(req, res, next) {
  web_blog.getBlog(req, res)
})
//blog列表
router.post('/getBlogList', function(req, res, next) {
  //调用controller方法
  web_blog.getBlogList(req, res)
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

/* 打码API */
// 新增bug条目
router.post('/AddBugItems', (req, res, next) => {
  web_bugCtrler.AddBugItems(req, res, next)
})
// 根据bug条目id查看bug详情
router.get('/GetBugDetail', (req, res, next) => {
  web_bugCtrler.GetBugDetail(req, res, next)
})
// 获取bug列表
router.post('/GetBugList', (req, res, next) => {
  web_bugCtrler.GetBugList(req, res, next)
})

// bug条目更新
router.post('/UpdateBugById', (req, res, next) => {
  web_bugCtrler.UpdateBugById(req, res, next)
})

// bug条目删除
router.post('/DeleteBugById', (req, res, next) => {
  web_bugCtrler.DeleteBugById(req, res, next)
})

// bug条目删除
router.get('/GetBugTags', (req, res, next) => {
  web_bugCtrler.GetBugTags(req, res, next);
})

module.exports = router
