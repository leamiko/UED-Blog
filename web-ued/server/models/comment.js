var mongoose = require('mongoose')
var blog = require('./db.js')
var Schema = mongoose.Schema

var CommentSchema = new Schema(
  {
    commentName: {
      type: String //评论人
    },
    commentUserId: {
      type: String //评论人objectid
    },
    blogId: {
      type: String //文章objectid
    },
    likeNum: {
      type: Number, //点赞数
      default: 0
    },
    content: {
      type: String //内容
    }
  },
  { timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' } }
)

module.exports = blog.model('Comment', CommentSchema, 'comment')
