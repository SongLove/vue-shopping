import axios from 'axios'

export function userLogin(param) {
    return axios.post('/users/login', param).then((res) => {
        console.log(res)
        return Promise.resolve(res.data)
    })
}
export function userLogOut() {
    return axios.post('/users/logout').then((res) => {
        return Promise.resolve(res.data)
    })
}