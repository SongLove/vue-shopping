var createError = require('http-errors');
var express = require('express');
var path = require('path');
var ejs = require('ejs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');
var app = express();

// view engine setup
app.set('views', path.join(__dirname,  'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// 接口拦截
app.use(function (req, res, next) {
  // 如果userId 存在 将不拦截
  console.log('(req.cookies.userId', req.cookies.userId)
  if (req.cookies.userId) {
    next();
  } else {
    // req.originalUrl 请求完整地址
    console.log('req.originalUrl', req.originalUrl)
    console.log('req.path', req.path)
    if (req.originalUrl == '/users/login' || req.originalUrl == '/users/logout' || req.path.indexOf('/goods/list') > -1) {
      next();
    } else {
      res.json({
        status: '0',
        msg: '当前未登录',
        result: ''
      })
    }
  }
})
app.use('/', indexRouter);
app.use('/goods', goodsRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
