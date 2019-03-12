var mongoose = require('mongoose');
var blog = require('./db.js');
var Schema = mongoose.Schema;

var BlogSchema = new Schema({
	title: {
		type: String  //文章名称
	},
	blogType: {
		type: Number  //文章类别
	},
	info: {
		type: String  //文章简介
	},
	content: {
		type: String,  //文章内容
	},
	isGood: {
		type: Number  //是否精选 1是2不是
	},
	author: {
		type: String  //作者
	},
	userId: {
		type: String  //作者Id
	},
	likeNum: {
		type: Number,  //点赞数
		default: 0
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

module.exports = blog.model('Blog', BlogSchema);