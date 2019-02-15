<template>
    <div id="main">
        <el-container>
            <el-header class="header">
                <el-row>
                <el-col :span="4">
                    <img src="@/assets/logo.png">
                </el-col>
                <el-col :span="19" class="middle">
                    <h2>电商后台管理系统</h2>
                </el-col>
                <el-col :span="1">
                    <a class="layout" @click.prevent='homeExit()' href="#">退出</a>
                </el-col>
                </el-row>
            </el-header>
        <el-container>
            <el-aside width="200px">
                <!-- 侧边栏 -->
                <!-- 常用属性： router:boolean  启用该模式会在激活导航时以 index 作为 path 进行路由跳转
                  unique-opened:boolean   是否只保持一个子菜单的展开-->
                <!-- default-active 通过index 属性,将符合条件的作为默认显示 -->
            <el-menu
            :router = 'true'
            :unique-opened = 'true'
            default-active="2"
            class="el-menu-vertical-demo">
                <el-submenu index="1">
                    <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>用户管理</span>
                    </template>
                    <!-- 这里的index 相当于router-link  index的值相当于路由的path -->
                    <el-menu-item index="users">
                    <i class="el-icon-menu"></i>
                        用户列表</el-menu-item>
                </el-submenu>

                <el-submenu index="2">
                    <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>权限管理</span>
                    </template>
                    <el-menu-item index="1-2">
                    <i class="el-icon-menu"></i>
                        角色列表</el-menu-item>
                    <el-menu-item index="1-3">
                    <i class="el-icon-menu"></i>
                        权限列表</el-menu-item>
                </el-submenu>

                  <el-submenu index="3">
                    <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>商品管理</span>
                    </template>
                    <el-menu-item index="1-2">
                    <i class="el-icon-menu"></i>
                        商品列表</el-menu-item>
                    <el-menu-item index="1-3">
                    <i class="el-icon-menu"></i>
                        分类参数</el-menu-item>
                     <el-menu-item index="1-3">
                     <i class="el-icon-menu"></i>
                    商品分类</el-menu-item>
                </el-submenu>

                 <el-submenu index="4">
                    <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>订单管理</span>
                    </template>
                    <el-menu-item index="1-2">
                    <i class="el-icon-menu"></i>
                        订单列表</el-menu-item>
                  </el-submenu>

                <el-submenu index="5">
                    <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>数据统计</span>
                    </template>
                    <el-menu-item index="1-2">
                    <i class="el-icon-menu"></i>
                        数据报表</el-menu-item>
                </el-submenu>
            </el-menu>

            </el-aside>
            <el-main>
                <!-- 这里展示router-view 要渲染的组件 -->
                <router-view></router-view>
            </el-main>
        </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
  beforeMount () {
    //   当判断没有携带token时,返回登录组件
    if (!localStorage.getItem('token')) {
      this.$router.push({
        name: 'login'
      })
      this.$message.warning('请先登录')
    }
  },
  methods: {
    homeExit () {
      if (confirm('确定退出吗?')) {
        localStorage.clear()

        this.$router.push({
          name: 'login'
        })
        this.$message('退出成功')
      }
    }
  }
}
</script>

<style>
    .header {
        height: 100%;
        background: #324152;
        color: #fff;
    }
    .middle {
        text-align: center;
        line-height: 60px;
        text-align: center;
    }
    .layout {
        line-height: 60px;
        text-decoration: none;
        color:rgb(57, 161, 221);
    }

</style>
