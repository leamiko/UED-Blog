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

//首页列表
exports.getHomeList = async function(req, res) {
  const technology = await Blog.findOne({ blogType: 1 }).sort({
    rank: -1
  })
  const interaction = await Blog.findOne({ blogType: 2 }).sort({
    rank: -1
  })
  const design = await Blog.findOne({ blogType: 3 }).sort({
    rank: -1
  })
  const manage = await Blog.findOne({ blogType: 4 }).sort({
    rank: -1
  })
  const other = await Blog.findOne({ blogType: 5 }).sort({
    rank: -1
  })
  let data = []
  if (technology) {
    data.push(technology)
  }
  if (interaction) {
    data.push(interaction)
  }
  if (design) {
    data.push(design)
  }
  if (manage) {
    data.push(manage)
  }
  if (other) {
    data.push(other)
  }
  return res.json({
    status_code: 200,
    message: '获取列表成功！',
    data: data
  })
}

//写字推荐
exports.getWriteBest = async function(req, res) {
  let popular = await Blog.findOne().sort({
    viewNum: -1
  })
  let best = await Blog.findOne().sort({
    likeNum: -1
  })
  let comment = await Blog.findOne().sort({
    commentLikeNum: -1
  })
  let data = []
  if (popular) {
    data.push(popular)
  }
  if (best) {
    data.push(best)
  }
  if (comment) {
    data.push(comment)
  }
  // data.push(popular, best, comment)
  return res.json({
    status_code: 200,
    message: '获取列表成功！',
    data: data
  })
}

//写字列表
exports.getWriteList = async function(req, res) {
  const page = req.body.paging.page
  const limit = req.body.paging.limit
  let filters = {
    deleted: false
  }
  if (req.body.filters.blogType) {
    filters.blogType = req.body.filters.blogType
  }
  const count = await Blog.countDocuments(filters)
  Blog.find(
    filters,
    null,
    {
      skip: (page * 1 - 1) * limit,
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
    await User.findByIdAndUpdate(req.session.user._id, {
      blogAllLikeNum: req.session.user.blogAllLikeNum + 1
    })
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
    commentUserId: req.body.commentUserId,
    blogId: req.body.blogId,
    content: req.body.content,
    anonymous: req.body.anonymous
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

// rank定时任务
exports.rankTask = async function(req, res) {
  const blogs = await Blog.find()
  for (let i = 0; i < blogs.length; i++) {
    const rank =
      ((Math.log(blogs[i].viewNum) / Math.LN10 +
        (10 * Math.log(blogs[i].likeNum)) / Math.LN10 +
        (5 * Math.log(blogs[i].commentNum)) / Math.LN10 +
        (3 * Math.log(blogs[i].commentLikeNum)) / Math.LN10) /
        count(blogs[i].createAt)) *
      count(blogs[i].createAt)
    const whereBlog = {
      _id: blogs[i]._id
    }
    const updateBlog = {
      rank: rank
    }
    await Blog.updateOne(whereBlog, updateBlog)
  }
  return res.json({
    status_code: 200,
    message: '更新排序成功！',
    data: null
  })
}

function count(date) {
  var date1 = new Date()
  var date2 = new Date(date)
  var date = (date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24)
  return date < 1 ? 1 : parseInt(date)
}
