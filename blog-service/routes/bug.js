var express = require('express')
var router = express.Router()
var Bug = require('../models/bugItem')
var BuKeywords = require('../models/bugKeywords')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource')
})
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
  }
  Bug.findOne(
    {
      title: postData.title
    },
    (err, data) => {
      if (data) {
        res.send({
          success: false,
          message: '添加失败，该bug条目已存在！'
        })
        console.log('添加失败，该bug条目已存在！')
      } else {
        // 保存到数据库
        Bug.create([postData], (err, data) => {
          if (data) {
            res.send({
              success: true,
              message: '添加成功！'
            })
            console.log('添加成功！')
          }
          // if (err) throw err;
        })
      }
    }
  )
})
// 根据bug条目id查看bug详情
router.get('/GetBugDetail', (req, res) => {
  let bid = req.query.bugId
  Bug.findOne(
    {
      _id: bid
    },
    (err, data) => {
      if (data) {
        console.log(data)
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
})
// 获取bug列表
router.post('/GetBugList', async (req, res, next) => {
  let filters = {
    deleted: false
  }
  if (req.body.filters) {
    if (req.body.filters.title) {
      filters.title = new RegExp(req.body.filters.title)
    }
    if (req.body.filters.keyword && req.body.filters.keyword.length > 0) {
      filters.keyword = { $in: req.body.filters.keyword }
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
    null,
    {
      skip: (req.body.pageIndex - 1) * req.body.pageSize,
      limit: req.body.pageSize,
      sort: { createdAt: -1 }
    },
    (err, data) => {
      if (err) {
        res.send({
          message: '获取bug列表失败！'
        })
      } else {
        res.json({
          status_code: 200, //状态码   200是成功   其他的码是错误
          message: '获取成功！', //返回的信息
          data: data, ///返回的数据   若没有就是null
          count: count
        })
      }
    }
  )
})

// bug条目更新
router.post('/UpdateBugById', async (req, res, next) => {
  var id = req.body.id
  var update = req.body
  Bug.findByIdAndUpdate(id, update, { new: true }, function(err, result) {
    if (err) {
      res.send({
        message: '修改失败'
      })
    } else {
      res.json({
        data: result,
        status_code: 200,
        message: 'success'
      })
    }
  })
})

// bug条目删除
router.post('/DeleteBugById', async (req, res, next) => {
  var id = req.body.id
  Bug.findByIdAndDelete(id, function(err, result) {
    if (err) {
      res.send({
        message: '删除失败'
      })
    } else {
      res.json({
        status_code: 200,
        message: 'success'
      })
    }
  })
})

// 新增关键词
router.post('/AddBugKeywords', async (req, res, next) => {
  console.log('zou')
  var dataCache = req.body
  // 保存到数据库
  BuKeywords.findOne(
    {
      label: dataCache.label
    },
    (err, data) => {
      if (err) throw err
      if (data) {
        console.log('关键词添加失败！')
      } else {
        BuKeywords.create(dataCache, (err, data) => {
          if (err) throw err
          res.json({
            status_code: 200,
            message: 'success'
          })
        })
      }
    }
  )
})
// 获取所有关键词
router.get('/GetAllBugKeywords', async (req, res, next) => {
  BuKeywords.find({}, (err, data) => {
    if (err) throw err
    res.json({
      data: data,
      status_code: 200,
      message: 'success'
    })
    console.log('获取所有关键词成功')
  })
})
module.exports = router
