var mongoose = require('mongoose')
var blog = require('./db.js')
var Schema = mongoose.Schema

var ReplySchema = new Schema(
  {
    replyName: {
      type: String //回复人
    },
    replyId: {
      type: mongoose.Schema.Types.ObjectId //回复人objectId
    },
    reReplyName: {
      type: String //被回复人
    },
    reReplyId: {
      type: mongoose.Schema.Types.ObjectId //被回复人objectId
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId //文章objectId
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId //评论objectId
    },
    likeNum: {
      type: Number, //点赞数
      default: 1
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

module.exports = blog.model('Reply', ReplySchema, 'reply')
