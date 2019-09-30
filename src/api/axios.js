import axios from 'axios' // 注意先安装哦

export default function $axios(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: process.env.NODE_ENV === 'production' ?
        'http://127.0.0.1:4000' : 'http://www.tanggeek.top/shopping/api'
    }
    )

    // request 拦截�?
    instance.interceptors.request.use(
      config => {
        // Tip: 1
        // 请求开始的时候可以结�? vuex 开�?全屏�? loading 动画

        // Tip: 2 
        // 带上 token , �?以结�? vuex 或者重 localStorage
        // if (store.getters.token) {
        //     config.headers['X-Token'] = getToken() // 让每�?请求携带token--['X-Token']为自定义key 请根�?实际情况�?行修�?
        // } else {
        //     // 重定向到登录页面    
        // }

        // Tip: 3
        // 根据请求方法，序列化传来的参数，根据后�??需求是否序列化
        if (config.method.toLocaleLowerCase() === 'post'
          || config.method.toLocaleLowerCase() === 'put'
          || config.method.toLocaleLowerCase() === 'delete') {

          config.data = config.data
        }
        return config
      },
      error => {
        // 请求错�??时做些事(接口错�??、超时等)
        // Tip: 4
        // 关闭loadding
        console.log('request:', error)

        //  1.判断请求超时
        if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
          console.log('根据你�?�置的timeout/真的请求超时 判断请求现在超时了，你可以在这里加入超时的�?�理方�??')
          // return service.request(originalRequest);//例�?�再重�?��?�求一�?
        }
        //  2.需要重定向到错�?页面
        const errorInfo = error.response
        console.log(errorInfo)
        if (errorInfo) {
          // error =errorInfo.data//页面那边catch的时候就能拿到�?�细的错�?信息,看最下边的Promise.reject
          const errorStatus = errorInfo.status; // 404 403 500 ... �?
          router.push({
            path: `/error/${errorStatus}`
          })
        }
        return Promise.reject(error) // 在调用的那边�?以拿�?(catch)你想返回的错�?信息
      }
    )

    // response 拦截�?
    instance.interceptors.response.use(
      response => {
        let data;
        // IE9时response.data是undefined，因此需要使用response.request.responseText(Stringify后的字�?�串)
        if (response.data == undefined) {
          data = response.request.responseText
        } else {
          data = response.data
        }
        // 根据返回的code值来做不同的处理（和后�??约定�?
        switch (data.code) {
          case '':
            break;
          default:
        }
        // 若不�?正确的返回code，且已经登录，就抛出错�??
        // const err = new Error(data.description)

        // err.data = data
        // err.response = response

        // throw err
        return data
      },
      err => {
        if (err && err.response) {
          switch (err.response.status) {
            case 400:
              err.message = '请求错�??'
              break

            case 401:
              err.message = '�?授权，�?�登�?'
              break

            case 403:
              err.message = '拒绝访问'
              break

            case 404:
              err.message = `请求地址出错: ${err.response.config.url}`
              break

            case 408:
              err.message = '请求超时'
              break

            case 500:
              err.message = '服务器内部错�?'
              break

            case 501:
              err.message = '服务�?实现'
              break

            case 502:
              err.message = '网关错�??'
              break

            case 503:
              err.message = '服务不可�?'
              break

            case 504:
              err.message = '网关超时'
              break

            case 505:
              err.message = 'HTTP版本不受�?�?'
              break

            default:
          }
        }
        console.error(err)
        // 此�?�我使用的是 element UI 的提示组�?
        // Message.error(`ERROR: ${err}`);
        console.log(`ERROR: ${err}`)
        return Promise.reject(err) // 返回接口返回的错�?信息
      }
    )

    //请求处理
    instance(options)
      .then((res) => {
        let { data, code, msg } = typeof res === 'object' && res ? res : JSON.parse(res)
        resolve({ data, code, msg })
        return false
      })
      .catch((error) => {
        reject(error)
      })
  })
}