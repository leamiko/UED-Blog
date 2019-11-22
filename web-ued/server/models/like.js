var mongoose = require('mongoose')
var blog = require('./db.js')
var Schema = mongoose.Schema

var LikeSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId //用户objectId
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId //文章objectId
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId //评论objectId
    },
    replyId: {
      type: mongoose.Schema.Types.ObjectId //回复objectId
    },
    count: {
      type: Number //单词点赞数
    }
  },
  { timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' } }
)

module.exports = blog.model('Like', LikeSchema, 'like')
