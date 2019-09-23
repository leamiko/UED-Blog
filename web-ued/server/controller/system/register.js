var User = require('../../models/user.js') //引入comment表
const crypto = require('crypto')
//注册
exports.registerAccount = function(req, res) {
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
