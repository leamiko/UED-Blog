var mongoose = require('mongoose')
var blog = require('./db.js')
var Schema = mongoose.Schema

var AdminSchema = new Schema(
  {
    account: {
      type: String //账号
    },
    passWord: {
      type: String //密码
    },
    createdId: {
      type: String //创建人
    },
    changeId: {
      type: String //修改人
    },
    authorization: {
      type: Number //权限
    }
  },
  { timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' } }
)

module.exports = blog.model('Admin', AdminSchema)
