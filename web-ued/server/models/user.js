var mongoose = require('mongoose')
var blog = require('./db.js')
var Schema = mongoose.Schema

var UserSchema = new Schema(
  {
    nickName: {
      type: String //昵称
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
      type: String //头像
    },
    wxOpenId: {
      type: String //微信openId
    }
  },
  { timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' } }
)

module.exports = blog.model('User', UserSchema)
