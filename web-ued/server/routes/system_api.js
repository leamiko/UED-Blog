var express = require('express')
const router = express.Router()
const { verifyMiddleware } = require('../middleware/verify.js')

var user = require('../controller/system/user')
var register = require('../controller/system/register.js')
var dictionary = require('../controller/system/dictionary')
var Dictionary = require('../models/dictionary.js')
var Bug = require('../models/bugItem')
var BuKeywords = require('../models/bugKeywords')
var blog = require('../controller/system/blog')

/* GET users listing. */
router.post('/login', function(req, res, next) {
  //调用controller方法
  user.login(req, res)
})

router.get('/logOut', function(req, res, next) {
  //调用controller方法
  user.logOut(req, res)
})

/* GET users listing. */
router.post('/registerAccount', function(req, res, next) {
  //调用controller方法
  register.registerAccount(req, res)
})

/* GET users listing. */
// 获取字典列表&&查询
router.post('/GetDictionaryList', (req, res, next) => {
  console.log(req)
  let pagesize = req.body.paging.pagesize //分页参数
  let pageIndex = req.body.paging.pageIndex //当前页码
  //条件查询参数
  let filters = {
    deleted: false
  }
  if (req.body.filter.name) {
    filters.name = new RegExp(req.body.filter.name)
  }
  if (req.body.filter.parentId) {
    filters.parentId = new RegExp(req.body.filter.parentId)
  }
  Dictionary.find(
    {
      parentId: ''
    },
    null,
    async function(err, newdata) {
      if (err) {
        logger.error(err)
        return res.json({
          status_code: 201,
          message: err,
          data: null
        })
      }
      let secondData = []

      for (var i = 0; i < newdata.length; i++) {
        var dicNew = JSON.parse(JSON.stringify(newdata[i]))
        // console.log(aa)
        var secondClass = await Dictionary.find(
          {
            $and: [
              {
                parentId: dicNew._id
              },
              filters
            ]
          },
          null,
          {
            skip: (pageIndex * 1 - 1) * pagesize,
            limit: pagesize
          }
        )
        if (secondClass != null) {
          for (dicClass of secondClass) {
            dicClass.parentName = dicNew.name
            secondData.push(dicClass)
          }
        }
      }
      const count = secondData.length
      return res.json({
        status_code: 200,
        message: '获取列表成功！',
        data: {
          total: count,
          data: secondData
        }
      })
    }
  )
})
// 新增编辑字典分类
router.post('/CreateOrEditDictionary', function(req, res, next) {
  console.log(req.body)
  if (req.body.name === '' || req.body.name.length === 0) {
    return res.json({
      status_code: 201,
      message: err,
      data: '分类名称不能为空'
    })
  }
  if (req.body._id) {
    var id = {
      _id: req.body._id
    }
    var postData = {
      name: req.body.name
    }
    Dictionary.findOne(
      {
        $and: [
          {
            parentId: req.body.parentId
          },
          {
            name: req.body.name
          }
        ]
      },
      function(err, data) {
        if (err) {
          return res.json({
            data: null,
            code: 201,
            message: err
          })
        }
        console.log(data)
        if (data) {
          return res.json({
            data: null,
            code: 201,
            message: '同级分类下已存在该分类名称！'
          })
        } else {
          Dictionary.update(id, postData, function(err, dic) {
            if (err) {
              logger.error(err)
              return res.json({
                code: 201,
                message: err,
                data: null
              })
            }
            return res.json({
              status_code: 200,
              message: '修改成功！',
              data: null
            })
          })
        }
      }
    )
  } else {
    var postData = {
      name: req.body.name,
      parentId: req.body.parentId
    }
    Dictionary.findOne(
      {
        $and: [
          {
            parentId: req.body.parentId
          },
          {
            name: req.body.name
          }
        ]
      },
      function(err, data) {
        if (err) {
          return res.json({
            data: null,
            code: 201,
            message: err
          })
        }
        if (data) {
          return res.json({
            data: null,
            code: 201,
            message: '该分类下已存在该分类名称！'
          })
        } else {
          Dictionary.create(postData, function(err, data) {
            if (err) {
              return res.json({
                code: 201,
                message: err,
                data: null
              })
            }
            return res.json({
              status_code: 200,
              message: '添加成功！',
              data: null
            })
          })
        }
      }
    )
  }
})
// 删除某个分类
router.get('/DeleteDictionaryById', async (req, res, next) => {
  const filter = {
    parentId: req.query._id,
    deleted: false
  }
  const id = {
    _id: req.query._id
  }
  var updateDic = {
    deleted: true
  }
  Dictionary.find(filter, function(err, dicData) {
    console.log(dicData)
    if (dicData) {
      return res.json({
        status_code: 200,
        message: '该分类下存在子级分类！',
        data: null
      })
    }
    Dictionary.update(id, updateDic, function(err, Dic) {
      if (err) {
        logger.error(err)
        return res.json({
          code: 201,
          message: err,
          data: null
        })
      }
      return res.json({
        status_code: 200,
        message: '删除成功！',
        data: null
      })
    })
  })
})
// 树形
router.post('/GetDictionaryTree', (req, res, next) => {
  var id = req.body._id
  var filter = {
    deleted: false
  }
  Dictionary.find(filter, null, function(err, TreeData) {
    if (err) {
      return res.json({
        code: 201,
        message: err,
        data: null
      })
    }
    let tree = dictionary.generateTree(TreeData, id)
    res.json({
      status_code: 200,
      message: '获取成功！', //返回的信息
      data: tree
    })
  })
})
// 获取模块
router.post('/GetModelList', async (req, res, next) => {
  Dictionary.find(
    {
      parentId: ''
    },
    null,
    function(err, modelList) {
      if (err) {
        return res.json({
          code: 201,
          message: err,
          data: null
        })
      }
      res.json({
        status_code: 200,
        message: '获取成功！', //返回的信息
        data: modelList
      })
    }
  )
})

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
      sort: { createAt: -1 }
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
})

// bug条目更新
router.post('/UpdateBugById', async (req, res, next) => {
  var id = req.body.id
  var update = req.body
  Bug.findByIdAndUpdate(id, update, { new: true }, function(err, result) {
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
})

// bug条目删除
router.post('/DeleteBugById', async (req, res, next) => {
  var id = req.body.id
  Bug.findByIdAndDelete(id, function(err, result) {
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
})

// 新增关键词
router.post('/AddBugKeywords', async (req, res, next) => {
  var dataCache = req.body
  // 保存到数据库
  BuKeywords.findOne(
    {
      label: dataCache.label
    },
    (err, data) => {
      if (err) throw err
      if (data) {
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
  })
})

//新增删除blog
router.post('/addEditBlog', function(req, res, next) {
  //调用controller方法
  blog.addEditBlog(req, res)
})

//获取blog详情
router.get('/getBlog', function(req, res, next) {
  blog.getBlog(req, res)
})

//blog列表
router.post('/getBlogList', function(req, res, next) {
  //调用controller方法
  blog.getBlogList(req, res)
})

//blog删除
router.get('/deleteBlog', function(req, res, next) {
  //调用controller方法
  blog.deleteBlog(req, res)
})

//blog点赞
router.get('/likeBlog', function(req, res, next) {
  //调用controller方法
  blog.likeBlog(req, res)
})

//blog评论
router.post('/commentBlog', function(req, res, next) {
  //调用controller方法
  blog.commentBlog(req, res)
})

//获取blog评论
router.get('/getBlogComment', function(req, res, next) {
  //调用controller方法
  blog.getBlogComment(req, res)
})

module.exports = router
