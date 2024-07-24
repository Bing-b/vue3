<template>
  <div>
    <h2 class="title">仿 vscode 可编辑目录树</h2>
    <div class="flex">
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
