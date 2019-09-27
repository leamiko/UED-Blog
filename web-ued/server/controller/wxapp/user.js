var User = require('../../models/user.js') //引入user表

exports.wxLogin = function(req, res) {
  var code = req.query.code
  var cookies = req.cookies
  //生成当前服务器时间
  var curTime = moment().format('YYYY-MM-DD HH:mm:ss')
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
        console.log(data)
        // var sessionKey = String(data.session_key)
        // var openId = data.openid
        // //自定义的加密，作为session_id
        // var skey = sha1(sessionKey)
        // var data = {
        //   lastTime: curTime,
        //   curTime: curTime,
        //   cookies: cookies
        // }
        // var sessionData = {
        //   session_id: skey,
        //   expires: 60000,
        //   data: JSON.stringify(data)
        // }
        // //session的MySQL管理器，设置session（如果session_id不存在，则写入数据库）
        // sessionStore.set(skey, sessionData, function(err) {
        //   if (err) console.log(err)
        // })
        // //返回给客户端
        // res.json({ session_data: sessionData })
      } else {
        res.json(err)
      }
    }
  )
}
