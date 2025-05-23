<template>
  <div class="logo-box">
    <div class="logo" :class="{ w: isExpansion }">
      <img class="w-[30px]" :src="$getImg('logo/logo.png')" />
      <h2 class="font-xht text-[24px] font-bold text-nowrap text-[#191919] dark:text-white">
        花猫乐园
      </h2>
      <!-- {{ !isExpansion ? '花猫乐园' : '' }} -->
    </div>

    <icon-tdesign:menu-unfold
      @click.stop="switchMenu"
      color="#333"
      width="24"
      class="mr-6 cursor-pointer"
      :class="{ 'rotate-180': isExpansion }" />

    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbList"
        :key="index"
        :to="item.path !== route.path ? { path: item.path } : undefined">
        {{ item.meta.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ref } from 'vue';

import { useRoute } from 'vue-router';
import { computed } from 'vue';

const { proxy } = getCurrentInstance() as any;

const route = useRoute();

const breadcrumbList = computed(() => {
  // 只显示有 meta.title 的路由
  return route.matched.filter((r) => r.meta && r.meta.title);
});

// 菜单收展状态
const isExpansion = ref(false);

// 切换菜单收展状态
const switchMenu = () => {
  isExpansion.value = !isExpansion.value;
  proxy.mittBus.emit('onChangeAsideBar', isExpansion.value);
};
</script>
<style lang="scss" scoped>
.logo-box {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .logo {
    margin-right: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 20px;
    transition: all 0.3s;
    overflow: hidden;
    height: 40px;
    width: 160px;

    h2 {
      transition: width 0.3s;
    }
  }

  .w {
    width: 64px;
    overflow: hidden;
  }
}

:deep(.el-breadcrumb__inner.is-link, .el-breadcrumb__separator) {
  font-weight: 400 !important;
  color: #8e8e94;
}
</style>
