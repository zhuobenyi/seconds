<template>
  <div id="main" >
    <div style="margin: 20px;"></div>
    <el-form class="login-from" label-position="top" label-width="80px" :model="fromData">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="fromData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="fromData.password"></el-input>
      </el-form-item>
      <el-button @click.prevent='login()' class="btn" type="primary">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      fromData: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    // async document.onkeydown = function (e)
    // {

    // },
    //  loginEnter(e)
    // {
    //   if (e.keyCode === 13)
    //   {
    //     const re = await this.$http.post('login',this.fromdata)
    //     const {meta: {msg,status}} = re.data
    //     if (status === 200)
    //     {
    //       this.$router.push({
    //         name: 'home'
    //       })
    //     }
    //     else
    //     {
    //       this.$message.error(msg)
    //     }
    //   }
    // },

    // ES7的async 把异步代码改成同步  外层函数前加async 里层异步操作加 await
    async login () {
      const res = await this.$http.post('login', this.fromData)
      // console.log(res)
      const {meta: {msg, status}} = res.data

      try {
        if (status === 200) {
          const { data: {token} } = res.data
          // 存储token值
          localStorage.setItem('token', token)
          this.$router.push({
            name: 'home'
          })
        } else {
          this.$message.error(msg)
        }
      } catch (error) {
        console.log(error)
      }
    }

    // login () {
    //   this.$http.post('login', this.fromData)
    //     .then((res) => {
    //       this.$router.push({
    //         name: 'home'
    //       })
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //     })
    // }
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
