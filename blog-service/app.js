var express = require("express");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
var cors = require("cors");
const log = require("./log");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var bugsRouter = require("./routes/bug");
var blogsRouter = require("./routes/blog");
var DictionaryRouter = require("./routes/dictionary");

var app = express();

// 自定义跨域中间件
var allowCors = function(req, res, next) {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};

// 使用跨域中间件
app.use(allowCors);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 使用 session 中间件
app.use(
  session({
    secret: "12345", // 对session id 相关的cookie 进行签名
    resave: false,
    name: "nssid",
    saveUninitialized: true, // 是否保存未初始化的会话
    cookie: {
      maxAge: 1000 * 60 * 60 // 设置 session 的有效时间，单位毫秒
    },
    store: new MongoStore({
      url: "mongodb://127.0.0.1:27017/session",
      collection: "sessions"
    })
  })
);

log.useLogger(app);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//判断是否登录
var isLogin = function(req, res, next) {
  if (req.originalUrl !== "/users/login") {
    if (!req.session.user) {
      return res.json({
        status_code: 403,
        message: "登录过期，请重新登录！",
        data: null
      });
    } else {
      next();
    }
  } else {
    next();
  }
};

app.use(isLogin);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/bugs", bugsRouter);
app.use("/blogs", blogsRouter);
app.use("/dictionary", DictionaryRouter);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  log.error(err);

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
