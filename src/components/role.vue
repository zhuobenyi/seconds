<template>
  <el-card class="box-card">
    <bread-nav class="bread" level1="权限管理" level2="角色列表"></bread-nav>
    <el-button type="primary" plain>主要按钮</el-button>

    <!-- 表格部分 -->
    <!-- tableData = res.data.data -->
    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      style="width: 100%"
    >

      <!-- 展开行 -->
      <el-table-column type="expand" width="80">
        <!-- 当表格的数据来源不是porp里时,用template渲染 -->
        <template slot-scope="scope">
          <!-- 行列布局 -->
          <el-row class="elRow" v-for="(v1) in scope.row.children" :key="v1.id">
            <el-col :span="4">
              <el-tag @close="tagClose(scope.row,v1)" closable type='primary'>{{ v1.authName }}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(v2) in v1.children" :key='v2.id'>
                <el-col :span="4">
                  <el-tag @close="tagClose(scope.row,v2)" closable type='success'>{{ v2.authName }}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag type='warning' v-for="(v3) in v2.children" :key='v3.id'>{{ v3.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column property="roleName" label="角色名称" width="120"></el-table-column>
      <el-table-column property="roleDesc" label="角色描述" width="120"></el-table-column>
      <el-table-column label="操作">
         <template slot-scope="scope">
            <el-row>
              <el-button type="primary" icon="el-icon-edit" circle plain size='mini'></el-button>
              <el-button type="danger" icon="el-icon-delete" circle plain size='mini'></el-button>
              <el-button @click='showRoleState(scope.row)' type="success" icon="el-icon-check" circle plain size='mini'></el-button>
          </el-row>
         </template>
      </el-table-column>
    </el-table>
    <!-- 编辑用户权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogFormVisibleRoleRights">

        <!-- 树状列表 -->
        <!-- node-key 是treelist的唯一标识 -->
        <!-- label 实际展示在页面上的内容 -->
        <!-- props 两个属性, label 和 children是data中的key名  -->
        <!-- 设置ref  操作DOM -->
        <el-tree
          ref='treeDom'
          :data="treeList"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="ckecked"
          :props="defaultProps">
        </el-tree>

        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleRoleRights = false">取 消</el-button>
            <el-button type="primary" @click="dialogFormVisibleAddRights()">确 定</el-button>
        </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      dialogFormVisibleRoleRights: false,
      form: {},
      treeList: [],
      ckecked: [], // 默认展开的权限
      roleId: '',
      defaultProps: {
        label: 'authName',
        children: 'children'
      }
    }
  },
  methods: {
    // 添加权限
    async dialogFormVisibleAddRights () {
      this.dialogFormVisibleRoleRights = false
      let arr1 = this.$refs.treeDom.getCheckedKeys()
      let arr2 = this.$refs.treeDom.getHalfCheckedKeys()
      // 要求的请求体格式以 , 分隔
      const arr = [...arr1, ...arr2]
      const re = arr.join(',')

      const res = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: re
      })
      // console.log(res)
      const {meta: {msg, status}} = res.data
      if (status === 200) {
        this.$message.success(msg)
        this.renderRoleList()
      }
    },
    // 修改权限 -对话框
    async showRoleState (role) {
      // console.log(role)
      this.roleId = role.id
      this.dialogFormVisibleRoleRights = true
      const res = await this.$http.get(`rights/tree`)
      // console.log(res)
      const {meta: {status}, data} = res.data
      if (status === 200) {
        this.treeList = data
      }

      // 获取当前角色权ID
      // role.children 第一层权限
      role.children.forEach((v1) => {
        v1.children.forEach((v2) => {
          v2.children.forEach((v3) => {
            this.ckecked.push(v3.id)
          })
        })
      })
    },
    // 标记取消权限
    async tagClose (role, rights) {
      // 要求传入两个参数,角色ID和权限ID
      const res = await this.$http.delete(`roles/${role.id}/rights/${rights.id}`)
      // data 是剩余权限
      const { data, meta: {msg, status} } = res.data
      if (status === 200) {
        // role.children 是一级权限  role = res.data.data.children 所有权限
        // 只更新当前角色的权限
        role.children = data
        this.$message.success(msg)
      }
    },
    //   渲染角色列表
    async renderRoleList () {
      const res = await this.$http.get(`roles`)
      // console.log(res)
      const {data, meta: {status}} = res.data
      if (status === 200) {
        this.tableData = data
      }
    }
  },
  created () {
    this.renderRoleList()
  }
}
</script>

<style>
.bread {
  margin-bottom: 20px;
}
.elRow {
  margin-bottom: 30px;
}
</style>
