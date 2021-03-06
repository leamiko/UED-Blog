var express = require('express');
var router = express.Router();
var blog = require('../controller/blog');

//新增删除blog
router.post('/addEditBlog', function (req, res, next) {
  //调用controller方法
  blog.addEditBlog(req, res);
});

//获取blog详情
router.get('/getBlog', function (req, res, next) {
  blog.getBlog(req, res);
})

//blog列表
router.post('/getBlogList', function (req, res, next) {
  //调用controller方法
  blog.getBlogList(req, res);
});

//blog删除
router.get('/deleteBlog', function (req, res, next) {
  //调用controller方法
  blog.deleteBlog(req, res);
});

//blog点赞
router.get('/likeBlog', function (req, res, next) {
  //调用controller方法
  blog.likeBlog(req, res);
});

//blog评论
router.post('/commentBlog', function (req, res, next) {
  //调用controller方法
  blog.commentBlog(req, res);
});

//获取blog评论
router.get('/getBlogComment', function (req, res, next) {
  //调用controller方法
  blog.getBlogComment(req, res);
});

module.exports = router;
