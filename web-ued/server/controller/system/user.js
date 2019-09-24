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

//注册
exports.register = function(req, res) {
  var md5 = crypto.createHash('md5')
  if (req.body.passWord === '' && req.body.passWord.length === 0) {
    res.send('密码不能为空')
    return
  }
  if (req.body.account === '' && req.body.account.length === 0) {
    res.send('账号不能为空')
    return
  }
  var md5 = crypto.createHash('md5')
  const end_paw = md5.update(passWord).digest('hex')
  var postData = {
    account: req.body.account,
    passWord: end_paw
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
        var admin = new User({
          passWord: postData.passWord,
          account: postData.account
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
