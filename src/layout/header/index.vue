<template>
  <el-header
    class="header apple-glass relative z-30 flex !h-[60px] items-center justify-between !border-none !p-0">
    <div class="flex h-full items-center justify-between">
      <div
        class="flex h-full items-center gap-[10px] pl-5 transition-all duration-300 ease-in-out"
        :class="{ 'w-[64px] overflow-hidden': menuCollsapse, 'w-[180px]': !menuCollsapse }">
        <img class="w-[28px] drop-shadow-sm" :src="$getImg('logo/logo.png')" />
        <h2
          class="font-Maoken origin-left text-[18px] font-bold text-nowrap text-[#1d1d1f] transition-all duration-300 ease-in-out dark:text-[#f5f5f7]"
          :class="{
            'scale-x-0 opacity-0': menuCollsapse,
            'scale-x-100 opacity-100': !menuCollsapse,
          }">
          花猫乐园
        </h2>
      </div>

      <div class="ml-4 flex h-full items-center">
        <div
          @click.stop="menuCollsapse = !menuCollsapse"
          class="mr-6 cursor-pointer rounded-lg p-1.5 text-[#86868b] transition-all hover:bg-black/5 dark:hover:bg-white/10"
          :class="{ 'rotate-180': menuCollsapse }">
          <svgIcon name="menu" :size="20" />
        </div>

        <el-breadcrumb separator="/" class="!text-[12px]">
          <el-breadcrumb-item
            v-for="(item, index) in breadcrumbList"
            :key="index"
            :to="item.path !== route.path ? { path: item.path } : undefined">
            <span class="!font-medium">{{ item.meta.title }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
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
  return route.matched.filter((r) => r.meta && r.meta.title);
});
</script>

<style lang="scss" scoped>
:deep(.el-breadcrumb__inner) {
  color: #86868b !important;
  &.is-link:hover {
    color: #007aff !important;
  }
}
:deep(.el-breadcrumb__separator) {
  color: #d1d1d6 !important;
}
</style>
