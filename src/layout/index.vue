<template>
  <el-container class="layout-content">
    <Header />
    <div class="layout-main">
      <Aside :menuList="state.menuList" />
      <main>
        <Main />
      </main>
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
})

// 过滤模板路由
const filterRoutes = () => {
  let templateRoutes = [] as any;
  templateRoutes = mainRoutes.filter((item) => item.name === 'home');
  state.menuList = templateRoutes[0].children;
}

onMounted(() => {
  filterRoutes()
})

</script>
<style lang="scss" scoped>
.layout-content {
  height: 100%;
  flex-direction: column;

  .layout-main {
    display: flex;
  }
}
</style>