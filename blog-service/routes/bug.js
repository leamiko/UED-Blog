var express = require('express');
var router = express.Router();
var Bug = require('../Models/bugItem');
var BuKeywords = require('../Models/bugKeywords');

var cors = require('cors');
var whitelist = ['http://localhost:4200']

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

//cors 跨域配置
var corsOptionsDelegate = function (req, callback) {
    var corsOptions;

    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = {
            origin: true
        } // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = {
            origin: false
        } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
}
// 新增bug条目
router.post('/AddBugItems', cors(corsOptionsDelegate), (req, res, next) => {
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
router.post('/GetBugList', cors(corsOptionsDelegate), async (req, res, next) => {
    var buglist = await Bug.find({}, null, {
        skip: (req.query.pageIndex - 1) * req.query.pageSize,
        limit: req.query.pageSize,
    });
    res.json({
        Data: buglist
    })
})

// 新增关键词
router.post('/AddBugKeywords', cors(corsOptionsDelegate), async (req, res, next) => {
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
router.get('/GetAllBugKeywords', cors(corsOptionsDelegate), async (req, res, next) => {
    BuKeywords.find({}, (err, data) => {
        if (err) throw err;
        res.json(data)
        console.log('获取所有关键词成功');
    })
})
module.exports = router;