<template>
  <el-container class="layout-content">
    <Header />
    <div class="layout-main">
      <Aside />
    </div>
  </el-container>
</template>
<script lang="ts" setup>
import Header from '@/layout/header/index.vue';
import Aside from '@/layout/aside/index.vue';
</script>
<style lang="scss" scoped>
.layout-content {
  height: 100%;
  flex-direction: column;
}
</style>