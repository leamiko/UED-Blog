var Avatar = require('../../models/avatar.js') //引入user表

//头像列表
exports.getAvatarList = function(req, res) {
  Avatar.find({}, function(err, avatars) {
    if (err) {
      return res.json({
        status_code: 201,
        message: err,
        data: null
      })
    }
    return res.json({
      status_code: 200,
      message: '获取头像成功！',
      data: avatars
    })
  })
}
