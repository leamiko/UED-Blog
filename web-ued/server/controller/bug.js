var Bug = require('../models/bugItem');

// 新增bug条目
async function AddBugItems(req, res) {
    var postData = {
        title: req.body.title,
        keyword: req.body.keyword,
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
async function GetBugDetail(req, res) {
    let bid = req.query.bugId
    Bug.findOne({
            _id: bid
        },
        (err, data) => {
            if (data) {
                return res.json({
                    status_code: 200,
                    message: 'success',
                    data: data
                })
            }
            if (err) {
                return res.json({
                    status_code: 201,
                    message: err,
                    data: null
                })
            }
        }
    )
}
// 获取bug列表
async function GetBugList(req, res) {
    let filters = {
        deleted: false
    }
    if (req.body.filters) {
        if (req.body.filters.title) {
            filters.title = new RegExp(req.body.filters.title)
        }
        if (req.body.filters.keyword && req.body.filters.keyword.length > 0) {
            filters.keyword = {
                $in: req.body.filters.keyword
            }
        }
        if (req.body.filters.bugStatus) {
            filters.bugStatus = req.body.filters.bugStatus
        }
        if (req.body.filters.author) {
            filters.author = req.body.filters.author
        }
    }
    const count = await Bug.count(filters)
    Bug.find(
        filters,
        null, {
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
                    count: count
                })
            }
        }
    )
}
// bug条目更新
async function UpdateBugById(req, res) {
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
async function DeleteBugById(req, res, next) {
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

exports = {
    AddBugItems: AddBugItems(),
    GetBugDetail: GetBugDetail(),
    GetBugList: GetBugList(),
    UpdateBugById: UpdateBugById(),
    DeleteBugById: DeleteBugById()
}