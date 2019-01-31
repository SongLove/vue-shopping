var express = require('express');
var router = express.Router();

// 获取用户模型
var User = require('../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// 登录接口
router.post('/login', function (req, res, next) {
  let param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  };
  console.log('param', param)
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
        res.cookie('userName', doc.userName, {
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
  res.cookie('userName', '', {
    path: '/',
    maxAge: -1
  });
  res.json({
    status: '1',
    msg: '',
    result: ''
  })
})

router.get('/checkLogin', function (req, res, next) {
  if (req.cookies.userId) {
    res.json({
      status: '1',
      msg: '',
      result: req.cookies.userName || ''
    })
  } else {
    res.json({
      status: '0',
      msg: '当前未登录',
      result: ''
    })
  }
})

// 当前用户购物车数据列表
router.get('/cartList', function (req, res, nex) {
  let userId = req.cookies.userId;
  User.findOne({ userId: userId }, function (err, doc) {
    if (err) {
      res.json({
        status: '0',
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: '1',
          msg: '',
          result: doc.cartList
        })
      }
    }
  })
})

// 删除用户购物车
router.post('/cartDelGood', function (req, res, next) {
  let userId = req.cookies.userId;
  let productId = req.body.productId
  User.update({ userId: userId }, { $pull: { cartList: { productId: productId } } }, function (err, doc) {
    if (err) {
      res.json({
        status: "0",
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: "1",
        msg: '删除成功',
        result: ''
      })
    }
  })
})

// 商品加减操作
router.post('/cartEdit', function (req, res, next) {
  let userId = req.cookies.userId,
    productId = req.body.productId,
    productNum = req.body.productNum,
    checked = req.body.checked;
  // 跟新某个 集合下面的某个参数
  User.update({ userId: userId, 'cartList.productId': productId }, {
    'cartList.$.productNum': productNum,
    'cartList.$.checked': checked,
  }, function (err, doc) {
    if (err) {
      res.json({
        status: "0",
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: "1",
        msg: '',
        result: '更新成功'
      })
    }
  })
})

// 全选商品
router.post('/editCheckAll', function (req, res, next) {
  let userId = req.cookies.userId,
    checkAll = req.body.checkAll ? '1' : '0';
  User.findOne({ userId: userId }, function (err, user) {
    if (err) {
      res.json({
        status: '0',
        msg: err.message,
        result: ''
      })
    } else {
      user.cartList.forEach(element => {
        element.checked = checkAll;
      });
      user.save((error, userDocument) => {
        if (error) {
          res.json({
            status: '0',
            message: error.message,
            result: 'err'
          })
        } else {
          res.json({
            status: '1',
            message: '',
            result: '更新成功'
        })
        }
      })
    }
  })
})

// 查询0收货地址
router.get('/addressList', function (req, res, next) {
  let userId = req.cookies.userId;
  User.findOne({userId: userId}, function (err, doc) {
    if (err) {
      res.json({
        status: '0',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '1',
        msg: '',
        result: doc.addressList
      })
    }
  })
})
module.exports = router;
