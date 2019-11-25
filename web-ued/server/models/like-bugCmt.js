var mongoose = require('mongoose')
var db = require('./db.js')
var Schema = mongoose.Schema

var bugLikeSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId //用户objectId
    },
    bugId: {
        type: mongoose.Schema.Types.ObjectId //条目objectId
    },
    commentId: {
        type: mongoose.Schema.Types.ObjectId //评论objectId
    },
    replyId: {
        type: mongoose.Schema.Types.ObjectId //回复objectId
    }
}, {
    timestamps: {
        createdAt: 'createAt',
        updatedAt: 'updateAt'
    }
})

module.exports = db.model('bugCmtLike', bugLikeSchema, 'bugcmtlike')