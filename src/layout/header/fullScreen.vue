<template>
  <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom" :show-after="0.5">
    <span @click="toggle" class="flex h-4 cursor-pointer items-center justify-center">
      <icon-material-symbols:fullscreen-rounded width="18" v-if="!isFullscreen" />
      <icon-mingcute:fullscreen-exit-line width="18" v-else />
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
