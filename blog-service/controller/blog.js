var Blog = require("../models/blog.js");   //引入user表
const logger = require('../log');   //引入日志

exports.addEditBlog = function (req, res) {
  if (req.body._id) {
    var whereBlog = {
      _id: req.body._id
    };
    let updateBlog = {
      title: req.body.title,
      blogType: req.body.blogType,
      info: req.body.info,
      content: req.body.content,
      author: 'admin',
      userId: '123'
    }
    Blog.update(whereBlog, updateBlog, function (err, blog) {
      if (err) {
        logger.error(err);
        return res.json({
          code: 201,
          message: err,
          data: null
        })
      };
      return res.json({
        status_code: 200,
        message: '修改成功！',
        data: null
      })
    })
  } else {
    let blog = new Blog({
      title: req.body.title,
      blogType: req.body.blogType,
      info: req.body.info,
      content: req.body.content,
      author: 'admin',
      userId: '123'
    })
    blog.save(function (err, blog) {
      if (err) {
        logger.error(err);
        return res.json({
          code: 201,
          message: err,
          data: null
        })
      };
      return res.json({
        status_code: 200,
        message: '添加成功！',
        data: null
      })
    })
  }
}

exports.getBlog = function (req, res) {
  const bid = req.query.blogId;
  const wherestr = {
    '_id': bid,
  }
  Blog.findOne(wherestr, function (err, blog) {
    if (err) {
      logger.error(err);
      return res.json({
        code: 201,
        message: err,
        data: null
      })
    };
    return res.json({
      status_code: 200,
      message: '获取成功！',
      data: blog
    })
  })
}

//blog列表
exports.getBlogList = async function (req, res) {
  const page = req.body.paging.page;
  const limit = req.body.paging.limit;
  let filters = {
    title: new RegExp(req.body.filters.title),
    blogType: req.body.filters.blogType,
    deleted: false
  };
  const count = await Blog.count(filters);
  Blog.find(filters, null, {
    skip: (page * 1 - 1) * 15,
    limit: limit,
    sort: { 'createdAt': -1 }
  }, function (err, books) {
    if (err) {
      logger.error(err);
      return res.json({
        code: 201,
        message: err,
        data: null
      })
    };
    return res.json({
      status_code: 200,
      message: '获取列表成功！',
      data: {
        total: count,
        data: books
      }
    })
  })
}

//blog删除
exports.deleteBlog = function (req, res) {
  var whereBlog = {
    _id: req.query.blogId
  };
  var updateBlog = {
    deleted: true
  }
  Blog.update(whereBlog, updateBlog, function (err, blog) {
    if (err) {
      logger.error(err);
      return res.json({
        code: 201,
        message: err,
        data: null
      })
    };
    return res.json({
      status_code: 200,
      message: '删除成功！',
      data: null
    })
  })
}