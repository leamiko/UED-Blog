var express = require('express');
var router = express.Router();
var Dictionary = require('../models/dictionary.js');

/* GET users listing. */
// 获取字典列表&&查询
router.post('/GetDictionaryList', (req, res, next) => {
  console.log(req)
  let pagesize = req.body.paging.pagesize || 10; //分页参数
  let pageIndex = req.body.paging.pageIndex || 1; //当前页码
  let filters = {
    //条件查询参数
    name: req.body.filter.name,
    parentId: req.body.filter.id,
  };
  let mp = {};
  for (let i in filters) {
    if (filters[i] !== undefined) {
      mp[i] = filters[i]
    }
  }
  Dictionary.find({
    ...mp
  }).skip((parseInt(pageIndex) - 1) * parseInt(pagesize)).limit(parseInt(pagesize)).exec(function (err, newdata) {
    if (err) {
      // logger.error(err);
      return res.json({
        code: 201,
        message: err,
        data: null
      })
    };
    let count = newdata.length;
    return res.json({
      status_code: 200,
      message: '获取列表成功！',
      data: {
        total: count,
        data: newdata
      }
    })
  })
});
// 新增编辑字典分类
router.post('/CreateDictionary', function (req, res, next) {
  console.log(req.body.entity);
  if (req.body.entity.name === '' && req.body.entity.name.length === 0) {
    res.send("分类名称不能为空");
    return
  }
  var postData = {
    parentId: req.body.entity.parentId,
    name: req.body.entity.name
  };
  if (req.body._id) {
    var id = {
      _id: req.body._id
    };
    Dictionary.update(id, postData, function (err, dic) {
      if (err) {
        // logger.error(err);
        return res.json({
          code: 201,
          message: err,
          data: null
        })
      };
      return res.json({
        status_code: 200,
        message: '修改成功！',
        data: null
      })
    })
  } else {
    Dictionary.findOne({
      name: postData.name,
      parentId: postData.parentId,
    }, function (err, data) {
      if (data) {
        res.send({
          successs: false,
          message: '该分类下已存在该分类名称！'
        });
      } else {
        Dictionary.create(postData, function (err, data) {
          if (err) {
            // logger.error(err);
            return res.json({
              code: 201,
              message: err,
              data: null
            })
          };
          return res.json({
            status_code: 200,
            message: '添加成功！',
            data: null
          })
        })
      }
    })
  }

});

// 删除某个分类
router.get('/DeleteDictionaryById', async (req, res, next) => {
  var id = req.query.id
  var updateDic = {
    deleted: true
  }
  Dictionary.update(id, updateDic, function (err, blog) {
    if (err) {
      logger.error(err);
      return res.json({
        code: 201,
        message: err,
        data: null
      });
    }
    return res.json({
      status_code: 200,
      message: "删除成功！",
      data: null
    });
  });
})
// 树形
// router.post('/GetDictionaryTree', async (req, res, next) => {
//   var id = req.body.id
//   var filters = {
//     deleted: false
//   }
//   Dictionary.find(
//     filters,
//     null, {},
//     function (err, dictionaryData) {
//       if (err) {
//         logger.error(err);
//         return res.json({
//           status_code: 201,
//           message: err,
//           data: null
//         });
//       }
//       dictionaryData.
//       return res.json({
//         status_code: 200,
//         message: "获取列表成功！",
//         data: {
//           total: count,
//           data: books
//         }
//       });
//     }
//   );
// })
// 获取模块
router.post('/GetModelList', async (req, res, next) => {
  var ModelList = await Dictionary.find({
    parentId: '',
  }, null);
  res.json({
    status_code: 200, //状态码   200是成功   其他的码是错误
    message: '获取成功！', //返回的信息
    data: ModelList,
  })
})

module.exports = router;