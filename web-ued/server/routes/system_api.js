var express = require('express')
const router = express.Router()
const { authorizationMiddleware } = require('../middleware/authorization.js')

var user = require('../controller/system/user')
var dictionary = require('../controller/system/dictionary')
var Dictionary = require('../models/dictionary.js')
var blog = require('../controller/system/blog')
var bugCtrler = require('../controller/system/bug')

/* GET home page. */
router.get('/index', function(req, res, next) {
  res.json({
    name: 'hello world!'
  })
})

/* GET users listing. */
router.post('/login', function(req, res, next) {
  user.login(req, res)
})
router.get('/logOut', function(req, res, next) {
  user.logOut(req, res)
})
router.get('/superAdmin', function(req, res, next) {
  user.superAdmin(req, res)
})

/* GET users listing. */
// 获取字典列表&&查询
router.post('/GetDictionaryList', (req, res, next) => {
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

/* bug管理--Start */

// 新增bug条目
router.post('/AddBugItems', (req, res, next) => {
  bugCtrler.AddBugItems(req, res, next)
})
// 根据bug条目id查看bug详情
router.get('/GetBugDetail', (req, res, next) => {
  bugCtrler.GetBugDetail(req, res, next)
})
// 获取bug列表
router.post('/GetBugList', (req, res, next) => {
  bugCtrler.GetBugList(req, res, next)
})

// bug条目更新
router.post('/UpdateBugById', async (req, res, next) => {
  bugCtrler.UpdateBugById(req, res, next)
})

// bug条目删除
router.post('/DeleteBugById', async (req, res, next) => {
  bugCtrler.DeleteBugById(req, res, next)
})

// 新增关键词
router.post('/AddBugKeywords', async (req, res, next) => {
  bugCtrler.AddBugKeywords(req, res, next)
})
// 获取所有关键词
router.get('/GetAllBugKeywords', async (req, res, next) => {
  bugCtrler.GetAllBugKeywords(req, res, next)
})

/* bug管理--End */

/**
 * 文章管理
 */
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

/**
 * 用户管理
 */
// 注册账号
router.post('/registerAdmin', function(req, res, next) {
  user.register(req, res)
})
//账号列表
router.post('/adminList', authorizationMiddleware, function(req, res, next) {
  user.adminList(req, res)
})
//删除账号
router.get('/deleteAdmin', function(req, res, next) {
  user.deleteAdmin(req, res)
})

module.exports = router
