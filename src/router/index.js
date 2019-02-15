/* 路由配置 */

import Vue from 'vue'
import Router from 'vue-router'
// webpack模板提供的.. @代表src 文件夹
import login from '@/components/login.vue'
import home from '@/components/home.vue'
import users from '@/components/users.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      name: 'home',
      path: '/',
      component: home,
      // 组件的嵌套
      children: [{
        path: '/users',
        name: 'users',
        component: users
      }]
    }
  ]
})
