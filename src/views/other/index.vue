<template>
  <div class="h-full">
    <h2 class="title">砸碎功能测试记录</h2>
    <div class="p-5 flex h-[calc(100%-40px)] overflow-auto">
      <!-- 左侧目录 -->
      <div class="w-[300px] h-full bg-[#f1f1f1] rounded p-4">
        <h3 class="mb-5 text-[20px] text-blod">目录</h3>
        <div
          @click="handleChangeComponent(item)"
          v-for="item in leftSideMenu"
          :key="item.name"
          class="px-3 mb-1 py-[2px] rounded cursor-pointer hover:bg-[#e2e2e2]"
          :class="{ 'bg-[#e2e2e2]': activeComponent.name == item.name }"
          >{{ item.name }}</div
        >
      </div>
      <!-- 右侧模块切换 -->
      <div class="p-5 flex-1">
        <KeepAlive>
          <component :is="activeComponent.component" v-bind="$attrs" />
        </KeepAlive>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watchEffect, ref } from 'vue';
import ElTooltipPlus from './components/el-tooltip-plus.vue';
import ClickOutSide from './components/click-outside.vue';
import UseResizeObserve from './components/use-resize-observer.vue';
import PLimit from './components/p-limit.vue';
import RowScroll from './components/row-scroll.vue';
import Progress from './components/progress.vue';

// 左侧菜单
const leftSideMenu: Array<{ name: string; component: any }> = [
  {
    name: 'el-tooltop-Plus',
    component: ElTooltipPlus,
  },
  {
    name: 'clickOutSide',
    component: ClickOutSide,
  },
  {
    name: 'useResizeObserver',
    component: UseResizeObserve,
  },
  {
    name: 'p-limit 处理并发请求',
    component: PLimit,
  },
  {
    name: '横向滚动',
    component: RowScroll,
  },
  {
    name: '模拟进度条',
    component: Progress,
  },
];

// 当前活动的组件
const activeComponent = ref();

// 切换组件
const handleChangeComponent = (component: any) => {
  activeComponent.value = component;
};

watchEffect(() => {
  activeComponent.value = leftSideMenu[0];
});
</script>

<style scoped></style>
