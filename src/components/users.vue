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
        <el-button @click="showAddUsers()" type="success" plain>添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 修改权限弹出框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleStatus">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          {{form.username}}
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <!-- 通过角色ID绑定默认下拉选项 -->
          <el-select v-model="selectRid" placeholder="请选择">
            <!-- 这里的value值改为-1,表示和data中声明的初始值数据是一致的,那么新增的用户没有分配角色,所以会默认显示 这里的label -->
            <el-option disabled label="请选择" :value="-1"></el-option>

            <!-- label是下拉框显示的值   value与v-model绑定的值一致,默认显示 -->
            <el-option v-for='(v) in role' :key="v.id" :label='v.roleName' :value="v.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleStatus = false">取 消</el-button>
        <el-button type="primary" @click='editUsersStatus()'>确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户弹出框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <!-- 绑定表单数据 -->
      <el-form :model="form">
        <el-form-item disabled label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUsers()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加用户弹出框 -->
    <!-- :visible.sync="dialogFormVisible"  控制弹出层显示或隐藏 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <!-- 绑定表单数据 -->
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
        <el-button type="primary" @click="addUsers()">确 定</el-button>
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
          <el-switch
            @change="changeState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" width="140">
        <template slot-scope="scope">
          <el-button
            @click="showEditUsers(scope.row)"
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
          ></el-button>
          <el-button
            @click="delUsers(scope.row)"
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            plain
          ></el-button>
          <el-button @click='showUsersStatus(scope.row)' type="success" icon="el-icon-check" circle size="mini" plain></el-button>
        </template>
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
      // 角色默认ID
      selectRid: -1,
      role: [],
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      formLabelWidth: '120px',
      dialogFormVisible: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleStatus: false
    }
  },
  methods: {
    // 修改用户角色
    async editUsersStatus () {
      const res = await this.$http.put(`users/${this.form.id}/role`, {
        rid: this.selectRid
      })
      const {meta: {msg, status}} = res.data
      if (status === 200) {
        this.dialogFormVisibleStatus = false
        this.$message(msg)
      }
    },
    // 展示修改用户角色的弹出框
    async showUsersStatus (users) {
      this.dialogFormVisibleStatus = true
      this.form = users
      // 请求角色列表
      // 使用获取到的角色数据赋值给 :label 绑定的值
      const res = await this.$http.get(`roles`)
      const {data} = res.data
      this.role = data

      // 再发请求,通过Rid展示 :label 的默认值
      const res2 = await this.$http.get(`users/${users.id}`)
      console.log(res2)
      // 给下拉框v-model绑定的selectVal赋值
      this.selectRid = res2.data.data.rid
    },
    // 修改用户状态
    async changeState (users) {
      await this.$http.put(`users/${users.id}/state/${users.mg_state}`)
    },
    // 点击确认修改用户信息
    async editUsers () {
      this.dialogFormVisibleEdit = false
      // 修改信息是在展示信息的基础上
      const res = await this.$http.put(`users/${this.form.id}`, this.form)
      const {
        meta: { status }
      } = res
      if (status === 200) {
        this.renderList()
      }
    },
    // 点击展示修改用户信息
    showEditUsers (users) {
      console.log(users)
      this.dialogFormVisibleEdit = true
      this.form = users
    },
    // 点击删除用户
    async delUsers (users) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${users.id}`)
          const {
            meta: { msg, status }
          } = res.data
          if (status === 200) {
            this.$message({
              type: 'success',
              message: msg
            })
            this.pagenum = 1
            this.renderList()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 展示添加用户对话框
    showAddUsers () {
      this.dialogFormVisible = true
      this.form = {}
    },
    // 添加用户
    async addUsers () {
      const res = await this.$http.post(`users`, this.form)
      console.log(res)
      const {
        meta: { status }
      } = res.data
      if (status === 201) {
        // 关闭对话框
        this.dialogFormVisible = false
        this.renderList()
      }
    },
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
