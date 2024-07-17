<template>
  <el-header class="header flex justify-between items-center shadow-sm !p-0 !h-[50px]">
    <logo />
    <NavBox />
  </el-header>
</template>
<script lang="ts" setup>
import Logo from './logo/index.vue';
import NavBox from './nav/index.vue';
</script>
