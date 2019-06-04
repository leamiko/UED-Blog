var mongoose = require('mongoose')
var db = require('./db.js')
var Schema = mongoose.Schema

var BugKeywordsSchema = new Schema(
  {
    label: {
      type: String //关键词标签
    },
    value: {
      type: String //关键词值
    }
  },
  {
    timestamps: {
      createdAt: 'createAt',
      updatedAt: 'updateAt'
    }
  }
)

module.exports = db.model('Keywords', BugKeywordsSchema)
