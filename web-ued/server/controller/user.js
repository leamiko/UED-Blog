var User = require('../models/user.js') //引入user表
var crypto = require('crypto')
const ms = require('ms')

exports.login = function(req, res) {
  const { account, passWord, checked } = req.body
  var md5 = crypto.createHash('md5')
  const end_paw = md5.update(passWord).digest('hex')
  const params = {
    account: account,
    passWord: end_paw
  }
  // req.session.user = params;
  // if (checked) req.session.cookie.maxAge = ms("30d");
  // return res.json({
  //   status_code: 200,
  //   message: "登录成功！",
  //   data: params
  // });
  User.findOne(params, function(err, user) {
    if (err) {
      console.log(err)
      return res.json({
        status_code: 201,
        message: err,
        data: null
      })
    }
    if (user) {
      req.session.user = user
      if (checked) req.session.cookie.maxAge = ms('30d')
      return res.json({
        status_code: 200,
        message: '登录成功！',
        data: user
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

exports.logOut = function(req, res) {
  delete req.session.user
  return res.json({
    status_code: 200,
    message: '退出成功！',
    data: null
  })
}

exports.register = function(req, res) {
  var md5 = crypto.createHash('md5')
  if (req.body.nickName === '' && req.body.nickName.length === 0) {
    res.send('昵称不能为空')
    return
  }
  if (req.body.passWord === '' && req.body.passWord.length === 0) {
    res.send('密码不能为空')
    return
  }
  if (req.body.account === '' && req.body.account.length === 0) {
    res.send('账号不能为空')
    return
  }
  // 密码加密
  md5.update(req.body.passWord)
  const pwd = md5.digest('base64') //将加密后的md5密码使用base64加密
  var postData = {
    nickName: req.body.nickName,
    passWord: pwd,
    account: req.body.account,
    avatar: req.body.avatar
  }
  console.log(postData)
  User.findOne(
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
        var user_1 = new User({
          nickName: postData.nickName,
          passWord: postData.passWord,
          account: postData.account,
          avatar: postData.avatar
        })
        user_1.save(function(err) {
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
