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
router.get('/isLogin', (req, res) => {
  web_user.isLogin(req, res)
})
router.get('/wxLogin', (req, res) => {
  web_user.wxLogin(req, res)
})

/*个人信息*/
router.post('/editInfo', (req, res) => {
  web_user.editInfo(req, res)
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

// 获取tag标签
router.get('/GetBugTags', (req, res, next) => {
  web_bugCtrler.GetBugTags(req, res, next)
})

// 添加其他标签
router.post('/AddTags', (req, res, next) => {
  web_bugCtrler.AddTags(req, res, next)
})

// 判断是否存在某标签
router.post('/IsThereATag', (req, res, next) => {
  web_bugCtrler.IsThereATag(req, res, next)
})

// Bug检索
router.post('/SearchByKeywords', (req, res, next) => {
  web_bugCtrler.SearchBug(req, res, next)
})
// Bug评论
router.post('/commentBug', (req, res, next) => {
  web_bugCtrler.commentBug(req, res, next)
})
// 获取Bug评论
router.get('/getBugComment', (req, res, next) => {
  web_bugCtrler.getBugComment(req, res, next)
})
// 删除Bug评论
router.get('/deleteBugComment', (req, res, next) => {
  web_bugCtrler.deleteBugComment(req, res, next)
})
// Bug回复
router.post('/replyBug', (req, res, next) => {
  web_bugCtrler.replyBug(req, res, next)
})
// 删除Bug回复
router.get('/deleteReply', (req, res, next) => {
  web_bugCtrler.deleteReply(req, res, next)
})
//评论点赞
router.get('/bugCommentLike', (req, res, next) => {
  //调用controller方法
  web_bugCtrler.bugCommentLike(req, res, next)
})
module.exports = router
