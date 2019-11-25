var mongoose = require('mongoose')
var db = require('./db.js')
var Schema = mongoose.Schema

var adoptBugCommentSchema = new Schema({
    userId: {
        type: String //用户objectId
    },
    bugId: {
        type: String //条目objectId
    },
    commentId: {
        type: String //评论objectId
    }
}, {
    timestamps: {
        createdAt: 'createAt',
        updatedAt: 'updateAt'
    }
})

module.exports = db.model('adoptBugComment', adoptBugCommentSchema)