var express = require('express')
const router = express.Router()
const { authorizationMiddleware } = require('../middleware/authorization.js')

var user = require('../controller/system/user')
var dictionary = require('../controller/system/dictionary')
var blog = require('../controller/system/blog')
var bugCtrler = require('../controller/system/bug')
var avatar = require('../controller/system/avatar')

/* GET home page. */
router.get('/index', function(req, res, next) {
  res.json({
    name: 'hello world!'
  })
})

/* GET users listing. */
router.post('/login', function(req, res, next) {
  user.login(req, res)
})
router.get('/logOut', function(req, res, next) {
  user.logOut(req, res)
})
router.get('/superAdmin', function(req, res, next) {
  user.superAdmin(req, res)
})

/* GET users listing. */

/* bug管理--Start */

// 新增bug条目
router.post('/AddBugItems', authorizationMiddleware, (req, res, next) => {
  bugCtrler.AddBugItems(req, res, next)
})
// 根据bug条目id查看bug详情
router.get('/GetBugDetail', authorizationMiddleware, (req, res, next) => {
  bugCtrler.GetBugDetail(req, res, next)
})
// 获取bug列表
router.post('/GetBugList', authorizationMiddleware, (req, res, next) => {
  bugCtrler.GetBugList(req, res, next)
})

// bug条目更新
router.post(
  '/UpdateBugById',
  authorizationMiddleware,
  async (req, res, next) => {
    bugCtrler.UpdateBugById(req, res, next)
  }
)

// bug条目删除
router.post(
  '/DeleteBugById',
  authorizationMiddleware,
  async (req, res, next) => {
    bugCtrler.DeleteBugById(req, res, next)
  }
)

// 新增关键词
router.post(
  '/AddBugKeywords',
  authorizationMiddleware,
  async (req, res, next) => {
    bugCtrler.AddBugKeywords(req, res, next)
  }
)
// 获取所有关键词
router.get(
  '/GetAllBugKeywords',
  authorizationMiddleware,
  async (req, res, next) => {
    bugCtrler.GetAllBugKeywords(req, res, next)
  }
)

/* bug管理--End */

/**
 * 文章管理
 */
//新增删除blog
router.post('/addEditBlog', authorizationMiddleware, function(req, res, next) {
  //调用controller方法
  blog.addEditBlog(req, res)
})
//获取blog详情
router.get('/getBlog', authorizationMiddleware, function(req, res, next) {
  blog.getBlog(req, res)
})
//blog列表
router.post('/getBlogList', authorizationMiddleware, function(req, res, next) {
  //调用controller方法
  blog.getBlogList(req, res)
})
//blog删除
router.get('/deleteBlog', authorizationMiddleware, function(req, res, next) {
  //调用controller方法
  blog.deleteBlog(req, res)
})
//blog点赞
router.get('/likeBlog', authorizationMiddleware, function(req, res, next) {
  //调用controller方法
  blog.likeBlog(req, res)
})
//blog评论
router.post('/commentBlog', authorizationMiddleware, function(req, res, next) {
  //调用controller方法
  blog.commentBlog(req, res)
})
//获取blog评论
router.get('/getBlogComment', authorizationMiddleware, function(
  req,
  res,
  next
) {
  //调用controller方法
  blog.getBlogComment(req, res)
})

/**
 * 用户管理
 */
// 注册账号
router.post('/registerAdmin', authorizationMiddleware, function(
  req,
  res,
  next
) {
  user.register(req, res)
})
//账号列表
router.post('/adminList', authorizationMiddleware, function(req, res, next) {
  user.adminList(req, res)
})
//删除账号
router.get('/deleteAdmin', authorizationMiddleware, function(req, res, next) {
  user.deleteAdmin(req, res)
})

/*字典管理 */
// 列表
router.post('/GetDictionaryList', (req, res, next) => {
  dictionary.GetDictionaryList(req, res, next)
})
// 新增
router.post(
  '/CreateOrEditDictionary',

  (req, res, next) => {
    dictionary.CreateOrEditDictionary(req, res, next)
  }
)
// 删除
router.get('/DeleteDictionaryById', (req, res, next) => {
  dictionary.DeleteDictionaryById(req, res, next)
})
// 树
router.post('/GetDictionaryTree', (req, res, next) => {
  dictionary.GetDictionaryTree(req, res, next)
})
// 模块
router.post('/GetModelList', (req, res, next) => {
  dictionary.GetModelList(req, res, next)
})

/**
 * 头像管理
 */
// 新增头像
router.post('/addAvatar', (req, res, next) => {
  avatar.addAvatar(req, res, next)
})
// 头像列表
router.get('/getAvatarList', (req, res, next) => {
  avatar.getAvatarList(req, res, next)
})
// 头像删除
router.get('/deleteAvatar', (req, res, next) => {
  avatar.deleteAvatar(req, res, next)
})

module.exports = router
