<!-- 虚拟列表-适用固定高度item,支持分页 -->
<template>
  <div class="h-full">
    <RecycleScroller
      @scroll-end="loadData"
      class="h-[calc(100%-22px)] overflow-y-scroll"
      :items="activeData"
      :item-size="itemSize"
      :buffer="100"
      :key-field="key">
      <template #default="{ item }">
        <slot :item />
      </template>
    </RecycleScroller>
    <el-button v-show="loading" loading class="!border-none !h-4">Loading</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { computed, defineProps } from 'vue';
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

/**
 * @param data - 列表数据，数组对象 [{}]。
 * @param itemSize - item 高度
 * @param key - item 唯一标识
 * @param pageSize - 分页条数
 */
const {
  data = [],
  itemSize = 36,
  key = 'id',
  pageSize = 100,
} = defineProps<{ data: Recordable[]; itemSize: number; key: string; pageSize?: number }>();

// 当前显示数据
const activeData = ref<Recordable[]>([]);

const loading = ref(false);

const TempData = computed(() => {
  return key ? data : data.map((i, idx) => ({ ...i, id: idx }));
});

// 滚动到底部加载数据
const loadData = () => {
  if (loading.value || activeData.value.length === TempData.value.length) return;
  loading.value = true;
  setTimeout(() => {
    const newItems = TempData.value.slice(
      activeData.value.length,
      activeData.value.length + pageSize
    );
    activeData.value = [...activeData.value, ...newItems];
    loading.value = false;
  }, 1500);
};

watch(
  () => data,
  () => {
    activeData.value = TempData.value.slice(0, pageSize);
  },
  { deep: 1 }
);
</script>
