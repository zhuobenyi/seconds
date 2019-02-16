<template>
  <div id="main">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>
            <a href="/">用户管理</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-row>
        <el-col>
          <el-input placeholder="请输入内容" v-model="query" class="input-with-select search">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-button type="success" plain>添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格部分 -->
      <el-table :data="tableData" style="width: 100%">
          <!-- prop 依赖数据的键名 -->
        <el-table-column prop="id" label="#" width="60"></el-table-column>
        <el-table-column prop="username" label="姓名" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="120"></el-table-column>

        <el-table-column prop="create_time" label="创建日期" width="120">
            <template slot-scope="scope">
                <!-- 自动依赖外层的数据 tableData -->
                {{scope.row.create_time | fmtDate}}
            </template>
        </el-table-column>

        <el-table-column prop="mg_state" label="用户状态" width="80">
            <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.mg_state"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
                </el-switch>
            </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="140">
            <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" circle size='mini' plain></el-button>
                  <el-button type="danger" icon="el-icon-delete" circle size='mini' plain></el-button>
                  <el-button type="success" icon="el-icon-check" circle size='mini' plain></el-button>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      tableData: [],
      //   当前页码数
      pagenum: 1,
      //   每页显示数量
      pagesize: 5,
    }
  },
  methods: {
    async renderList () {
      // 除登录请求外,其他请求都要取出token验证(请求头中)
      const AUTH_TOKEN = localStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      // 接口文档要求的查询字符串中要携带的参数
      const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      // console.log(res)
      const {data, meta: {status}} = res.data
      if (status === 200) {
        this.tableData = data.users
      }
    }
  },
  created () {
    this.renderList()
  }

}
</script>

<style>
.search {
  width: 350px;
}
</style>
