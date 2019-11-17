var mongoose = require('mongoose')
var blog = require('./db.js')
var Schema = mongoose.Schema

var UserSchema = new Schema(
  {
    nickName: {
      type: String, //昵称
      default: ''
    },
    account: {
      type: String //账号
    },
    passWord: {
      type: String //密码
    },
    authorization: {
      type: Number, //权限  暂时默认1
      default: 1
    },
    avatar: {
      type: String, //头像
      default: ''
    },
    wxUnionId: {
      type: String //微信unionid
    },
    blogWordNum: {
      type: Number, //文章字数
      default: 0
    },
    blogAllLikeNum: {
      type: Number, //文章总点赞数
      default: 0
    }
  },
  { timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' } }
)

module.exports = blog.model('User', UserSchema)
