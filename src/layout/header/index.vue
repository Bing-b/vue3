<template>
  <el-header
    class="header dark:border-dark-border flex !h-[50px] items-center justify-between !p-0 shadow-sm dark:border-b">
    <logo />
    <NavBox />
  </el-header>
</template>
<script lang="ts" setup>
import Logo from './logo/index.vue';
import NavBox from './nav/index.vue';
</script>
