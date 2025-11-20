<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { onBeforeMount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { checkVersion } from 'version-rocket';
import { version, name } from '../package.json';

// const route = useRoute();
// // 监听路由的变化，设置网站标题
// watch(() => route.path, () => { title(); });

onBeforeMount(() => {
  // const { version, name: title } = __APP_INFO__.pkg;
  const { VITE_PUBLIC_PATH, MODE } = import.meta.env;

  if (MODE === 'production') {
    checkVersion(
      {
        pollingTime: 300000,
        localPackageVersion: version,
        originVersionFileUrl: `${location.origin}${VITE_PUBLIC_PATH}version.json`,
      },
      {
        title: name,
        description: '检测到新版本',
        buttonText: '立即更新',
      },
    );
  }
});
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
