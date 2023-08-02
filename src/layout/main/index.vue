<template>
  <el-main class="!overflow-hidden">
    <transition name="slide" mode="out-in">
      <router-view>
        <template #default="{ Component }">
          <component :is="Component" :key="$route.path" />
        </template>
      </router-view>
    </transition>
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
