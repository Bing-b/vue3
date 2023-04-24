<template>
  <router-view></router-view>
</template>

<script setup lang="ts">

import { watch } from 'vue';
import { useRoute } from 'vue-router';

// const route = useRoute();
// // 监听路由的变化，设置网站标题
// watch(() => route.path, () => { title(); });
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
