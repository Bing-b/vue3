<!-- https://github.com/anncwb/vite-plugin-svg-icons/blob/main/README.zh_CN.md -->
<template>
  <svg
    aria-hidden="true"
    class="icon"
    :class="className"
    :style="{
      width: Number(size) + 'px',
      height: Number(size) + 'px',
      color: color,
    }">
    <use :xlink:href="`#icon-${name}`" />
  </svg>
</template>

<script setup lang="ts">
const { name, size, color, className } = defineProps<{
  name: string;
  size: string | number;
  color: string;
  className: string;
}>();
</script>

<style lang="scss" scoped>
.icon {
  display: inline-block;
  width: 14px;
  height: 14px;
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
}
</style>
