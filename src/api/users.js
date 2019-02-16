import axios from 'axios'

// 用户登录
export function userLogin(param) {
    return axios.post('/users/login', param).then((res) => {
        console.log(res)
        return Promise.resolve(res.data)
    })
}

// 退出登录
export function userLogOut() {
    return axios.post('/users/logout').then((res) => {
        return Promise.resolve(res.data)
    })
}

// 检查登录
export function userCheckLogin() {
  return axios.get('/users/checkLogin').then((res) => {
      return Promise.resolve(res.data)
  })
}

// 获取购物车列表
export function userCartList() {
  return axios.get('/users/cartList').then((res) => {
      return Promise.resolve(res.data)
  })
}

// 删除购物车商品
export function deleteUserGood(param) {
  return axios.post('/users/cartDelGood', param).then((res) => {
      return Promise.resolve(res.data)
  })
}

// 更新商品数量
export function userCartEdit(param) {
  return axios.post('/users/cartEdit', param).then((res) => {
      return Promise.resolve(res.data)
  })
}

// 更新所有商品选中状态
export function editCheckAll(param) {
  return axios.post('/users/editCheckAll', param).then((res) => {
      return Promise.resolve(res.data)
  })
}

// 查询收货地址
export function userAddressList() {
  return axios.get('/users/addressList').then((res) => {
      return Promise.resolve(res.data)
  })
}

// 删除收货地址
export function delUserAddress(param) {
  return axios.post('/users/delAddress', param).then((res) => {
      return Promise.resolve(res.data)
  })
}

// 设置默认地址
export function setDefault(param) {
  return axios.post('/users/setDefault', param).then((res) => {
      return Promise.resolve(res.data)
  })
}

// 生成订单
export function payMent(param) {
  return axios.post('/users/payMent', param).then((res) => {
      return Promise.resolve(res.data)
  })
}

// 查询订单
export function orderDetail(param) {
  return axios.get('/users/orderDetail', {params: param}).then((res) => {
      return Promise.resolve(res.data)
  })
}

// 查询订单数量
export function getCartCount() {
  return axios.get('/users/getCartCount').then((res) => {
      return Promise.resolve(res.data)
  })
}
