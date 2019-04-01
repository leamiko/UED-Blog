var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const log = require('./log');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bugsRouter = require('./routes/bug');

var app = express();
var cors = require('cors');
var whitelist = ['http://localhost:4200']
//cors 跨域配置
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;

  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = {
      origin: true
    } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = {
      origin: false
    } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors(corsOptionsDelegate));

log.useLogger(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/bugs', bugsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  log.error(err);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;