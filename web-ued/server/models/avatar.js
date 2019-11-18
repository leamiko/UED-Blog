var mongoose = require('mongoose')
var db = require('./db.js')
var Schema = mongoose.Schema

var AvatarSchema = new Schema({
  name: {
    type: String //图片名称
  },
  url: {
    type: String //图片url
  }
})

module.exports = db.model('Avatar', AvatarSchema)
