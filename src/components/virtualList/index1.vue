<!-- 虚拟列表-动态高度 -->
<template>
  <div class="h-full">
    <DynamicScroller
      ref="scrollerRef"
      :items="$data"
      :min-item-size="minItemSize"
      :style="{ maxHeight: `${maxHeight}px`, overflowY: 'auto' }"
      class="h-full"
      key-field="id">
      <template v-slot="{ item, index, active }">
        <DynamicScrollerItem :item="item" :active="active" :data-index="index">
          <slot :item :index />
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineProps, ref, watch, nextTick } from 'vue';
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

// data：列表对象数组  size：控制可视区域最大显示元素数量
const { data = [], size = 10 } = defineProps<{ data: any[]; size?: number }>();

// 每个元素的最小高度 ，元素间距使用pb-[x] 才有效
const minItemSize = 60;

const scrollerRef = ref<InstanceType<typeof DynamicScroller> | null>(null);

const maxHeight = computed(() => {
  return size * minItemSize;
});

// 处理列表项增加id属性
const $data = computed(() => {
  if (Array.isArray(data) && typeof data[0] === 'object' && data[0] !== null) {
    return data.map((i, idx) => ({ ...i, id: i.id ?? idx }));
  }
  return [];
});

watch(
  () => data,
  async () => {
    await nextTick();
    if (scrollerRef.value) scrollerRef.value.forceUpdate();
  },
  { deep: true }
);
</script>
