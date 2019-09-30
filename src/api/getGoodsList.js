import axios from 'axios'
axios.defaults.baseURL = process.env.NODE_ENV === 'development' ?
  'http://127.0.0.1:4000' : 'http://shopping.tanggeek.top/shopping/api'
export function goodsList(param) {
  console.log(param)
  return axios.get('/goods/list', { params: param }).then((res) => {
    console.log(res)
    return Promise.resolve(res.data)
  })
}

export function addCart(param) {
  console.log(param)
  let data = {
    productId: param
  }
  return axios.post('/goods/addCart', data).then((res) => {
    console.log(res)
    return Promise.resolve(res.data)
  })
}
