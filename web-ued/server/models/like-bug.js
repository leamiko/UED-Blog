var mongoose = require('mongoose')
var db = require('./db.js')
var Schema = mongoose.Schema

var bugLikeSchema = new Schema({
    userId: {
        type: String //用户objectId
    },
    bugId: {
        type: String //条目objectId
    },
    commentId: {
        type: String //评论objectId
    },
    count: {
        type: Number //单次点赞数
    }
}, {
    timestamps: {
        createdAt: 'createAt',
        updatedAt: 'updateAt'
    }
})

module.exports = db.model('bugLike', bugLikeSchema)