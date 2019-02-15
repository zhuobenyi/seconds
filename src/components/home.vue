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
            <el-aside width="200px">Aside</el-aside>
            <el-main>Main</el-main>
        </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
  methods: {
    homeExit () {
      if (confirm('确定退出吗?')) {
        this.$router.push({
          name: 'login'
        })
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
