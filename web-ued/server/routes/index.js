var express = require('express')
const router = express.Router()
const {
  verifyMiddleware
} = require('../middleware/verify.js')

var user = require('../controller/user')
var blog = require('../controller/blog')
var bugCtrler = require('../controller/bug')


/* GET home page. */
router.get('/index', function (req, res, next) {
  res.json({
    name: 'hello world!'
  })
})

/* 登录注册 */
router.post('/login', function (req, res, next) {
  user.login(req, res)
})
router.get('/logOut', function (req, res, next) {
  user.logOut(req, res)
})
router.post('/register', function (req, res, next) {
  user.register(req, res)
})
router.get('/callback', (req, res) => {
  user.wxLogin(req, res)
})

/* 文章API */
//新增删除blog
router.post('/addEditBlog', function (req, res, next) {
  //调用controller方法
  blog.addEditBlog(req, res)
})
//获取blog详情
router.get('/getBlog', function (req, res, next) {
  blog.getBlog(req, res)
})
//blog列表
router.post('/getBlogList', function (req, res, next) {
  //调用controller方法
  blog.getBlogList(req, res)
})
//blog删除
router.get('/deleteBlog', function (req, res, next) {
  //调用controller方法
  blog.deleteBlog(req, res)
})
//blog点赞
router.get('/likeBlog', function (req, res, next) {
  //调用controller方法
  blog.likeBlog(req, res)
})
//blog评论
router.post('/commentBlog', function (req, res, next) {
  //调用controller方法
  blog.commentBlog(req, res)
})
//获取blog评论
router.get('/getBlogComment', function (req, res, next) {
  //调用controller方法
  blog.getBlogComment(req, res)
})

/* 打码API */
// 新增bug条目
router.post('/AddBugItems', (req, res, next) => {
  bugCtrler.AddBugItems(req, res);
})
// 根据bug条目id查看bug详情
router.get('/GetBugDetail', (req, res) => {
  bugCtrler.GetBugDetail(req, res);
})
// 获取bug列表
router.post('/GetBugList', async (req, res, next) => {
  bugCtrler.GetBugList(req, res);
})

// bug条目更新
router.post('/UpdateBugById', async (req, res, next) => {
  bugCtrler.UpdateBugById(req, res);
})

// bug条目删除
router.post('/DeleteBugById', async (req, res, next) => {
  bugCtrler.DeleteBugById(req, res);
})

module.exports = router