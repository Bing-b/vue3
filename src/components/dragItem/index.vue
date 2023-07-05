<template>
  <div ref="container" class="relative border-r min-w-[200px]">
    <div class="w-full h-full">
      <slot></slot>
    </div>
    <div class="resize" v-if="showResize"></div>
  </div>
</template>

<script lang='ts' setup>
withDefaults(defineProps<{
  showResize: boolean // 控制是否显示拖拽条
}>(), {
  showResize: true
});
</script>

<style scoped>
.resize {
  position: absolute;
  right: -2px;
  top: 50%;
  width: 4px;
  height: 28px;
  cursor: col-resize;
  background-color: rgb(125, 178, 244);
  transform: translateY(-50%);
}
</style>
