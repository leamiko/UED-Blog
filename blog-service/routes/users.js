var express = require('express');
var router = express.Router();
var user = require('../controller/user');

/* GET users listing. */
router.get('/login', function (req, res, next) {
  //调用controller方法
  // user.login(req, res);

  res.send({
    data: 'ok'
  })
});

module.exports = router;
