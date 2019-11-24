var mongoose = require('mongoose')
var db = require('./db.js')
var Schema = mongoose.Schema

var bugCommentSchema = new Schema({
    commenterName: {
        type: String //评论人
    },
    commenterId: {
        type: mongoose.Schema.Types.ObjectId //评论人objectid
    },
    bugId: {
        type: mongoose.Schema.Types.ObjectId //条目objectid
    },
    likeNum: {
        type: Number, //点赞数
        default: 0
    },
    content: {
        type: String //内容
    },
    adopt: {
        type: Boolean, //是否采纳
        default: false
    },
    anonymous: {
        type: Boolean //是否匿名
    }
}, {
    timestamps: {
        createdAt: 'createAt',
        updatedAt: 'updateAt'
    }
})

module.exports = db.model('bugComment', bugCommentSchema, 'bugcomment')