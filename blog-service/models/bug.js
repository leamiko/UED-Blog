var mongoose = require('mongoose');
var blog = require('./db.js');
var Schema = mongoose.Schema;

var BugSchema = new Schema({
    title: {
        type: String //Bug名称
    },
    keyword: {
        type: Number //Bug关键词
    },
    content: {
        type: String, //Bug内容
    },
    bugStatus: {
        type: Boolean //bug是否解决
    },
    bugSolution: {
        type: String //bug解决方案
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
    },
    updateAt: {
        type: Date,
        default: Date.parse(new Date()) //更新时间
    },
    createAt: {
        type: Date,
        default: Date.parse(new Date()) //创建时间
    },
});

module.exports = blog.model('Bug', BugSchema);