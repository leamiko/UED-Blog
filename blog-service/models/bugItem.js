var mongoose = require('mongoose');
var db = require('./db.js');
var Schema = mongoose.Schema;

var BugSchema = new Schema({
    title: {
        type: String //Bug名称
    },
    keyword: {
        type: String //Bug关键词
    },
    content: {
        type: String, //Bug内容
        default: []
    },
    bugStatus: {
        type: Boolean //bug是否解决
    },
    bugSolution: {
        type: String, //bug解决方案
        default: ''
    },
    author: {
        type: String //作者  登录用户昵称
    },
    userId: {
        type: String //作者objectId也是登录用户objectId
    },
    useNum: {
        type: Number, //点赞数/采用数
        default: 0
    },
    deleted: {
        type: Boolean, //是否软删除
        default: false
    }
}, {
    timestamps: {
        createdAt: 'createAt',
        updatedAt: 'updateAt'
    }
});

module.exports = db.model('Bug', BugSchema);