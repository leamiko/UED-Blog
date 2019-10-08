var Bug = require('../../models/bugItem');
var Dic = require('../../models/dictionary');

// 新增bug条目
exports.AddBugItems = function (req, res, next) {
  var postData = {
    title: req.body.title,
    // keyword: req.body.keyword,
    tags: req.body.tags,
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
      if (err) {
        res.json({
          status_code: 201,
          message: err
        })
        next()
      } else {
        if (data) {
          res.send({
            status_code: 200,
            message: '添加失败，该bug条目已存在！'
          })
        } else {
          // 保存到数据库
          Bug.create([postData], (err2, data2) => {
            if (err2) {
              res.json({
                status_code: 201,
                message: err2
              })
              next()
            } else {
              res.send({
                status_code: 200,
                message: 'success'
              })
            }
          })
        }
      }
    }
  )
}
// 根据bug条目id查看bug详情
exports.GetBugDetail = function (req, res, next) {
  let bid = req.query.bugId
  Bug.findOne({
      _id: bid
    },
    (err, data) => {
      if (err) {
        res.json({
          status_code: 201,
          message: err,
          data: null
        })
        next()
      } else {
        res.json({
          status_code: 200,
          message: 'success',
          data: data
        })
      }
    }
  )
}
// 获取bug列表
exports.GetBugList = async function (req, res, next) {
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
    if (req.body.filters.tags && req.body.filters.tags.length > 0) {
      filters.tags = {
        $in: req.body.filters.tags
      }
    }
  }
  const count = await Bug.countDocuments(filters)
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
        next()
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
exports.UpdateBugById = async function (req, res, next) {
  var id = req.body.id
  var update = req.body
  Bug.findByIdAndUpdate(
    id,
    update, {
      new: true
    },
    function (err, result) {
      if (err) {
        res.send({
          status_code: 201,
          message: err,
          data: null
        })
        next()
      } else {
        res.json({
          data: result,
          status_code: 200,
          message: 'success'
        })
      }
    }
  )
}
// bug条目删除
exports.DeleteBugById = async function (req, res, next) {
  var id = req.body.id
  Bug.findByIdAndDelete(id, function (err, result) {
    if (err) {
      res.send({
        status_code: 201,
        message: err
      })
      next()
    } else {
      res.json({
        status_code: 200,
        message: 'success'
      })
    }
  })
}

// 获取tags列表
exports.GetBugTags = async function (req, res, next) {
  try {
    var rootTag = await Dic.find({
      name: 'bugTags'
    }).exec();
    const parentTag = await Dic.find({
      parentId: rootTag[0]._id
    })

    res.json({
      status_code: 200,
      message: 'success',
      data: parentTag
    })
  } catch (error) {
    res.send({
      status_code: 201,
      message: error
    })
    next(error)
  }
}