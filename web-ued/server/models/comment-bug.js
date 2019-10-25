var mongoose = require('mongoose')
var db = require('./db.js')
var Schema = mongoose.Schema

var bugCommentSchema = new Schema({
    commenterName: {
        type: String //评论人
    },
    commenterId: {
        type: String //评论人objectid
    },
    bugId: {
        type: String //条目objectid
    },
    likeNum: {
        type: Number, //点赞数
        default: 0
    },
    content: {
        type: String //内容
    }
}, {
    timestamps: {
        createdAt: 'createAt',
        updatedAt: 'updateAt'
    }
})

module.exports = db.model('bugComment', bugCommentSchema, 'bugcomment')