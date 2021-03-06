var mongoose = require('mongoose')
var blog = require('./db.js')
var Schema = mongoose.Schema

var CommentSchema = new Schema(
  {
    commentName: {
      type: String //评论人
    },
    commentUserId: {
      type: mongoose.Schema.Types.ObjectId //评论人objectid
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId //文章objectid
    },
    likeNum: {
      type: Number, //点赞数
      default: 0
    },
    content: {
      type: String //内容
    },
    anonymous: {
      type: Boolean //是否匿名
    }
  },
  { timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' } }
)

module.exports = blog.model('Comment', CommentSchema, 'comment')
