<template>
  <div class="h-full">
    <h2 class="title">TresJs </h2>
    <div class="h-[calc(100%-50px)] p-3">
      <el-tabs type="border-card">
        <el-tab-pane label="基础"><Base /></el-tab-pane>
        <el-tab-pane label="Config">Config</el-tab-pane>
        <el-tab-pane label="Role">Role</el-tab-pane>
        <el-tab-pane label="Task">Task</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Base from './components/base.vue';
</script>

<style lang="scss" scoped>
:deep(.el-tabs) {
  height: 100%;
  .el-tab-pane {
    height: 100%;
  }
}
</style>
