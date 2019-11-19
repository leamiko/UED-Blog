var Avatar = require('../../models/avatar.js') //引入user表

// 新增
exports.addAvatar = function(req, res) {
  let avatars = req.body
  Avatar.collection.insertMany(avatars, function(err, avatars) {
    if (err) {
      // TODO: handle error
    } else {
      return res.json({
        status_code: 200,
        message: '上传成功！',
        data: null
      })
    }
  })
}

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

//头像删除
exports.deleteAvatar = function(req, res) {
  var whereAvatar = {
    _id: req.query.avatarId
  }
  Avatar.remove(whereAvatar, function(err, avatar) {
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
