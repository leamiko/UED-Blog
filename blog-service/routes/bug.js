var express = require('express');
var router = express.Router();
var Bug = require('../Models/bugItem');
var BuKeywords = require('../Models/bugKeywords');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
// 新增bug条目
router.post('/AddBugItems', (req, res, next) => {
    var postData = {
        title: req.body.title,
        keyword: req.body.keyword,
        content: req.body.content,
        bugStatus: req.body.bugStatus,
        bugSolution: req.body.bugSolution,
        author: req.body.author,
        userId: req.body.userId
    };
    Bug.findOne({
        title: postData.title
    }, (err, data) => {
        if (data) {
            res.send({
                success: false,
                message: '添加失败，该bug条目已存在！'
            });
            console.log('添加失败，该bug条目已存在！');
        } else {
            // 保存到数据库
            Bug.create([postData], (err, data) => {
                if (data) {
                    res.send({
                        success: true,
                        message: '添加成功！'
                    });
                    console.log('添加成功！');
                }
                // if (err) throw err;
            })
        }
    })
})
router.post('/GetBugList', async (req, res, next) => {
    var buglist = await Bug.find({}, null, {
        skip: (req.query.pageIndex - 1) * req.query.pageSize,
        limit: req.query.pageSize,
    });
    res.json({
        Data: buglist
    })
})

// 新增关键词
router.post('/AddBugKeywords', async (req, res, next) => {
    var dataCache = req.body;
    // 保存到数据库
    BuKeywords.findOne({
        label: dataCache.label
    }, (err, data) => {
        if (err) throw (err);
        if (data) {
            console.log('关键词添加失败！');
        } else {
            BuKeywords.create(dataCache, (err, data) => {
                if (err) throw err;
                res.send({
                    success: true,
                    message: '关键词添加成功！'
                });
                console.log('关键词添加成功！');
            })
        }
    })
})
// 获取所有关键词
router.get('/GetAllBugKeywords', async (req, res, next) => {
    BuKeywords.find({}, (err, data) => {
        if (err) throw err;
        res.json(data)
        console.log('获取所有关键词成功');
    })
})
module.exports = router;