<!-- 虚拟列表-适用 item 动态高度场景
https://github.com/Akryum/vue-virtual-scroller/tree/master/packages/vue-virtual-scroller
-->
<template>
  <DynamicScroller
    ref="scrollerRef"
    :items="data"
    :min-item-size="minItemSize"
    @scroll-end="emit('onScrollEnd')"
    :style="{ maxHeight: `${maxHeight}px`, overflowY: 'auto' }"
    class="h-full"
    key-field="id">
    <template v-slot="{ item, index, active }">
      <DynamicScrollerItem :item="item" :active="active" :data-index="index">
        <slot :item :index />
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
</template>

<script lang="ts" setup>
import { computed, defineProps, ref, watch, nextTick } from 'vue';
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

/**
 * @param data - 列表数据，数组对象 [{}]。
 * @param size - 可视区域最大显示的元素数量，默认为 10。
 * @param autoRrefresh - 自动刷新
 */
const {
  data = [],
  size = 10,
  autoRrefresh = true,
} = defineProps<{ data: Recordable[]; size?: number; autoRrefresh?: boolean }>();

/**
 * onScrollStart: 滚动开始触发
 * onScrollEnd：滚动到底部触发
 */
const emit = defineEmits(['onScrollEnd']);

// 每个元素的最小高度(元素间距使用padding)
const minItemSize = 60;

const scrollerRef = ref<InstanceType<typeof DynamicScroller> | null>(null);

const maxHeight = computed(() => {
  return size * minItemSize;
});

// 处理列表数据结构
// const $data = computed(() => {
//   if (!Array.isArray(data) || data.length === 0) return [];

//   if (typeof data[0] === 'object' && data[0] !== null) {
//     // 检查第一项是否有 `id` 属性
//     if ('id' in data[0]) {
//       return data;
//     }
//     return data.map((i, idx) => ({ ...i, id: idx }));
//   }

//   console.error('虚拟列表数据格式错误');
//   return [];
// });

watch(
  () => data,
  () => {
    nextTick(() => {
      if (scrollerRef.value && autoRrefresh) scrollerRef.value.forceUpdate(); // 强制刷新
    });
  },
  { deep: 1 },
);
</script>
