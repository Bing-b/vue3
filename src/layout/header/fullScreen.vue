<template>
  <el-tooltip effect="dark" content="全屏" placement="bottom" :show-after="0.5">
    <span @click="toggle" class="h-4">
      <el-icon v-if="!isFullscreen"><FullScreen /></el-icon>
      <el-icon v-else><Aim /></el-icon>
    </span>
  </el-tooltip>
</template>

<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core';

const { toggle, isFullscreen } = useFullscreen();

// 重新检查全屏状态
isFullscreen.value = !!(
  document.fullscreenElement ||
  document.webkitFullscreenElement ||
  document.mozFullScreenElement ||
  document.msFullscreenElement
);
</script>

<style scoped></style>
