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