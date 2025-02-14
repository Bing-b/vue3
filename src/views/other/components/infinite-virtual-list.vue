<template>
  <div class="w-[500px] h-[500px]">
    <virtual-list :data="items" :itemSize="50" :maxSize="5">
      <template #default="{ row }">
        <div class="list-item">{{ row.text }}</div>
      </template>
    </virtual-list>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const items = ref(Array.from({ length: 100 }, (_, i) => ({ text: `Item ${i + 1}` })));
</script>

<style>
.list-item {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #ddd;
}
</style>
