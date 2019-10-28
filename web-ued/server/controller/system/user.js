var Admin = require('../../models/admin.js') //引入user表
var crypto = require('crypto')
const ms = require('ms')

//登录
exports.login = function(req, res) {
  const { account, passWord, checked } = req.body
  var md5 = crypto.createHash('md5')
  const end_paw = md5.update(passWord).digest('hex')
  const params = {
    account: account,
    passWord: end_paw
  }
  Admin.findOne(params, function(err, admin) {
    if (err) {
      logger.error(err)
      return res.json({
        status_code: 201,
        message: err,
        data: null
      })
    }
    if (admin) {
      req.session.admin = admin
      if (checked) req.session.cookie.maxAge = ms('30d')
      return res.json({
        status_code: 200,
        message: '登录成功！',
        data: admin
      })
    } else {
      return res.json({
        status_code: 401,
        message: '用户名或密码错误！',
        data: null
      })
    }
  })
}

//退出
exports.logOut = function(req, res) {
  delete req.session.admin
  return res.json({
    status_code: 200,
    message: '退出成功！',
    data: null
  })
}

//注册/编辑
exports.register = function(req, res) {
  if (req.body._id) {
    var postData = {
      account: req.body.account,
      authorization: req.body.authorization,
      changeId: req.session.admin._id
    }
    Admin.findByIdAndUpdate(req.body._id, postData, function(err, admin) {
      if (err) {
        return res.json({
          code: 201,
          message: err,
          data: null
        })
      } else {
        return res.json({
          status_code: 200,
          message: '编辑成功！',
          data: null
        })
      }
    })
  } else {
    if (req.body.account === '' && req.body.account.length === 0) {
      return res.json({
        code: 201,
        message: '账号不能为空',
        data: null
      })
    }
    if (req.body.passWord === '' && req.body.passWord.length === 0) {
      return res.json({
        code: 201,
        message: '密码不能为空',
        data: null
      })
    }
    var md5 = crypto.createHash('md5')
    const end_paw = md5.update(req.body.passWord).digest('hex')
    var postData = {
      account: req.body.account,
      passWord: end_paw,
      authorization: req.body.authorization,
      createdId: req.session.admin._id,
      changeId: req.session.admin._id
    }
    Admin.findOne(
      {
        account: postData.account
      },
      function(err, data) {
        if (data) {
          return res.json({
            code: 201,
            message: '用户已被注册',
            data: null
          })
        } else {
          var admin = new Admin({
            passWord: postData.passWord,
            account: postData.account,
            authorization: postData.authorization,
            createdId: postData.createdId,
            changeId: postData.changeId
          })
          admin.save(function(err) {
            if (err) {
              return res.json({
                code: 201,
                message: err,
                data: null
              })
            } else {
              return res.json({
                status_code: 200,
                message: '注册成功！',
                data: null
              })
            }
          })
        }
      }
    )
  }
}

//超级账号
exports.superAdmin = function(req, res) {
  var md5 = crypto.createHash('md5')
  var admin = new Admin({
    passWord: md5.update('admin').digest('hex'),
    account: 'admin'
  })
  admin.save(function(err) {
    if (err) {
      return res.json({
        code: 201,
        message: err,
        data: null
      })
    } else {
      return res.json({
        status_code: 200,
        message: '注册成功！',
        data: null
      })
    }
  })
}

// 账号列表
exports.adminList = async function(req, res) {
  const page = req.body.paging.page
  const limit = req.body.paging.limit
  let filters = {}
  if (req.body.filters.account) {
    filters.title = new RegExp(req.body.filters.account)
  }
  const count = await Admin.countDocuments(filters)
  Admin.find(filters, null, {
    skip: (page * 1 - 1) * 15,
    limit: limit,
    sort: { createdAt: -1 }
  })
    .populate({
      path: 'createdId',
      select: ['account']
    })
    .populate({
      path: 'changeId',
      select: ['account']
    })
    .exec(function(err, admins) {
      if (err) {
        return res.json({
          status_code: 201,
          message: err,
          data: null
        })
      }
      res.json({
        status_code: 200,
        message: '获取列表成功！',
        data: {
          total: count,
          data: admins
        }
      })
    })
}

// 删除
exports.deleteAdmin = function(req, res) {
  Admin.findByIdAndRemove(req.query.adminId, function(err, admin) {
    if (err) {
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
}
