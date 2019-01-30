var express = require('express');
var router = express.Router();

// 获取用户模型
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 登录接口
router.post('/login', function (req, res, next) {
  let param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  };
  User.findOne(param, function (err, doc) {
    console.log('node', err, doc)
    if (err) {
      res.json({
        status: '0',
        msg: '用户名密码错误'
      });
    } else {
      if (doc) {
        // cookie需要存在服务器端 要res
        // 如果查询到登录用户，此用户存放在cookie里
        // 三个参数 名称， 值， 配置信息
        res.cookie('userId', doc.userId, {
          path: '/', // 放在服务器根目录
          maxAge: 1000 * 60 * 60 // 时间 一个小时
        });
        // 客户端 req 存储在session
        // req.session.user = doc;
        res.json({
          status: '1',
          msg: '',
          result: {
            userName: doc.userName
          }
        })
      }
    }
  });
});

// 注销接口
router.post('/logout', function (req, res, next) {
  // 让cookie 失效
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  });
  res.json({
    status: '1',
    msg: '',
    result: ''
  })
})
module.exports = router;
