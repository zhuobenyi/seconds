<template>
  <div id="main">
      <h2>用户登录</h2>
    <div style="margin: 20px;"></div>
    <el-form label-position="top" label-width="80px" :model="fromData">
      <el-form-item label="用户名">
        <el-input v-model="fromData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="fromData.password"></el-input>
      </el-form-item>

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
</style>
