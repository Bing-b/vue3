<template>
  <div>
    <el-input ref="testResizeObserver" type="textarea" placeholder="拖动右下角改变尺寸" />
    <p>{{ textareaValue }}</p>
  </div>
</template>

<script lang="ts" setup>
import { useResizeObserver } from '@vueuse/core';
import { ref } from 'vue';

const textareaValue = ref('');

const testResizeObserver = ref(null);

useResizeObserver(testResizeObserver, (entries) => {
  const [entry] = entries;
  const { width, height } = entry.contentRect;
  textareaValue.value = `width: ${width}\nheight: ${height}`;
});
</script>

<style scoped></style>
