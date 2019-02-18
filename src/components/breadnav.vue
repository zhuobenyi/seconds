<template>
<!-- 封装自定义组件 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">{{ level1 }}</a></el-breadcrumb-item>
        <el-breadcrumb-item>{{ level2 }}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
  props: ['level1', 'level2']
}
</script>

<style>

</style>
