var User = require('../../models/user.js') //引入user表
var crypto = require('crypto')
const OAuth = require('wechat-oauth')
const wxPcClient = new OAuth(process.env.WX_WEB_ID, process.env.WX_WEB_SECRET)

exports.login = function(req, res) {
  const { account, passWord } = req.body
  var md5 = crypto.createHash('md5')
  const end_paw = md5.update(passWord).digest('hex')
  const params = {
    account: account,
    passWord: end_paw
  }
  User.findOne(params, function(err, user) {
    if (err) {
      return res.json({
        status_code: 201,
        message: err,
        data: null
      })
    }
    if (user) {
      req.session.user = user
      return res.json({
        status_code: 200,
        message: '登录成功！',
        user: user
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
  if (req.body.account === '' && req.body.account.length === 0) {
    res.send('账号不能为空')
    return
  }
  if (req.body.passWord === '' && req.body.passWord.length === 0) {
    res.send('密码不能为空')
    return
  }
  // 密码加密
  const pwd = md5.update(req.body.passWord).digest('hex')
  var postData = {
    account: req.body.account,
    passWord: pwd
  }
  User.findOne(
    {
      account: postData.account
    },
    function(err, data) {
      if (data) {
        return res.json({
          status_code: 201,
          message: '用户已被注册',
          data: null
        })
      } else {
        var user_1 = new User({
          account: postData.account,
          passWord: postData.passWord
        })
        user_1.save(function(err, user) {
          if (err) {
            return res.json({
              status_code: 201,
              message: err,
              data: null
            })
          } else {
            req.session.user = user
            return res.json({
              status_code: 200,
              message: '注册成功！',
              user: user
            })
          }
        })
      }
    }
  )
}

exports.wxLogin = function(req, res) {
  // 这里接收前端的 redirect_url 传递的 code
  const { code } = req.query
  wxPcClient.getAccessToken(code, (err, result) => {
    if (!err) {
      const openId = result.data.openid
      return res.json({
        result: result
      })
      // wxPcClient.getUser(openId, (err, result) => {
      //   // 这里获取到了用户的信息, 可以存储在数据库中
      //   const { unionid } = result
      //   // console.log(unionid)
      //   User.findOne({ wxUnionId: unionid }, function(err, user) {
      //     if (user) {
      //       // 登录
      //       req.session.user = user
      //       return res.json({
      //         status_code: 200,
      //         message: '登录成功！',
      //         user: user
      //       })
      //     } else {
      //       // 绑定
      //       if (req.session.user) {
      //         User.findByIdAndUpdate(
      //           req.session.user._id,
      //           { wxUnionId: unionid },
      //           function(err, user) {
      //             if (user) {
      //               return res.json({
      //                 status_code: 200,
      //                 message: '绑定成功！',
      //                 user: user
      //               })
      //             }
      //           }
      //         )
      //       } else {
      //         return res.json({
      //           status_code: 401,
      //           message: '请先登录绑定账号！',
      //           data: false
      //         })
      //       }
      //     }
      //   })
      // })
    }
  })
}

exports.isLogin = function(req, res) {
  if (req.session.user) {
    return res.json({
      status_code: 200,
      message: '已登陆状态！',
      data: true
    })
  } else {
    return res.json({
      status_code: 200,
      message: '未登录状态！',
      data: false
    })
  }
}

exports.editInfo = function(req, res) {
  User.findOne(
    {
      nickName: req.body.nickName
    },
    function(err, user) {
      if (err) {
        return res.json({
          status_code: 201,
          message: err,
          data: null
        })
      }
      if (user) {
        // 如果有该昵称的用户，则昵称重复
        if (user._id != req.body.id) {
          res.send('该昵称已存在！')
          return
        }
      }
      User.findByIdAndUpdate(req.body.id, req.body, { new: true }, function(
        errors,
        result
      ) {
        if (errors) {
          return res.json({
            status_code: 201,
            message: errors,
            data: null
          })
        }
        if (result) {
          return res.json({
            status_code: 200,
            message: '修改成功！',
            data: result
          })
        }
      })
    }
  )
}
