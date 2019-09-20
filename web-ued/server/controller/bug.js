var Bug = require('../models/bugItem');

// 新增bug条目
exports.AddBugItems = function (req, res) {
    var postData = {
        title: req.body.title,
        // keyword: req.body.keyword,
        content: req.body.content,
        bugStatus: req.body.bugStatus,
        bugSolution: req.body.bugSolution,
        author: req.body.author,
        userId: req.body.userId
    }
    Bug.findOne({
            title: postData.title
        },
        (err, data) => {
            if (data) {
                res.send({
                    status_code: 200,
                    message: '添加失败，该bug条目已存在！'
                })
            } else {
                // 保存到数据库
                Bug.create([postData], (err2, data2) => {
                    if (data2) {
                        res.send({
                            status_code: 200,
                            message: 'success'
                        })
                    }
                    if (err) {
                        return res.json({
                            status_code: 201,
                            message: err2
                        })
                    }
                })
            }
            if (err) {
                return res.json({
                    status_code: 201,
                    message: err
                })
            }
        }
    )
}
// 根据bug条目id查看bug详情
exports.GetBugDetail = function (req, res) {
    let bid = req.query.bugId
    Bug.findOne({
            _id: bid
        },
        (err, data) => {
            if (err) {
                return res.json({
                    status_code: 201,
                    message: err,
                    data: null
                })
            } else {
                return res.json({
                    status_code: 200,
                    message: 'success',
                    data: data
                })
            }
        }
    )
}
// 获取bug列表
exports.GetBugList = function (req, res) {
    var filters = {
        deleted: false
    }
    if (req.body.filters) {
        if (req.body.filters.title) {
            filters.title = new RegExp(req.body.filters.title)
        }
        if (req.body.filters.bugStatus) {
            filters.bugStatus = req.body.filters.bugStatus
        }
        if (req.body.filters.author) {
            filters.author = req.body.filters.author
        }
    }
    // const count = Bug.count(filters)
    Bug.find(filters, null, {
            skip: (req.body.pageIndex - 1) * req.body.pageSize,
            limit: req.body.pageSize,
            sort: {
                createAt: -1
            }
        },
        (err, data) => {
            if (err) {
                res.send({
                    status_code: 201,
                    message: err,
                    data: null
                })
            } else {
                res.json({
                    status_code: 200, //状态码   200是成功   其他的码是错误
                    message: 'success', //返回的信息
                    data: data, ///返回的数据   若没有就是null
                    // count: count
                })
            }
        }
    )
}
// bug条目更新
exports.UpdateBugById = async function (req, res) {
    var id = req.body.id
    var update = req.body
    Bug.findByIdAndUpdate(id, update, {
        new: true
    }, function (err, result) {
        if (err) {
            res.send({
                status_code: 201,
                message: err,
                data: null
            })
        } else {
            res.json({
                data: result,
                status_code: 200,
                message: 'success'
            })
        }
    })
}
// bug条目删除
exports.DeleteBugById = async function (req, res) {
    var id = req.body.id
    Bug.findByIdAndDelete(id, function (err, result) {
        if (err) {
            res.send({
                status_code: 201,
                message: err
            })
        } else {
            res.json({
                status_code: 200,
                message: 'success'
            })
        }
    })
}