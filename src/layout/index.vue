<template>
  <el-container class="layout-content">
    <Header v-model:menuCollsapse="menuCollsapse" />
    <div class="layout-main">
      <Aside :menuList="state.menuList" v-model:menuCollsapse="menuCollsapse" />
      <el-main id="main" class="h-full bg-[#f0f2f5] !px-3 !py-3">
        <div
          class="dark:border-base-border bg-base-background h-full overflow-hidden rounded dark:border">
          <router-view #default="{ Component }">
            <transition name="slide" mode="out-in">
              <component :is="Component" :key="route.path" />
            </transition>
          </router-view>
        </div>
      </el-main>
    </div>
  </el-container>
</template>
<script lang="ts" setup>
import Header from '@/layout/header/index.vue';
import Aside from './aside.vue';
import { mainRoutes } from '@/router/route';
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// 菜单收展
const menuCollsapse = ref(false);

const state = reactive({
  menuList: [],
  currentRouteMeta: {},
});

watch(
  () => route.path,
  () => {
    state.currentRouteMeta = route.meta;
  },
);

// 过滤模板路由
const filterRoutes = () => {
  let templateRoutes = [] as any;
  templateRoutes = mainRoutes.filter((item) => item.name === 'index');
  state.menuList = templateRoutes[0].children;
};

onMounted(() => {
  filterRoutes();
});
</script>
<style lang="scss" scoped>
.layout-content {
  flex-direction: column;
  height: 100%;

  .layout-main {
    display: flex;
    height: calc(100% - 50px);

    main {
      flex: 1;
    }
  }
}
</style>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

/* .slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translate(30px);
} */

.slide-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
