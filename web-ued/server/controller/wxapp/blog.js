var Blog = require('../../models/blog.js') //引入blog表
var Like = require('../../models/like.js') //引入like表
var Comment = require('../../models/comment.js') //引入comment表
var Reply = require('../../models/reply.js') //引入comment表
var User = require('../../models/user.js') //引入user表

//blog详情
exports.getBlog = function(req, res) {
  const bid = req.query.blogId
  const whereBlog = {
    _id: bid
  }
  Blog.findOne(whereBlog, async function(err, blog) {
    if (err) {
      return res.json({
        status_code: 201,
        message: err,
        data: null
      })
    }
    let updateBlog = {
      viewNum: blog.viewNum ? blog.viewNum + 1 : 1
    }
    await Blog.updateOne(whereBlog, updateBlog)
    blog.viewNum = blog.viewNum ? blog.viewNum + 1 : 1
    const userInfo = await User.findById(blog.userId)
    blog['userInfo'] = userInfo
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

//文章列表
exports.getList = async function(req, res) {
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
          author: 1,
          userId: 1,
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
        $skip: (page * 1 - 1) * limit
      },
      {
        $limit: limit
      },
      {
        $sort: { rank: -1 }
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
          data: books
        }
      })
    }
  )
}

//点赞
exports.likeBlog = function(req, res) {
  const whereBlog = {
    _id: req.query.blogId
  }
  let like = new Like({
    userId: req.query.userId,
    blogId: req.query.blogId,
    count: req.query.count
  })
  like.save(async function(err, like) {
    if (err) {
      return res.json({
        status_code: 201,
        message: err,
        data: null
      })
    }
    let updateBlog = {
      likeNum: req.query.likeNum
        ? req.query.likeNum * 1 + req.query.count * 1
        : req.query.count * 1
    }
    await Blog.updateOne(whereBlog, updateBlog)
    return res.json({
      status_code: 200,
      message: '点赞成功！',
      data: null
    })
  })
}

//评论
exports.commentBlog = function(req, res) {
  const whereBlog = {
    _id: req.body.blogId
  }
  let comment = new Comment({
    commentName: req.body.commentName,
    commentId: req.body.commentId,
    blogId: req.body.blogId,
    content: req.body.content
  })
  comment.save(async function(err, comment) {
    if (err) {
      return res.json({
        status_code: 201,
        message: err,
        data: null
      })
    }
    const commentNum = await Comment.countDocuments()
    let updateBlog = {
      commentNum: commentNum ? commentNum + 1 : 1
    }
    await Blog.updateOne(whereBlog, updateBlog)
    return res.json({
      status_code: 200,
      message: '添加成功！',
      data: null
    })
  })
}

//评论点赞
exports.commentLike = function(req, res) {
  const whereBlog = {
    _id: req.query.blogId
  }
  const whereComment = {
    blogId: req.query.blogId
  }
  const whereUpdateComment = {
    _id: req.query.commentId
  }
  let like = new Like({
    userId: req.query.userId,
    commentId: req.query.commentId
  })
  like.save(async function(err, like) {
    if (err) {
      return res.json({
        status_code: 201,
        message: err,
        data: null
      })
    }
    const likeNum = await Like.countDocuments({
      commentId: req.query.commentId
    })
    let updateComment = {
      likeNum: likeNum
    }
    await Comment.updateOne(whereUpdateComment, updateComment)
    const comments = await Comment.find(whereComment).sort({
      likeNum: -1
    })
    const updateBlog = {
      commentLikeNum: comments[0].likeNum
    }
    await Blog.updateOne(whereBlog, updateBlog)
    return res.json({
      status_code: 200,
      message: '点赞成功！',
      data: null
    })
  })
}

//删除评论
exports.deleteComment = function(req, res) {
  var whereComment = {
    _id: req.query.commentId
  }
  Comment.deleteOne(whereComment, function(err) {
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

//回复
exports.replyBlog = function(req, res) {
  console.log(req.body)
  let reply = new Reply(req.body)
  reply.save(function(err, reply) {
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

//删除回复
exports.deleteReply = function(req, res) {
  var whereReply = {
    _id: req.query.replyId
  }
  Reply.deleteOne(whereReply, function(err) {
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

//获取评论
exports.getBlogComment = function(req, res) {
  const whereComment = {
    blogId: req.query.blogId
  }

  Comment.aggregate(
    [
      {
        $match: whereComment
      },
      {
        $lookup: {
          from: 'reply',
          localField: '_id',
          foreignField: 'commentId',
          as: 'replies'
        }
      }
    ],
    (err, comments) => {
      if (err) {
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
    }
  )
}

// 我的文章
exports.getMyBlog = function(req, res) {
  const page = req.body.paging.page
  const limit = req.body.paging.limit
  let filters = {
    deleted: false
  }
  if (req.body.filters.userId) {
    filters.userId = req.body.filters.userId
  }
  Blog.find(
    filters,
    null,
    {
      skip: (page * 1 - 1) * 10,
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
        data: books
      })
    }
  )
}

//我的赞
exports.getMyLike = function(req, res) {
  const page = req.body.paging.page
  const limit = req.body.paging.limit
  let filters = {
    blogId: { $exists: true }
  }
  if (req.body.filters.userId) {
    filters.userId = req.body.filters.userId
  }
  Like.aggregate(
    [
      {
        $match: filters
      },
      {
        $lookup: {
          from: 'blog',
          localField: 'blogId',
          foreignField: '_id',
          as: 'blog'
        }
      },
      { $skip: Number(page) },
      { $limit: Number(limit) }
    ],
    (err, likes) => {
      if (err) {
        return res.json({
          status_code: 201,
          message: err,
          data: null
        })
      }
      let blogs = []
      for (let i = 0; i < likes.length; i++) {
        blogs.push(likes[i].blog[0])
      }
      return res.json({
        status_code: 200,
        message: '获取成功！',
        data: blogs
      })
    }
  )
}
