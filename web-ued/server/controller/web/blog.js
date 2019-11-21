var Blog = require('../../models/blog.js') //引入blog表
var Like = require('../../models/like.js') //引入like表
var Comment = require('../../models/comment.js') //引入comment表
var Reply = require('../../models/reply.js') //引入comment表
var User = require('../../models/user.js') //引入user表

//blog详情
exports.getBlog = async function(req, res) {
  const bid = req.query.blogId
  const whereBlog = {
    _id: bid
  }
  await Blog.where(whereBlog).updateOne({
    $inc: {
      viewNum: 1
    }
  })
  Blog.findOne(whereBlog, async function(err, blog) {
    if (err) {
      return res.json({
        status_code: 201,
        message: err,
        data: null
      })
    }
    const userInfo = await User.findById(blog.userId)
    const whereLike = {
      userId: blog.userId,
      blogId: blog._id
    }
    Like.findOne(whereLike, function(err, like) {
      if (like) {
        return res.json({
          status_code: 200,
          message: '获取成功！',
          data: {
            blog: blog,
            userInfo: userInfo,
            like: like
          }
        })
      } else {
        return res.json({
          status_code: 200,
          message: '获取成功！',
          data: {
            blog: blog,
            userInfo: userInfo,
            like: like
          }
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
    const userInfo = await Blog.findById(technology.userId)
    technology['userInfo'] = userInfo
    data.push(technology)
  }
  if (interaction) {
    const userInfo = await Blog.findById(interaction.userId)
    interaction['userInfo'] = userInfo
    data.push(interaction)
  }
  if (design) {
    const userInfo = await Blog.findById(design.userId)
    design['userInfo'] = userInfo
    data.push(design)
  }
  if (manage) {
    const userInfo = await Blog.findById(manage.userId)
    manage['userInfo'] = userInfo
    data.push(manage)
  }
  if (other) {
    const userInfo = await Blog.findById(other.userId)
    other['userInfo'] = userInfo
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
    const userInfo = await Blog.findById(popular.userId)
    popular['userInfo'] = userInfo
    data.push(popular)
  }
  if (best) {
    const userInfo = await Blog.findById(best.userId)
    best['userInfo'] = userInfo
    data.push(best)
  }
  if (comment) {
    const userInfo = await Blog.findById(comment.userId)
    comment['userInfo'] = userInfo
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

//点赞
exports.likeBlog = async function(req, res) {
  const whereBlog = {
    _id: req.body.blogId
  }
  const whereUser = {
    _id: req.body.authorId
  }
  const whereLike = {
    userId: req.body.userId,
    blogId: req.body.blogId
  }
  const like = await Like.find(whereLike)
  if (like.length != 0) {
    await Like.where(whereLike).updateOne({
      $inc: {
        count: req.body.count
      }
    })
    await Blog.where(whereBlog).updateOne({
      $inc: {
        likeNum: req.body.count
      }
    })
    await User.where(whereUser).updateOne({
      $inc: {
        blogAllLikeNum: req.body.count
      }
    })
    return res.json({
      status_code: 200,
      message: '点赞成功！',
      data: null
    })
  } else {
    let like = new Like({
      userId: req.body.userId,
      blogId: req.body.blogId,
      count: req.body.count
    })
    like.save(async function(err, like) {
      if (err) {
        return res.json({
          status_code: 201,
          message: err,
          data: null
        })
      }
      await Blog.where(whereBlog).updateOne({
        $inc: {
          likeNum: req.body.count
        }
      })
      await User.where(whereUser).updateOne({
        $inc: {
          blogAllLikeNum: req.body.count
        }
      })
      return res.json({
        status_code: 200,
        message: '点赞成功！',
        data: null
      })
    })
  }
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
    await Blog.where(whereBlog).updateOne({
      $inc: {
        commentNum: 1
      }
    })
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
    _id: req.body.blogId
  }
  const whereComment = {
    blogId: req.body.blogId
  }
  const whereUpdateComment = {
    _id: req.body.commentId
  }
  let like = new Like({
    userId: req.body.userId,
    commentId: req.body.commentId
  })
  like.save(async function(err, like) {
    if (err) {
      return res.json({
        status_code: 201,
        message: err,
        data: null
      })
    }
    await Comment.where(whereUpdateComment).updateOne({
      $inc: {
        likeNum: 1
      }
    })
    const comments = await Comment.findOne(whereComment).sort({
      likeNum: -1
    })
    const updateBlog = {
      commentLikeNum: comments.likeNum
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
    _id: req.body.commentId,
    commentUserId: req.body.userId
  }
  const whereBlog = {
    _id: req.body.blogId
  }
  Comment.deleteOne(whereComment, async function(err) {
    if (err) {
      return res.json({
        code: 201,
        message: err,
        data: null
      })
    }
    const comments = await Comment.find().sort({
      likeNum: -1
    })
    const updateBlog = {
      commentLikeNum: comments[0].likeNum,
      commentNum: comments.length
    }
    await Blog.updateOne(whereBlog, updateBlog)
    return res.json({
      status_code: 200,
      message: '删除成功！',
      data: null
    })
  })
}

//取消评论点赞
exports.deleteCommentLike = function(req, res) {
  const whereLike = {
    commentId: req.body.commentId,
    userId: req.body.userId
  }
  const whereComment = {
    _id: req.body.commentId
  }
  const whereBlog = {
    _id: req.body.blogId
  }
  Like.deleteOne(whereLike, async function(err) {
    if (err) {
      return res.json({
        code: 201,
        message: err,
        data: null
      })
    }
    await Comment.where(whereComment).updateOne({
      $inc: {
        likeNum: -1
      }
    })
    const comments = await Comment.findOne(whereComment).sort({
      likeNum: -1
    })
    const updateBlog = {
      commentLikeNum: comments.likeNum
    }
    await Blog.updateOne(whereBlog, updateBlog)
    return res.json({
      status_code: 200,
      message: '取消点赞成功！',
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

//回复点赞
exports.replyLike = function(req, res) {
  const whereUpdateReply = {
    _id: req.body.replyId
  }
  let like = new Like({
    userId: req.body.userId,
    replyId: req.body.replyId
  })
  like.save(async function(err, like) {
    if (err) {
      return res.json({
        status_code: 201,
        message: err,
        data: null
      })
    }
    await Reply.where(whereUpdateReply).updateOne({
      $inc: {
        likeNum: 1
      }
    })
    return res.json({
      status_code: 200,
      message: '点赞成功！',
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

//取消回复点赞
exports.deleteReplyLike = function(req, res) {
  const whereLike = {
    replyId: req.body.replyId,
    userId: req.body.userId
  }
  const whereReply = {
    _id: req.body.replyId
  }
  Like.deleteOne(whereLike, async function(err) {
    if (err) {
      return res.json({
        code: 201,
        message: err,
        data: null
      })
    }
    await Reply.where(whereReply).updateOne({
      $inc: {
        likeNum: -1
      }
    })
    return res.json({
      status_code: 200,
      message: '取消点赞成功！',
      data: null
    })
  })
}

//获取评论
exports.getBlogComment = async function(req, res) {
  const whereComment = {
    blogId: req.query.blogId
  }

  // 获取列表
  let comments = await Comment.aggregate([
    {
      $match: whereComment
    },
    {
      $lookup: {
        from: 'user',
        localField: 'commentUserId',
        foreignField: '_id',
        as: 'userInfo'
      }
    },
    {
      $project: {
        commentUserId: {
          $cond: [
            {
              $eq: ['$anonymous', true]
            },
            '',
            '$commentUserId'
          ]
        },
        blogId: 1,
        likeNum: 1,
        content: 1,
        anonymous: 1,
        commentName: {
          $cond: [
            {
              $eq: ['$anonymous', true]
            },
            '',
            '$commentName'
          ]
        },
        userInfo: { avatar: 1 }
      }
    }
  ])
  let replys = await Reply.aggregate([
    {
      $match: whereComment
    },
    {
      $lookup: {
        from: 'user',
        localField: 'replyId',
        foreignField: '_id',
        as: 'userInfo'
      }
    },
    {
      $project: {
        replyId: {
          $cond: [
            {
              $eq: ['$anonymous', true]
            },
            '',
            '$replyId'
          ]
        },
        blogId: 1,
        likeNum: 1,
        content: 1,
        anonymous: 1,
        replyName: {
          $cond: [
            {
              $eq: ['$anonymous', true]
            },
            '',
            '$replyName'
          ]
        },
        userInfo: { avatar: 1 }
      }
    }
  ])

  //转换id数组
  let commentids = comments.filter(item => {
    item._id
  })
  let replyids = replys.filter(item => {
    item._id
  })

  // 获取当前用户点赞列表
  const commentsLikes = await Like.find({
    commentId: { $in: commentids },
    userId: req.query.userId
  })
  const replysLikes = await Like.find({
    replyId: { $in: replyids },
    userId: req.query.userId
  })

  // 当前用户点赞列表转换id数组
  const commentsLikesids = commentsLikes.filter(item => {
    return item.commentId
  })
  const replysLikesids = replysLikes.filter(item => {
    return item.replyId
  })

  // 循环判断是否点赞
  let commentArr = []
  let replyArr = []
  for (let i = 0; i < comments.length; i++) {
    if (commentsLikesids.indexOf(comments[i]._id) != -1) {
      comments[i]['isLike'] = true
      commentArr.push(comments[i])
    } else {
      comments[i]['isLike'] = false
      commentArr.push(comments[i])
    }
  }
  for (let i = 0; i < replys.length; i++) {
    if (replysLikesids.indexOf(replys[i]._id) != -1) {
      replys[i]['isLike'] = true
      replyArr.push(replys[i])
    } else {
      replys[i]['isLike'] = true
      replyArr.push(replys[i])
    }
  }

  // 合并评论回复
  for (let i = 0; i < replyArr.length; i++) {
    if (commentids.indexOf(replyArr[i]._id) != -1) {
      commentArr[commentids.indexOf(replyArr[i]._id)]['replys'].push(
        replyArr[i]
      )
    }
  }

  return res.json({
    status_code: 200,
    message: '评论获取成功！',
    data: commentArr
  })
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
