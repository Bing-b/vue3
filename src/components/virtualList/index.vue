<template>
  <div class="virtual-list-wrapper h-full">
    <RecycleScroller
      class="scroller"
      :items="$data"
      :item-size="computedItemSize"
      :buffer="buffer"
      key-field="id">
      <template #default="{ item }">
        <slot :row="item" />
      </template>
    </RecycleScroller>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, ref, watch } from 'vue';
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

const props = defineProps<{ data: any[]; itemSize?: number; buffer?: number; maxSize?: number }>();
const containerHeight = ref(0);

const $data = computed(() => {
  if (Array.isArray(props.data) && typeof props.data[0] === 'object' && props.data[0] !== null) {
    return props.data.map((i) => ({ ...i, id: i.id ?? crypto.randomUUID() }));
  }
  return [];
});

const computedItemSize = computed(() => {
  if (props.maxSize && containerHeight.value) {
    return Math.floor(containerHeight.value / props.maxSize);
  }
  return props.itemSize || 50;
});

const buffer = ref(props.buffer || 300);

watch(
  () => props.data,
  () => {
    // 监听数据变化时，刷新列表
  },
  { deep: true }
);

const updateContainerHeight = () => {
  const el = document.querySelector('.virtual-list-wrapper');
  if (el) {
    containerHeight.value = el.clientHeight;
  }
};

watch(
  () => props.maxSize,
  () => {
    updateContainerHeight();
  }
);

// 监听窗口大小变化
window.addEventListener('resize', updateContainerHeight);
updateContainerHeight();
</script>

<style>
.scroller {
  overflow-y: auto;
  height: 100%;
}
</style>
