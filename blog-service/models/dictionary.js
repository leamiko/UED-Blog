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
	}
}, { timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' } });

module.exports = blog.model('Dictionary', DictionarySchema);