let express = require('express');
let router = express.Router();
require('./../util/util')
// 获取用户模型
let User = require('../models/user');

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
  let productId = req.body.productId;
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
  User.findOne({ userId: userId }, function (err, doc) {
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

// 删除收货地址
router.post('/delAddress', function (req, res, next) {
  let addressId = req.body.addressId;
  let userId = req.cookies.userId;
  User.update({ userId: userId }, { $pull: { addressList: { addressId: addressId } } }, function (err, doc) {
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
        result: '删除成功'
      })
    }
  })
})

// 设置默认地址
router.post('/setDefault', function (req, res, next) {
  let userId = req.cookies.userId,
    addressId = req.body.addressId;
  if (!addressId) {
    res.json({
      status: '1003',
      msg: 'addressId is null',
      result: ''
    })
  } else {
    User.findOne({ userId: userId }, function (err, doc) {
      if (err) {
        res.json({
          status: '0',
          msg: err.message,
          result: ''
        })
      } else {
        let addressList = doc.addressList;
        addressList.forEach((item) => {
          if (item.addressId == addressId) {
            item.isDefault = true;
          } else {
            item.isDefault = false;
          }
        });

        doc.save(function (err1, doc1) {
          if (err1) {
            res.json({
              status: '0',
              msg: err.message,
              result: ''
            })
          } else {
            res.json({
              status: '1',
              msg: '',
              result: '保存成功'
            })
          }
        })
      }
    })
  }
})

// 用户订单
router.post('/payMent', function (req, res, next) {
  let userId = req.cookies.userId,
    addressId = req.body.addressId, // 收货地址id
    orderTotal = req.body.orderTotal;
  User.findOne({ userId: userId }, function (err, doc) {
    if (err) {
      res.json({
        status: '0',
        msg: err.message,
        result: ''
      })
    } else {
      let address = '',
        goodsList = [];
      // 获取当前用户传递的地址
      doc.addressList.forEach((item) => {
        if (addressId == item.addressId) {
          address = item;
        }
      })
      // 获取用户购物车购买的商品
      doc.cartList.filter((item) => {
        if (item.checked == '1') {
          goodsList.push(item);
        }
      })
      let platform = '622';

      let r1 = Math.floor(Math.random() * 10); // 0 - 9
      let r2 = Math.floor(Math.random() * 10); // 0 - 9

      let sysDate = new Date().Format('yyyyMMddhhmmss');
      let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');

      // 产生21为订单id
      let orderId = platform + r1 + sysDate + r2;
      // 订单
      let order = {
        orderId: orderId, // 订单id
        orderTotal: orderTotal, // 订单总金额
        addressInfo: address, // 地址信息
        goodsList: goodsList, // 商品列表
        orderStatis: '1', // 支付状态
        createDate: createDate // 订单日期
      }
      // 存进去
      doc.orderList.push(order);
      // 更新
      doc.save(function (err1, doc1) {
        if (err1) {
          res.json({
            status: '0',
            msg: err.message,
            result: ''
          })
        } else {
          res.json({
            status: '1',
            msg: '',
            result: {
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          })
        }
      })
    }
  })
})

// 查询购物车数量
router.get('/getCartCount', function (req, res, next) {
  if (req.cookies && req.cookies.userId) {
    let userId = req.cookies.userId;
    User.findOne({userId: userId}, function (err, doc) {
      if (err) {
        res.json({
          status: '0',
          msg: err.message,
          result: ''
        })
      } else {
        let cartList = doc.cartList;
        let cartCount = 0;
        // 计算出购物车数量
        cartList.map(function (item) {
          cartCount += parseInt(item.productNum)
        })
        res.json({
          status: '1',
          msg: '',
          result: cartCount
        })
      }
    })
  }
})

// 根据订单id 查询订单信息
router.get('/orderDetail', function (req, res, next) {
  let userId = req.cookies.userId,
    orderId = req.param('orderId');
  console.log('orderId', orderId)
  User.findOne({ userId: userId }, function (err, userInfo) {
    if (err) {
      res.json({
        status: '0',
        msg: err.message,
        result: ''
      })
    } else {
      let orderList = userInfo.orderList;
      if (orderList.length > 0) {
        let orderTotal = 0;
        orderList.forEach((item) => {
          if (item.orderId == orderId) {
            orderTotal = item.orderTotal;
          }
        });

        if (orderTotal > 0) {
          res.json({
            status: '1',
            msg: '',
            result: {
              orderTotal: orderTotal,
              orderId: orderId
            }
          })
        } else {
          res.json({
            status: '120002',
            msg: '无此订单',
            result: ''
          })
        }
      } else {
        res.json({
          status: '120001',
          msg: '当前用户未创建订单',
          result: ''
        })
      }
    }
  })
})
module.exports = router;
