var mongoose = require('mongoose')
var blog = require('./db.js')
var Schema = mongoose.Schema

var UserSchema = new Schema(
  {
    account: {
      type: String //账号
    },
    passWord: {
      type: String //密码
    },
    authorization: {
      type: Number //权限
    }
  },
  { timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' } }
)

module.exports = blog.model('User', UserSchema)
