var User = require('../../models/user.js') //引入user表
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
      logger.error(err)
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

//超级账号
// exports.insert = function(req, res) {
//   let username = "root";
//   let pwd = "root123456";
//   var md5 = crypto.createHash("md5");
//   const end_paw = md5.update(pwd).digest("hex");
//   var user = new User({
//     nickName: "root",
//     account: username, //用户账号
//     passWord: end_paw, //密码
//     authorization: 0
//   });
//   User.find({ account: username }, function(err, users) {
//     if (err) {
//       console.log(err);
//     } else {
//       if (users.length == 0) {
//         user.save(function(err, users) {
//           if (err) {
//             return res.json({
//               status_code: 401,
// 							message: "创建失败！",
// 							data: null
//             });
//           } else {
//             // res.redirect('/users/registerok');
//             return res.json({
//               status_code: 200,
// 							message: "新建成功！",
// 							data: null
//             });
//           }
//         });
//       } else {
//         return res.json({
//           status_code: 402,
//           message: "用户名已存在！",
// 					data: null
//         });
//       }
//     }
//   });
// };
