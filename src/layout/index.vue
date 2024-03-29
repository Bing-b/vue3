<template>
  <el-container class="layout-content">
    <Header />
    <div class="layout-main">
      <Aside :menuList="state.menuList" />
      <Main />
    </div>
  </el-container>
</template>
<script lang="ts" setup>
import Header from '@/layout/header/index.vue';
import Aside from '@/layout/aside/index.vue';
import Main from '@/layout/main/index.vue';
import { mainRoutes } from '@/router/route';
import { onMounted, reactive } from 'vue';

const state = reactive({
  menuList: []
});

// 过滤模板路由
const filterRoutes = () => {
  let templateRoutes = [] as any;
  templateRoutes = mainRoutes.filter((item) => item.name === 'home');
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
    height: calc(100% - 40px);

    main {
      flex: 1;
    }
  }
}
</style>
