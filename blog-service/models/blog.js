var mongoose = require('mongoose');
var blog = require('./db.js');
var Schema = mongoose.Schema;

var BlogSchema = new Schema({
	title: {
		type: String  //文章名称
	},
	blogType: {
		type: Number  //文章类别id
	},
	info: {
		type: String  //文章简介
	},
	content: {
		type: String,  //文章内容
	},
	isGood: {
		type: Boolean,  //是否精选
		default: false
	},
	isAudit: {
		type: Boolean,  //是否审核通过
		default: false
	},
	author: {
		type: String  //作者  登录用户昵称
	},
	userId: {
		type: String  //作者objectId也是登录用户objectId
	},
	likeNum: {
		type: Number,  //点赞数
		default: 0
	},
	deleted: {
		type: Boolean,  //是否软删除
		default: false
	}
}, { timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' } });

module.exports = blog.model('Blog', BlogSchema);