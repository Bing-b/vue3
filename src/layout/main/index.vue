<template>
  <el-main id="main" class="h-full bg-[#f0f2f5] !px-3 !py-3">
    <div class="dark:bg-dark-bg dark:border-dark-border h-full rounded-sm bg-white dark:border">
      <router-view #default="{ Component }">
        <transition name="slide" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </div>
  </el-main>
</template>
<script lang="ts" setup>
import { reactive, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const state = reactive({
  currentRouteMeta: {},
});

watch(
  () => route.path,
  () => {
    state.currentRouteMeta = route.meta;
  },
);
</script>
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
