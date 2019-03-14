var mongoose = require('mongoose');
var blog = require('./db.js');
var Schema = mongoose.Schema;

var DictionarySchema = new Schema({
	id: {
		type: String  //分类id
	},
	parentId: {
		type: String  //父级id
	},
	name: {
		type: String  //分类名称
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

module.exports = blog.model('Dictionary', DictionarySchema);