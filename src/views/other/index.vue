<template>
  <div class="h-full">
    <h2 class="title">砸碎功能测试记录</h2>
    <div class="p-5 flex h-[calc(100%-40px)] overflow-auto">
      <!-- 左侧目录 -->
      <div class="w-[300px] h-full bg-[#f1f1f1] rounded p-4 dark:bg-bg_color">
        <h3 class="mb-5 text-[20px] text-blod">目录</h3>
        <div
          @click="handleChangeComponent(item)"
          v-for="item in leftSideMenu"
          :key="item.name"
          class="px-3 mb-1 py-[2px] rounded cursor-pointer hover:bg-[#e2e2e2]"
          :class="{ 'bg-[#e2e2e2]': activeComponent == item.component }"
          >{{ item.name }}</div
        >
      </div>
      <!-- 右侧模块切换 -->
      <div class="p-5 flex-1">
        <KeepAlive>
          <component :is="componentsMap[activeComponent]" v-bind="$attrs" />
        </KeepAlive>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watchEffect, ref, watch, nextTick, onMounted, useId } from 'vue';
// import ElTooltipPlus from './components/el-tooltip-plus.vue';
// import ClickOutSide from './components/click-outside.vue';
// import UseResizeObserve from './components/use-resize-observer.vue';
// import PLimit from './components/p-limit.vue';
// import RowScroll from './components/row-scroll.vue';
// import Progress from './components/progress.vue';
import { defineAsyncComponent } from 'vue';
import { shallowRef } from 'vue';

const ElTooltipPlus = defineAsyncComponent(() => import('./components/el-tooltip-plus.vue'));
const ClickOutSide = defineAsyncComponent(() => import('./components/click-outside.vue'));
const UseResizeObserve = defineAsyncComponent(() => import('./components/use-resize-observer.vue'));
const PLimit = defineAsyncComponent(() => import('./components/p-limit.vue'));
const RowScroll = defineAsyncComponent(() => import('./components/row-scroll.vue'));
const Progress = defineAsyncComponent(() => import('./components/progress.vue'));
const InfinteVirtualList = defineAsyncComponent(
  () => import('./components/infinite-virtual-list.vue')
);

const SortTable = defineAsyncComponent(() => import('./components/sortTable.vue'));

import sortTable from './components/sortTable.vue';

const componentsMap: Recordable = {
  componentA: ElTooltipPlus,
  componentB: ClickOutSide,
  componentC: UseResizeObserve,
  componentD: PLimit,
  componentE: RowScroll,
  componentF: Progress,
  componentG: InfinteVirtualList,
  componentH: sortTable,
};

// 左侧菜单
const leftSideMenu: Array<{ name: string; component: any }> = [
  {
    name: 'el-tooltop-Plus',
    component: 'componentA',
  },
  {
    name: 'clickOutSide',
    component: 'componentB',
  },
  {
    name: 'useResizeObserver',
    component: 'componentC',
  },
  {
    name: 'p-limit 处理并发请求',
    component: 'componentD',
  },
  {
    name: '横向滚动',
    component: 'componentE',
  },
  {
    name: '模拟进度条',
    component: 'componentF',
  },
  {
    name: '虚拟列表',
    component: 'componentG',
  },
  {
    name: '可拖拽表格',
    component: 'componentH',
  },
];

// 当前活动的组件
const activeComponent = shallowRef('componentA');

// 切换组件
const handleChangeComponent = (item: any) => {
  activeComponent.value = item.component;
};

watchEffect(() => {
  // 初始化默认选中第一个
  //activeComponent.value = leftSideMenu[0];

  const id = useId();
  console.log(id);
});
</script>

<style scoped></style>
