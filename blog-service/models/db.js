var mongoose = require('mongoose');
const log4js = require('../log');
const logger = log4js.getLogger();

var DB_URL = 'mongodb://localhost:27017/blog';

var blog = mongoose.createConnection(DB_URL);

blog.on('connected', function() {
	logger.info('Mongoose connection open to ' + DB_URL);
})

blog.on('error', function(err) {
	logger.info('Mongoose connection error: ' + err);
});

blog.on('disconnected', function() {
	logger.info('Mongoose connection disconnected');
});

module.exports = blog;