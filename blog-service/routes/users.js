var express = require('express');
var router = express.Router();
var user = require('../controller/user');

/* GET users listing. */
router.post('/login', function (req, res, next) {
  //调用controller方法
  user.login(req, res);
});

module.exports = router;
