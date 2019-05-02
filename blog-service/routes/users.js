var express = require('express');
var router = express.Router();
var user = require('../controller/user');

/* GET users listing. */
router.post('/login', function (req, res, next) {
  //调用controller方法
  user.login(req, res);
});

router.get('/logOut', function (req, res, next) {
  //调用controller方法
  user.logOut(req, res);
});

module.exports = router;
