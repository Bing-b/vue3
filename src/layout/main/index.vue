<template>
  <el-main class="!overflow-hidden bg-[#f0f2f5]  !px-2 !py-2">
    <router-view #default="{ Component }">
      <transition name="slide" mode="out-in">
        <component :is="Component" :key="$route.path" />
      </transition>
    </router-view>
  </el-main>
</template>
<script lang="ts" setup>
import { reactive, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const state = reactive({
  currentRouteMeta: {}
});

watch(
  () => route.path,
  () => {
    state.currentRouteMeta = route.meta;
  }
);

</script>
<style>
.slide-enter-active,
.slide-leave-active {
  transition: all .3s;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translate(30px);
}
</style>
