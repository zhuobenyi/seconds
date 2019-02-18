// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import axios from 'axios'
// @ 仅是webpack 模板提供的简便用法，表示src文件夹
import '@/assets/css/base.css'
import moment from 'moment'
import breadNav from '@/components/breadnav.vue'

// UI层   element-ui适用于vue2版本且为PC端时
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 使用自定义全局组件
// 第二个参数为组件选项所在的对象
Vue.component('breadNav', breadNav)
// 统一设置接口基准地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
Vue.prototype.$http = axios

Vue.use(ElementUI)
// 全局处理日期的过滤器
Vue.filter('fmtDate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
