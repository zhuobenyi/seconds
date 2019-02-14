// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import axios from 'axios'

// 视图层
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 统一设置接口基准地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// Vue.protoType.$http = axios
Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
