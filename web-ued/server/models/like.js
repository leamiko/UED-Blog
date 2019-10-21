var mongoose = require('mongoose')
var blog = require('./db.js')
var Schema = mongoose.Schema

var LikeSchema = new Schema(
  {
    userId: {
      type: String //用户objectId
    },
    blogId: {
      type: String //文章objectId
    },
    commentId: {
      type: String //评论objectId
    },
    count: {
      type: Number //单词点赞数
    }
  },
  { timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' } }
)

module.exports = blog.model('Like', LikeSchema)
