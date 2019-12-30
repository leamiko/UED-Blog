var mongoose = require('mongoose')
var db = require('./db.js')
var Schema = mongoose.Schema

var bugReplySchema = new Schema({
    replyerName: {
        type: String //回复人
    },
    replyerId: {
        type: mongoose.Schema.Types.ObjectId //回复人objectId
    },
    replyTargetName: {
        type: String //被回复人
    },
    replyTargetId: {
        type: mongoose.Schema.Types.ObjectId //被回复人objectId
    },
    bugId: {
        type: mongoose.Schema.Types.ObjectId //条目objectId
    },
    commentId: {
        type: mongoose.Schema.Types.ObjectId //评论objectId
    },
    likeNum: {
        type: Number, //点赞数
        default: 0
    },
    content: {
        type: String //内容
    },
    anonymous: {
        type: Boolean //是否匿名
    },
    targetAnonymous: {
        type: Boolean //回复目标是否匿名
    },
}, {
    timestamps: {
        createdAt: 'createAt',
        updatedAt: 'updateAt'
    }
})

module.exports = db.model('bugReply', bugReplySchema, 'bugreply')