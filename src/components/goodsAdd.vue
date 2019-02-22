<template>
  <el-card>
    <bread-nav class="goodsAddBread" level1="商品管理" level2="商品列表"></bread-nav>
    <el-alert title="!添加商品信息" type="success"></el-alert>
    <!-- active 当前完成了第几步 -->
    <!-- 步骤条 -->
    <el-steps :active="active*1" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- tab栏 -->
    <!-- name 与 v-model 绑定的值相同时,默认显示 -->
    <el-form class="form" label-position="top" :model="form" label-width="80px">
      <el-tabs @tab-click="changeTab()" v-model="active" tab-position="left">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>

          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>

          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>

          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>

          <el-form-item label="商品分类">
            <!-- options 数据源 -->
            <!-- props 常用三个key children,label,value -->
            <!-- {{selectedOptions}} -->
            <el-cascader
              expand-trigger="hover"
              :props="defaultProp"
              :options="options"
              clearable
              v-model="selectedOptions"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane name="2" label="商品参数">
          <el-form-item :label="v1.attr_name" v-for="(v1) in arrDy" :key="v1.attr_id">
            <!-- v-model 绑定数据,视图操作会修改数据 -->
            <el-checkbox-group v-model="v1.attr_vals">
              <el-checkbox border v-for="(v2,i) in v1.attr_vals" :key="i" :label="v2"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane name="3" label="商品属性">
          <el-form-item :label="v1.attr_name" v-for="(v1) in arrStatic" :key="v1.attr_id">
            <el-input v-model="v1.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
            <el-form-item>
              <!-- 非登录请求需要验证token,需要在请求头中携带token数据 -->
                  <!--action需要完整路径   baseURL拼接上路径 -->
                 <el-upload
                  class="upload-demo"
                  action="http://localhost:8888/api/private/v1/upload"
                  :headers='headers'
                  :on-success="handlesuccess"
                  :on-remove="handleRemove"
                  multiple
                  list-type="picture"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-form-item>
        </el-tab-pane>

        <el-tab-pane name="5" label="商品内容">
          <el-form-item>
            <el-button @click='addGoods()'>添加商品</el-button>
            <quill-editor v-model="form.goods_introduce"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
// 引入富文本,局部使用,局部导入 是表单元素
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  data () {
    return {
      active: '1',
      form: {
        goods_name: '',
        goods_cat: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      headers: {
        Authorization: localStorage.getItem('token')
      },

      //   级联选择器
      options: [], // 数据源
      selectedOptions: [],
      defaultProp: {
        label: 'cat_name', // label显示的数据
        value: 'cat_id', // value唯一标识
        children: 'children'
      },
      // 动态参数数据
      arrDy: [],
      // 静态数据
      arrStatic: []
    }
  },
  methods: {
    async addGoods () {
      // 后台返回的数据格式是字符串
      this.form.goods_cat = this.selectedOptions.join(',')

      const arr1 = this.arrDy.map((item) => {
        return {attr_id: item.attr_id, attr_value: item.attr_vals}
      })
      const arr2 = this.arrStatic.map((item) => {
        return {attr_id: item.attr_id, attr_value: item.attr_vals}
      })
      this.form.attrs = [...arr1, ...arr2]
      const res = await this.$http.post('goods', this.form)
      const {meta: {msg, status}} = res.data
      if (status === 201) {
        this.$message.success(msg)
        this.$router.push({
          name: 'goods'
        })
      }
    },
    // 上传部分
    // 上传成功时触发
    handlesuccess (response, file, fileList) {
      // console.log(response)
      this.form.pics.push({
        pics: response.data.tmp_path
      })
      // console.log(this.form.pics)
      // res.data.tmp_path //图片保存的临时路径
    },
    // 移除时触发
    handleRemove (file, fileList) {
      const Index = this.form.pics.findIndex(item => {
        return item.pic === file.response.data.tmp_path
      })
      this.form.pics.splice(Index, 1)
      console.log(this.form.pics)
    },

    handleChange () {},
    async changeTab () {
      // this.selectedOptions= cat_id  [1,3,6]
      if (this.active === '2' || this.active === '3') {
        if (this.selectedOptions.length !== 3) {
          this.$message.warning('请先选择三级分类')
          return
        }
      }

      if (this.active === '3') {
        // 获取静态数据
        const resStatic = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        )
        const {
          meta: { status },
          data
        } = resStatic.data
        if (status === 200) {
          this.arrStatic = data
          console.log(this.arrStatic)
        }
      }

      // 获取动态数据
      if (this.active === '2') {
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
          // console.log(this.arrDy)
        }
        // 返回的格式是字符串,需要的是数组
        this.arrDy.forEach(item => {
          item.attr_vals = item.attr_vals.split(',')
        })
      }
    },
    // 获取三级商品分类数据
    async renderBase () {
      const res = await this.$http.get(`categories?type=3`)
      // console.log(res)
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
    this.renderBase()
  }
}
</script>

<style>
.goodsAddBread {
  margin-bottom: 10px;
}
.form {
  height: 350px;
  overflow: auto;
}
.ql-editor, .ql-blank {
  min-height: 300px
}
</style>
