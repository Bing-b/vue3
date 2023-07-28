<template>
  <el-main>
    <router-view />
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
