var Blog = require('../../models/blog.js') //引入blog表
var Like = require('../../models/like.js') //引入like表
var Comment = require('../../models/comment.js') //引入comment表
var User = require('../../models/user.js') //引入user表

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
      content: req.body.content,
      smallImgUrl: req.body.smallImgUrl,
      midImgUrl: req.body.midImgUrl,
      bigImgUrl: req.body.bigImgUrl
    }
    Blog.update(whereBlog, updateBlog, function(err, blog) {
      if (err) {
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
      smallImgUrl: req.body.smallImgUrl,
      midImgUrl: req.body.midImgUrl,
      bigImgUrl: req.body.bigImgUrl,
      author: req.body.author,
      userId: req.body.userId
    })
    const blogWordNum = req.body.content.length
    blog.save(async function(err, blog) {
      if (err) {
        return res.json({
          code: 201,
          message: err,
          data: null
        })
      }
      await User.findByIdAndUpdate(req.body.userId, {
        blogWordNum: blogWordNum
      })
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
      return res.json({
        status_code: 201,
        message: err,
        data: null
      })
    }
    return res.json({
      status_code: 200,
      message: '获取成功！',
      data: blog
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
  if (req.body.filters.userId) {
    filters.userId = req.body.filters.userId
  }
  if (req.body.filters.isGood) {
    filters.isGood = req.body.filters.isGood
  }
  if (req.body.filters.isAudit) {
    filters.isAudit = req.body.filters.isAudit
  }
  const count = await Blog.countDocuments(filters)
  Blog.aggregate(
    [
      {
        $match: filters
      },
      {
        $lookup: {
          from: 'user',
          localField: 'userId',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $project: {
          title: 1,
          blogType: 1,
          info: 1,
          content: 1,
          isGood: 1,
          isAudit: 1,
          smallImgUrl: 1,
          midImgUrl: 1,
          bigImgUrl: 1,
          likeNum: 1,
          viewNum: 1,
          commentNum: 1,
          commentLikeNum: 1,
          rank: 1,
          createAt: 1,
          userInfo: { nickName: 1, account: 1, avatar: 1 }
        }
      },
      {
        $sort: { rank: -1 }
      },
      {
        $skip: (page * 1 - 1) * limit
      },
      {
        $limit: limit
      }
    ],
    (err, books) => {
      if (err) {
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
