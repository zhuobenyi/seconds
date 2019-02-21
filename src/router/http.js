// axios 不是vue的直接插件,需要转换成VUE的插件
// vue文档中的开发插件

import axios from 'axios'
const MyPlugin = {}
export default MyPlugin.install = function (Vue, options) {
  // 统一设置接口基准地址
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  Vue.prototype.$http = axios

  // 添加请求拦截器
  axios.interceptors.request.use(function (config) {
    // console.log(config)
    // url是在baseurl的基础上拼接的
    if (config.url !== 'login') {
      // 除登录请求外,其他请求都要取出token验证(请求头中)
      const AUTH_TOKEN = localStorage.getItem('token')
      config.headers.common['Authorization'] = AUTH_TOKEN
    }
    // 在发送请求之前做些什么
    return config
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  })
}
