var Blog = require('../../models/blog.js') //引入blog表
var Like = require('../../models/like.js') //引入like表
var Comment = require('../../models/comment.js') //引入comment表

//blog新增编辑
exports.addEditBlog = function(req, res) {
  if (req.body._id) {
    var whereBlog = {
      _id: req.body._id
    }
    let updateBlog = {
      title: req.body.title,
      blogType: req.body.blogType,
      info: req.body.info,
      content: req.body.content
    }
    Blog.update(whereBlog, updateBlog, function(err, blog) {
      if (err) {
        console.log(err)
        return res.json({
          code: 201,
          message: err,
          data: null
        })
      }
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
      author: req.session.user.nickName,
      userId: req.session.user._id
    })
    blog.save(function(err, blog) {
      if (err) {
        console.log(err)
        return res.json({
          code: 201,
          message: err,
          data: null
        })
      }
      return res.json({
        status_code: 200,
        message: '添加成功！',
        data: null
      })
    })
  }
}

//blog详情
exports.getBlog = function(req, res) {
  const bid = req.query.blogId
  const whereBlog = {
    _id: bid
  }
  Blog.findOne(whereBlog, function(err, blog) {
    if (err) {
      console.log(err)
      return res.json({
        status_code: 201,
        message: err,
        data: null
      })
    }
    const whereLike = {
      userId: blog.userId,
      blogId: blog._id
    }
    Like.findOne(whereLike, function(err, like) {
      if (like) {
        blog['isLike'] = true
        return res.json({
          status_code: 200,
          message: '获取成功！',
          data: blog
        })
      } else {
        blog['isLike'] = false
        return res.json({
          status_code: 200,
          message: '获取成功！',
          data: blog
        })
      }
    })
  })
}

//blog列表
exports.getBlogList = async function(req, res) {
  const page = req.body.paging.page
  const limit = req.body.paging.limit
  let filters = {
    deleted: false
  }
  if (req.body.filters.title) {
    filters.title = new RegExp(req.body.filters.title)
  }
  if (req.body.filters.blogType) {
    filters.blogType = req.body.filters.blogType
  }
  if (req.body.filters.author) {
    filters.author = req.body.filters.author
  }
  if (req.body.filters.isGood) {
    filters.isGood = req.body.filters.isGood
  }
  if (req.body.filters.isAudit) {
    filters.isAudit = req.body.filters.isAudit
  }
  const count = await Blog.countDocuments(filters)
  Blog.find(
    filters,
    null,
    {
      skip: (page * 1 - 1) * 15,
      limit: limit,
      sort: { createdAt: -1 }
    },
    function(err, books) {
      if (err) {
        console.log(err)
        return res.json({
          status_code: 201,
          message: err,
          data: null
        })
      }
      return res.json({
        status_code: 200,
        message: '获取列表成功！',
        data: {
          total: count,
          data: books
        }
      })
    }
  )
}

//blog删除
exports.deleteBlog = function(req, res) {
  var whereBlog = {
    _id: req.query.blogId
  }
  var updateBlog = {
    deleted: true
  }
  Blog.update(whereBlog, updateBlog, function(err, blog) {
    if (err) {
      console.log(err)
      return res.json({
        code: 201,
        message: err,
        data: null
      })
    }
    return res.json({
      status_code: 200,
      message: '删除成功！',
      data: null
    })
  })
}

//点赞
exports.likeBlog = function(req, res) {
  let like = new Like({
    userId: req.query.userId,
    blogId: req.query.blogId
  })
  like.save(function(err, blog) {
    if (err) {
      console.log(err)
      return res.json({
        status_code: 201,
        message: err,
        data: null
      })
    }
    return res.json({
      status_code: 200,
      message: '添加成功！',
      data: null
    })
  })
}

//评论
exports.commentBlog = function(req, res) {
  let comment = new Comment({
    commentName: req.body.commentName,
    commenId: req.body.commenId,
    blogId: req.body.blogId,
    content: req.body.content
  })
  comment.save(function(err, blog) {
    if (err) {
      console.log(err)
      return res.json({
        status_code: 201,
        message: err,
        data: null
      })
    }
    return res.json({
      status_code: 200,
      message: '添加成功！',
      data: null
    })
  })
}

//获取评论评论
exports.getBlogComment = function(req, res) {
  const whereComment = {
    blogId: req.query.blogId
  }

  Comment.find(whereComment, function(err, comments) {
    if (err) {
      console.log(err)
      return res.json({
        status_code: 201,
        message: err,
        data: null
      })
    }
    return res.json({
      status_code: 200,
      message: '获取评论成功！',
      data: comments
    })
  })
}
