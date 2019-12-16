var mongoose = require('mongoose')
var blog = require('./db.js')
var Schema = mongoose.Schema

var RegularSchema = new Schema({
    regularName: {
        type: String // 正则表达式名称
    },
    regularDescribe: {
        type: String // 正则描述
    },
    regularCategory: {
        type: String // 正则的分类  
    },
    regular: {
        type: String // 正则表达式子
    },
    status: {
        type: String // 正则表达式状态
    }
}, {
    timestamps: {
        createdAt: 'createAt',
        updatedAt: 'updateAt'
    }
})

module.exports = blog.model('Regular', RegularSchema, 'regular')