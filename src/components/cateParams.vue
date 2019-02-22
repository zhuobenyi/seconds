<template>
  <el-card class="card">
    <bread-nav class="breadCateParams goodsAddBread" level1="商品管理" level2="分类参数"></bread-nav>
    <el-alert title="注意：只允许为第三级分类设置参数" type="warning"></el-alert>
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="请选择商品分类">
        <el-cascader
          expand-trigger="hover"
          :options="options"
          :props="defaultProp"
          v-model="selectedOptions"
          :show-all-levels="false"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
    </el-form>

    <!-- tab栏 -->
    <el-tabs v-model="activeName" @tab-click="changeTab()">
      <el-tab-pane label="动态参数" name="1">
        <el-button type="success" size="mini">设置动态参数</el-button>
        <!-- 表格 -->
        <el-table :data="arrDy" style="width: 100%">
          <el-table-column type="expand" width="180">
            <template slot-scope="scope">
              <!-- 动态编辑 -->
              <el-tag
                :key="i"
                v-for="(item,i) in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row,item)"
              >{{item}}</el-tag>

              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>

          <el-table-column type="index"></el-table-column>

          <el-table-column label="属性名称" width="180" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini">编辑</el-button>
              <el-button size="mini" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="静态参数" name="2">
        <el-button type="success" size="mini">设置静态参数</el-button>
        <!-- 静态参数 -->
         <el-table :data="arrStatic" style="width: 100%">

          <el-table-column type="index"></el-table-column>

          <el-table-column label="属性名称" width="180" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini">编辑</el-button>
              <el-button size="mini" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      // 动态编辑
      dynamicTags: ['标签一', '标签二', '标签三'],
      inputVisible: false,
      inputValue: '',
      form: {},
      activeName: '1',
      options: [],
      selectedOptions: [],
      arrDy: [],
      arrStatic: [],
      defaultProp: {
        label: 'cat_name',
        value: 'cat_id'
      }
    }
  },
  methods: {
    // 动态数据
    async handleClose (Dyobj, item) {
      Dyobj.attr_vals.splice(Dyobj.attr_vals.indexOf(item), 1)
      // 第一个ID为 三级分类的ID   第二个ID为当前的属性ID
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${Dyobj.attr_id}`,
        {
          attr_name: Dyobj.attr_name,
          attr_sel: Dyobj.attr_sel,
          attr_vals: Dyobj.attr_vals.join(',')
        }
      )
      // console.log(res)
      const {
        meta: { msg, status }
      } = res.data
      if (status === 200) {
        this.$message.success(msg)
      }
    },

    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    // 键盘enter键按下或是input框失去焦点时触发
    handleInputConfirm (Dyobj) {
      let inputValue = this.inputValue
      if (inputValue) {
        Dyobj.attr_vals.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },

    //   tab栏切换时触发
    changeTab () {
      this.getDyOrStatic()
    },
    // 公共方法
    async getDyOrStatic () {
      if (this.selectedOptions.length !== 3) {
        this.$message.warning('请先选择三级分类')
        return
      }
      // 获取动态数据
      if (this.activeName === '1') {
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        )
        // console.log(res)
        const {
          meta: { status },
          data
        } = res.data

        if (status === 200) {
          this.arrDy = data
        }
        // 返回的格式是字符串,需要的是数组
        this.arrDy.forEach(item => {
          item.attr_vals = item.attr_vals.split(',')
        })
      }
      // 获取静态数据
      if (this.activeName === '2') {
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        )
        console.log(res)
        const {
          meta: { status },
          data
        } = res.data

        if (status === 200) {
          this.arrStatic = data
        }
      }
    },
    // 级联选择器发生变化时触发
    async handleChange () {
      this.getDyOrStatic()
    },
    async renderList () {
      const res = await this.$http.get(`categories?type=3`)
      const {
        meta: { status },
        data
      } = res.data
      if (status === 200) {
        this.options = data
      }
    }
  },
  created () {
    this.renderList()
  }
}
</script>

<style>
.breadCateParams {
  margin-bottom: 10px;
}
.card {
  height: 100%;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
