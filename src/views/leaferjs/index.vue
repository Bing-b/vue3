<template>
  <div
    class="h-full w-full overflow-y-auto bg-slate-50 p-8 transition-colors duration-300 dark:bg-[#111317]">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-black tracking-tight text-slate-900 dark:text-white"
        >LeaferJS 实验</h1
      >
    </div>

    <!-- Main Content Card -->
    <div
      class="rounded-3xl border border-white bg-white/50 p-6 shadow-xl backdrop-blur-sm dark:border-white/5 dark:bg-white/5">
      <el-tabs tab-position="left" class="modern-tabs">
        <el-tab-pane label="Canvas Basics">
          <div class="p-4">
            <Base />
          </div>
        </el-tab-pane>
        <el-tab-pane label="Tetris Game">
          <div class="p-4">
            <Game />
          </div>
        </el-tab-pane>
        <el-tab-pane label="Flow Chart">
          <div class="p-4">
            <Process />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Game from './game.vue';
import Process from './process.vue';
import Base from './base.vue';
</script>

<style lang="scss" scoped>
.modern-tabs {
  height: 650px;

  :deep(.el-tabs__header) {
    margin-right: 32px;
  }

  :deep(.el-tabs__item) {
    font-weight: 600;
    transition: all 0.3s;
    height: 50px;
    display: flex;
    align-items: center;
    border-radius: 12px;
    margin-bottom: 4px;

    &.is-active {
      background: var(--el-color-primary-light-9);
      color: var(--el-color-primary);
    }
  }
}

.dark .modern-tabs :deep(.el-tabs__item.is-active) {
  background: rgba(var(--el-color-primary-rgb), 0.15);
}
</style>
