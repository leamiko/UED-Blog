var express = require('express');
var router = express.Router();
var register = require('../controller/register.js');

/* GET users listing. */
router.post('/registerAccount', function (req, res, next) {
    //调用controller方法
    register.registerAccount(req, res);
});

module.exports = router;