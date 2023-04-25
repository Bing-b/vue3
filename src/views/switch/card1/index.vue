<template>
  <div class="card1">卡片1
    <p>{{ parent }}</p>
    <p v-bind="$attrs">急急急</p>
  </div>
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
  border: 1px solid #42b883aa;
  width: 400px;
  height: 200px;
  background-color: #8de4bdaa;
}
</style>

<script lang="ts">
// 无法在 <script setup> 中的声明选项中去使用 inheritAttrs
export default {
  inheritAttrs: false,
};
</script>