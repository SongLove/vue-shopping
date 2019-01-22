let mongoose = require('mongoose')
// mongo 表模型
let Schema = mongoose.Schema;

// 模型结构类型
let userSchema = new Schema({
  'userId': String,
  'userName': String,
  'userPwd': String,
  'orderList': Array,
  'cartList': [{
    'productId': String,
    'productName': String,
    'salePrice': String,
    'productImage': String,
    'checked': String,
    'productNum': String
  }],
  'addressList': Array
});

// 输出 为Good 的表模型
// 定义一个Good mongoose 会去关联 goods 集合
// mongoose.model('Good', productSchema, 'goods'); 第三个参数是指定跟goods表关联
module.exports = mongoose.model('User', userSchema);
