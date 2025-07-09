<template>
  <el-header
    class="header border-base-border flex !h-[50px] items-center justify-between !p-0 shadow-sm dark:border-b">
    <div class="flex items-center justify-between">
      <div
        class="flex items-center gap-[10px] pl-5 transition-all duration-300 ease-in-out"
        :class="{ 'w-[64px] overflow-hidden': menuCollsapse, 'w-[180px]': !menuCollsapse }">
        <img class="w-[30px]" :src="$getImg('logo/logo.png')" />
        <h2
          class="font-Maoken origin-left text-[20px] font-bold text-nowrap text-[#512f1c] transition-all duration-300 ease-in-out dark:text-white"
          :class="{
            'scale-x-0 opacity-0': menuCollsapse,
            'scale-x-100 opacity-100': !menuCollsapse,
          }">
          花猫乐园
        </h2>
      </div>

      <!-- 菜单收展按钮 -->
      <icon-tdesign:menu-unfold
        @click.stop="menuCollsapse = !menuCollsapse"
        color="#333"
        width="24"
        class="mr-6 cursor-pointer dark:text-white"
        :class="{ 'rotate-180': menuCollsapse }" />

      <!-- 面包屑  -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="(item, index) in breadcrumbList"
          :key="index"
          :to="item.path !== route.path ? { path: item.path } : undefined">
          {{ item.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <NavBox />
  </el-header>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router';
import NavBox from './nav.vue';
import { computed } from 'vue';

// 菜单收展
const menuCollsapse = defineModel('menuCollsapse', { default: false });

const route = useRoute();

const breadcrumbList = computed(() => {
  // 只显示有 meta.title 的路由
  return route.matched.filter((r) => r.meta && r.meta.title);
});
</script>
<style lang="scss" scoped>
:deep(.el-breadcrumb__inner.is-link, .el-breadcrumb__separator) {
  font-weight: 400 !important;
  color: #8e8e94;
}
</style>
