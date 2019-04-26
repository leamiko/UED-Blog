var User = require('../models/user.js'); //引入user表
const logger = require('../log'); //引入日志
var crypto = require('crypto');
const ms = require('ms');

exports.login = function(req, res) {
	const { account, passWord, checked } = req.body;
	var md5 = crypto.createHash('md5');
	const end_paw = md5.update(passWord).digest('hex');
	const params = {
		account: account,
		passWord: end_paw,
		checked: checked,
	};
	req.session.user = params;
	console.log(req.session)
	if (checked) req.session.maxAge = ms('30d');
	return res.json({
		status_code: 200,
		message: '登录成功！',
		data: params,
	});
	// User.findOne(params, function(err, user) {
	// 	if (err) {
	// 		logger.error(err);
	// 		return res.json({
	// 			status_code: 201,
	// 			message: err,
	// 			data: null,
	// 		});
	// 	}
	// 	if (user) {
	// 		req.session.user = user;
	// 		if (checked) ctx.session.maxAge = ms('30d');
	// 		return res.json({
	// 			status_code: 200,
	// 			message: '登录成功！',
	// 			data: user,
	// 		});
	// 	} else {
	// 		return res.json({
	// 			status_code: 401,
	// 			message: '用户名或密码错误！',
	// 			data: null,
	// 		});
	// 	}
	// });
};

exports.logOut = function(req, res) {
	console.log(req.session)
	req.session.user = null;
	return res.json({
		status_code: 200,
		message: '退出成功！',
		data: user,
	});
};
