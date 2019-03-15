var mongoose = require('mongoose');
var blog = require('./db.js');
var Schema = mongoose.Schema;

var LikeSchema = new Schema({
  userId: {
    type: String  //用户objectId
  },
  blogId: {
    type: String  //文章objectId
  },
  updateAt: {
    type: Date,
    default: Date.parse(new Date())   //更新时间
  },
  createAt: {
    type: Date,
    default: Date.parse(new Date())   //创建时间
  },
});

module.exports = blog.model('Like', LikeSchema);