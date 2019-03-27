module.exports = router;
var express = require('express');
var router = express.Router();
var Dictionary = require('../controller/dictionary');

/* GET users listing. */
// 获取字典列表&&查询
app.post('/GetDictionaryList', (req, res) => {
  //解决跨域
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  console.log(req.body)
  let pagesize = req.body.query.pagesize || 10; //分页参数
  let pageIndex = req.body.query.pageIndex || 1; //当前页码
  let params = {
    //条件查询参数
    name: req.body.query.filter.name,
    parentId: req.body.query.filter.id,
  };
  let mp = {};
  for (let i in params) {
    if (params[i] !== undefined) {
      mp[i] = params[i]
    }
  }
  Dictionary.find({
    ...mp
  }).skip((parseInt(pageIndex) - 1) * parseInt(pagesize)).limit(parseInt(pagesize)).exec(function (err, newdata) {
    if (err) return res.send({
      successs: false,
      message: '请求失败'
    })
    let count = newdata.length;
    result = {
      data: newdata,
      count: count
    }
    res.send(result)
  })
});
// 新增字典分类
router.post('/CreateDictionary', function (req, res, next) {
  //解决跨域
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);

  //调用controller方法
  // Dictionary.login(req, res);
  console.log(req.body.entity);
  if (req.body.entity.name === '' && req.body.entity.name.length === 0) {
    res.send("分类名称不能为空");
    return
  }
  var postData = {
    id: req.body.entity.id,
    parentId: req.body.entity.parentId,
    name: req.body.entity.name
  };
  Dictionary.findOne({
    name: postData.name
  }, function (err, data) {
    if (data) {
      res.send({
        successs: false,
        message: '该分类已存在'
      });
    } else {
      Dictionary.create(postData, function (err, data) {
        if (err) return handleError(err);
        if (!err) {
          res.send({
            successs: true,
            message: '注册成功'
          });
        } else {
          res.send({
            successs: false,
            message: '注册失败'
          })
        }
      })
    }
  })
});

module.exports = router;