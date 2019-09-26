const { apiList } = require('../static/js/api')
var Admin = require('../models/admin.js')

function authorizationMiddleware(req, res, next) {
  if (req.session.admin.account !== 'admin') {
    const url = req.originalUrl
    let code
    for (let i = 0; i < apiList.length; i++) {
      if (apiList[i].apis.indexOf(url) > -1) {
        code = apiList[i].code
      }
    }
    if (code) {
      Admin.findById(req.session.admin._id, function(err, admin) {
        if (err) {
          return res.json({
            status_code: 403,
            message: '无权限，请向管理员申请权限！',
            data: null
          })
        }
        if (admin.authorization.indexOf(code) > -1) {
          next()
        } else {
          return res.json({
            status_code: 403,
            message: '无权限，请向管理员申请权限！',
            data: null
          })
        }
      })
    } else {
      next()
    }
  } else {
    next()
  }
}

module.exports = { authorizationMiddleware }
