import axios from 'axios'
import { Message } from 'element-ui'

const FRONT_BASEURL = window.API_ADMINFRONT_PROD
// create an axios instance
const service = axios.create({
  // baseURL: process.env.BASE_API // api的base_url
  baseURL: FRONT_BASEURL// api的base_url
  // timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  // config.data = JSON.stringify(Object.assign({}, config.data || {}))
  // config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => response,
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })

export default service
