<template>
  <div class="dark:bg-dark-bg h-full">
    <h2 class="title">仿 vscode 可编辑目录树</h2>
    <div class="p-5 text-sm">
      <p>1.支持文件夹、文件 的增删改</p>
      <p>2.支持懒加载</p>
      <p>3.支持搜索过滤</p>
      <p>4.可拉伸目录宽度</p>
    </div>
    <div class="flex p-5">
      <Tree class="w-1/2" />
      <LazyTree class="w-1/2" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Tree from './tree/index.vue';
import LazyTree from './lazyTree/index.vue';
</script>

<style scoped></style>
