<template>
  <div class="h-full">
    <h2 class="title">Leafer 学习及应用</h2>
    <el-tabs tab-position="left" style="height: 600px" class="demo-tabs">
      <el-tab-pane label="基础"><Base /></el-tab-pane>
      <el-tab-pane label="俄罗斯方块"> <Game /></el-tab-pane>
      <el-tab-pane label="流程图"> <Process /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import Game from './game.vue';
import Process from './process.vue';
import Base from './base.vue';
</script>

<style scoped></style>
