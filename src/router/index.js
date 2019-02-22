/* 路由配置 */

import Vue from 'vue'
import Router from 'vue-router'
// webpack模板提供的.. @代表src 文件夹
import login from '@/components/login.vue'
import home from '@/components/home.vue'
import users from '@/components/users.vue'
// 用户权限组件
import rights from '@/components/rights.vue'
// 角色列表组件
import roles from '@/components/role.vue'
import goods from '@/components/goods.vue'
import goodsadd from '@/components/goodsAdd.vue'
import cateParams from '@/components/cateParams.vue'
import goodscate from '@/components/goodscate.vue'

// 从element-ui 单独导入 message 对象
import {
  Message
} from 'element-ui'

Vue.use(Router)

const router = new Router({
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
      },
      {
        name: 'rights',
        path: '/rights',
        component: rights
      },
      {
        name: 'roles',
        path: '/roles',
        component: roles
      },
      {
        path: '/goods',
        name: 'goods',
        component: goods
      },
      {
        name: 'goodsadd',
        path: '/goodsadd',
        component: goodsadd
      },
      {
        name: 'cateParams',
        path: '/params',
        component: cateParams
      },
      {
        name: 'goodscate',
        path: '/categories',
        component: goodscate
      }]
    }
  ]
})

// 全局守卫
router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    next()
  } else {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push({
        name: 'login'
      })
      Message.warning('请先登录')
    } else {
      next()
    }
  }
})

export default router
