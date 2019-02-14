<template>
  <div id="main">
    <div style="margin: 20px;"></div>
    <el-form class="login-from" label-position="top" label-width="80px" :model="fromData">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="fromData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="fromData.password"></el-input>
      </el-form-item>
      <el-button class="btn" type="primary">主要按钮</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      fromData: {

      }
    }
  }

}
</script>

<style>
#main {
  /* 百分比布局时,父元素必须有高度 */
  height: 100%;
  background: #324152;
   display: flex;
  justify-content: center;
  align-items: center;
}
.login-from {
   background-color: #ffffff;
  border-radius: 5px;
  /* 开发 */
  width: 400px;
  padding: 30px;
}
.btn {
  width: 100%;
}

</style>
