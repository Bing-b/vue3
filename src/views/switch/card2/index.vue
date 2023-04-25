<template>
  <div class="card1">卡片2<br />{{ parent }}</div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  parent: string,
}>(), {
  parent: () => ''
})
</script>

<style scoped>
.card1 {
  border: 1px solid #e47f0cf3;
  width: 400px;
  height: 200px;
  background-color: #c08469aa;
}
</style>
