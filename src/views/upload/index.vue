<template>
  <div class="h-full">
    <h2 class="title">文件上传</h2>
    <div class="p-5">
      <el-link
        href="https://lian-yue.github.io/vue-upload-component/#/zh-cn/documents"
        target="_blank"
        >vue-upload-component</el-link
      >
      <VueUpload />
      <el-divider border-style="dashed" />
      <el-link>element-plus-upload</el-link>
      <ElUplaod />
    </div>
  </div>
</template>

<script lang="ts" setup>
import VueUpload from './vueUpload/index.vue';
import ElUplaod from './elUpload/index.vue';
</script>

<style scoped></style>
