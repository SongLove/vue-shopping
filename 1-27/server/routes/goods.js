let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Goods = require('../models/goods');
// 获取user 集合模型
let User = require('../models/user');

// 连接mongodb数据库
// 在数据库创建了密码的情况下
// mongoose.connect('mongodb://root:123456@127.0.0.1:27017/demo');
mongoose.connect('mongodb://127.0.0.1:27017/shopping');
// 连接mongodb数据库成功
mongoose.connection.on('connected', function () {
  console.log('MongoDB connected success.')
});
// 连接mongodb数据库失败
mongoose.connection.on('error', function () {
  console.log('MongoDB connected fail.')
});
// 连接mongodb数据库断开
mongoose.connection.on('disconnected', function () {
  console.log('MongoDB connected disconnected.')
});

// 查询商品列表
router.get('/list', function (request, response, next) {
  let page = request.param('page') - 0;
  let pageSize = request.param('pageSize') - 0;
  // request.param 可以获取到前端传过来的参数
  let sort = request.param('sort') - 0;
  let skip = (page - 1) * pageSize;
  let params = {};

  // 价格等级
  let priceGt = '', priceLte = '';
  let priceLevel = request.param('priceLevel');
  if (priceLevel != 'all') {
    switch (priceLevel) {
      case '0': priceGt = 0; priceLte = 100; break;
      case '1': priceGt = 100; priceLte = 500; break;
      case '2': priceGt = 500; priceLte = 1000; break;
      case '3': priceGt = 1000; priceLte = 5000; break;
    }
    params = {
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
    console.log('params', params)
  }
  // Goods.find(params) frind 会返回一个模型 find(params).skip()查找所有数据 传参 查找多少条
  // limit 一页多少条 比如 skip 是1 pageSize 8 1*8 就是查找第一条到第八条
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  // 调用模型的sort 排序方法
  goodsModel.sort({ 'salePrice': sort });
  goodsModel.exec(function (err, doc) {
    console.log(doc, 'goodsItem')
    if (err) {
      response.json({
        status: '0',
        msg: err.message
      });
    } else {
      response.json({
        status: '1',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
  // Goods.find({}, function (err, doc) {
  //   if (err) {
  //     response.json({
  //       status: '0',
  //       msg: err.message
  //     });
  //   } else {
  //     response.json({
  //       status: '1',
  //       msg: '',
  //       result: {
  //         count: doc.length,
  //         list: doc
  //       }
  //     })
  //   }
  // })
})

// 加入购物车
router.post('/addCart', function (request, response, next) {
  let userId = '100000077';
  // 商品id
  let productId = request.body.productId;
  console.log('productId', productId)

  User.findOne({ userId: userId }, function (err, userDoc) {
    if (err) {
      response.json({
        status: '0',
        msg: err.message
      })
    } else {
      // 如果有这个用户信息
      if (userDoc) {
        // 如果添加同一个商品
        let goodsItem = ''
        userDoc.cartList.forEach(function(item) {
          if (item.productId == productId) {
            goodsItem = item;
            item.productNum++;
          }
        });
        // 当goodsItem 有内容时说明有此类商品，productNum已经++ 进行save 更新就好
        if (goodsItem) {
          userDoc.save(function (err2) {
            if (err2) {
              response.json({
                status: '0',
                msg: err2.message
              })
            } else {
              response.json({
                status: '1',
                msg: '',
                result: '添加成功'
              })
            }
          })
        } else { // 当goodsItem 为空的时候说明并没有此商品,要进行添加
          Goods.findOne({ productId: productId }, function (err1, goodsDoc) {
            if (err1) {
              response.json({
                status: '0',
                msg: err1.message
              })
            } else {
              if (goodsDoc) {
                let goodsDocs = JSON.parse(JSON.stringify(goodsDoc))
                goodsDocs.productNum = 1;
                goodsDocs.checked = 1;
                console.log('goodsDocs', goodsDocs)
                userDoc.cartList.push(goodsDocs);
                userDoc.save(function (err2) {
                  if (err2) {
                    response.json({
                      status: '0',
                      msg: err2.message
                    })
                  } else {
                    response.json({
                      status: '1',
                      msg: '',
                      result: '添加成功'
                    })
                  }
                })
              }
            }
          })
        }
      }
    }
  })
})

module.exports = router
