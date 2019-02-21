<template>
  <el-card class="box-card">
    <!-- 使用自定义面包屑导航组件 -->
    <bread-nav level1="权限管理" level2="权限列表"></bread-nav>

    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      style="width: 100%"
      class="rights"
    >
      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column property="authName" label="权限名称" width="140"></el-table-column>
      <el-table-column property="path" label="路径" width="140"></el-table-column>
      <el-table-column property="level" label="层级">
        <template slot-scope="scope">
            <span v-if="scope.row.level==='0'">一级</span>
            <span v-if="scope.row.level==='1'">二级</span>
            <span v-if="scope.row.level==='2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      tableData: []

    }
  },
  methods: {
    async getRightsList () {
      const res = await this.$http.get('rights/list')
      // console.log(res)
      const {meta: {status}, data} = res.data
      if (status === 200) {
        this.tableData = data
      }
    }
  },
  created () {
    this.getRightsList()
  }
}
</script>

<style>
.rights {
  margin-top: 20px;
}
</style>
