var User = require('../../models/user.js') //引入user表
var request = require('request')

exports.wxLogin = function(req, res) {
  var code = req.query.code
  console.log(code)
  // 向微信服务器请求sesion_key
  request.get(
    {
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      json: true,
      qs: {
        grant_type: 'authorization_code',
        appid: process.env.WX_APP_ID,
        secret: process.env.WX_APP_SECRET,
        js_code: code
      }
    },
    function(err, resp, data) {
      if (resp.statusCode == 200) {
        User.findOne({ wxOpenId: data.openid }, function(err, user) {
          if (user) {
            // 登录
            req.session.user = user
            return res.json({
              status_code: 200,
              message: '登录成功！',
              user: user
            })
          } else {
            // 绑定
            return res.json({
              status_code: 401,
              message: '请先登录或注册账号！',
              data: null
            })
          }
        })
      }
    }
  )
}
