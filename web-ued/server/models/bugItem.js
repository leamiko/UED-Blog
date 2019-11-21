var mongoose = require('mongoose')
var db = require('./db.js')
var Schema = mongoose.Schema

var BugSchema = new Schema({
  title: {
    type: String //Bug名称
  },
  keyword: {
    type: Array, //Bug关键词--旧版本
    default: []
  },
  tags: { // bug标签
    type: Array,
    default: []
  },
  content: {
    type: String, //Bug内容
    default: ''
  },
  bugStatus: {
    type: Boolean //bug是否解决
  },
  bugSolution: {
    type: String, //bug解决方案
    default: ''
  },
  author: {
    type: String //作者  登录用户昵称
  },
  userId: {
    type: String //作者objectId也是登录用户objectId
  },
  likeNum: {
    type: Number, //点赞数
    default: 0
  },
  viewNum: {
    type: Number, //阅读量
    default: 0
  },
  commentNum: {
    type: Number, //评论数
    default: 0
  },
  comtTallestLikeNum: {
    type: Number, //评论最高点赞数
    default: 0
  },
  anonymous: {
    type: Number, // 匿名
    default: 0
  },
  rank: {
    type: Number, //rank
    default: 0
  },
  deleted: {
    type: Boolean, //是否软删除
    default: false
  }
}, {
  timestamps: {
    createdAt: 'createAt',
    updatedAt: 'updateAt'
  }
})

module.exports = db.model('Bug', BugSchema)