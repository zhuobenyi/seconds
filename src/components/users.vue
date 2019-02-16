<template>
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
          <el-input
            @clear="renderList()"
            clearable
            placeholder="请输入内容"
            v-model="query"
            class="input-with-select search"
          >
            <el-button @click="searchUsers()" slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-button @click="dialogFormVisible = true" type="success" plain>添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 添加用户弹出框 -->
      <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="form.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input v-model="form.password" autocomplete="off"></el-input>
          </el-form-item>
           <el-form-item label="邮箱" :label-width="formLabelWidth">
            <el-input v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>
           <el-form-item label="电话" :label-width="formLabelWidth">
            <el-input v-model="form.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>

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
            <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="140">
          <!-- <template slot-scope="scope"> -->
            <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
            <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
            <el-button type="success" icon="el-icon-check" circle size="mini" plain></el-button>
          <!-- </template> -->
        </el-table-column>
      </el-table>

      <!-- 分页部分 -->
      <el-pagination
        class="paging"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
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
      pagesize: 2,
      // 值为-1,为了区分和后台拿到的数据,后台数据最少为0
      total: -1,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      formLabelWidth: '120px',
      dialogFormVisible: false
    }
  },
  methods: {
    // 搜索用户
    searchUsers () {
      // 传入了query参数,根据query参数去获取用户信息
      this.renderList()
    },
    // 点击下拉框中的每页条数时触发
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum = 1
      this.renderList()
    },
    // 点击当前页码触发的事件
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.renderList()
    },
    async renderList () {
      // 除登录请求外,其他请求都要取出token验证(请求头中)
      const AUTH_TOKEN = localStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      // 接口文档要求的查询字符串中要携带的参数
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      )
      // console.log(res)
      const {
        data,
        meta: { status }
      } = res.data
      if (status === 200) {
        this.total = data.total
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
.paging {
  margin-top: 30px;
}
</style>
