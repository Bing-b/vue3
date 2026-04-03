<template>
  <el-container class="layout-content !bg-[#f5f5f7] dark:!bg-[#000000]">
    <Header v-model:menuCollsapse="menuCollsapse" />
    <div class="layout-main">
      <Aside :menuList="state.menuList" v-model:menuCollsapse="menuCollsapse" />
      <el-main id="main" class="h-full !p-4">
        <div class="h-full overflow-hidden">
          <router-view #default="{ Component }">
            <transition name="slide" mode="out-in">
              <keep-alive>
                <component :is="Component" />
              </keep-alive>
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
  height: 100vh;
  overflow: hidden;

  .layout-main {
    display: flex;
    height: calc(100vh - 60px);

    main {
      flex: 1;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 6px;
      }
      &::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 3px;
      }
      .dark &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
      }
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
