var Dictionary = require('../../models/dictionary.js');
var dictionaryTool = require('./dicTool.js');

// 获取字典列表&&查询
// 获取bug列表
exports.GetDictionaryList = async function(req, res, next) {
  let pagesize = req.body.paging.pagesize; //分页参数
  let pageIndex = req.body.paging.pageIndex; //当前页码
  //条件查询参数
  let filters = {
    deleted: false
  };
  if (req.body.filter.name) {
    filters.name = new RegExp(req.body.filter.name);
  }
  if (req.body.filter.parentId) {
    filters.parentId = new RegExp(req.body.filter.parentId);
  }
  Dictionary.find(
    {
      parentId: ''
    },
    null,
    async function(err, newdata) {
      if (err) {
        logger.error(err);
        return res.json({
          status_code: 201,
          message: err,
          data: null
        });
      }
      let secondData = [];

      for (var i = 0; i < newdata.length; i++) {
        var dicNew = JSON.parse(JSON.stringify(newdata[i]));
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
        );
        if (secondClass != null) {
          for (dicClass of secondClass) {
            dicClass.parentName = dicNew.name;
            secondData.push(dicClass);
          }
        }
      }
      const count = secondData.length;
      return res.json({
        status_code: 200,
        message: '获取列表成功！',
        data: {
          total: count,
          data: secondData
        }
      });
    }
  );
};
// 新增编辑字典分类
exports.CreateOrEditDictionary = function(req, res, next) {
  if (req.body.name === '' || req.body.name.length === 0) {
    return res.json({
      status_code: 201,
      message: err,
      data: '分类名称不能为空'
    });
  }
  if (req.body._id) {
    var id = {
      _id: req.body._id
    };
    var postData = {
      name: req.body.name
    };
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
          });
        }
        if (data) {
          return res.json({
            data: null,
            code: 201,
            message: '同级分类下已存在该分类名称！'
          });
        } else {
          Dictionary.update(id, postData, function(err, dic) {
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
              message: '修改成功！',
              data: null
            });
          });
        }
      }
    );
  } else {
    var postData = {
      name: req.body.name,
      parentId: req.body.parentId
    };
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
          });
        }
        if (data) {
          return res.json({
            data: null,
            code: 201,
            message: '该分类下已存在该分类名称！'
          });
        } else {
          Dictionary.create(postData, function(err, data) {
            if (err) {
              return res.json({
                code: 201,
                message: err,
                data: null
              });
            }
            return res.json({
              status_code: 200,
              message: '添加成功！',
              data: null
            });
          });
        }
      }
    );
  }
};
// 删除某个分类
exports.DeleteDictionaryById = function(req, res, next) {
  const filter = {
    parentId: req.query._id,
    deleted: false
  };
  const id = {
    _id: req.query._id
  };
  var updateDic = {
    deleted: true
  };
  Dictionary.find(filter, function(err, dicData) {
    console.log(dicData);
    if (dicData.length > 0) {
      return res.json({
        status_code: 200,
        message: '该分类下存在子级分类！',
        data: null
      });
    }
    Dictionary.update(id, updateDic, function(err, Dic) {
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
        message: '删除成功！',
        data: null
      });
    });
  });
};
// 树形
exports.GetDictionaryTree = function(req, res, next) {
  var id = req.body._id;
  var filter = {
    deleted: false
  };
  Dictionary.find(filter, null, function(err, TreeData) {
    if (err) {
      return res.json({
        code: 201,
        message: err,
        data: null
      });
    }
    let tree = dictionaryTool.generateTree(TreeData, id);
    res.json({
      status_code: 200,
      message: '获取成功！', //返回的信息
      data: tree
    });
  });
};
// 获取模块
exports.GetModelList = async function(req, res, next) {
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
        });
      }
      res.json({
        status_code: 200,
        message: '获取成功！', //返回的信息
        data: modelList
      });
    }
  );
};


