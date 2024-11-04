<template>
  <div class="h-full overflow-y-scroll">
    <p>vueuse ClickOutside 点击区域外</p>
    <div class="relative h-[300px] mt-5">
      <xButton @click="visible = true" type="primary">打开</xButton>
      <div
        ref="target"
        v-show="visible"
        class="absolute top-[40px] left-0 bg-[#cd4e2e] w-[200px] h-[200px] border"></div>
    </div>
    <p>element 指令 点击区域外</p>
    <div class="relative h-[300px] mt-5">
      <xButton @click="visible2 = true" type="primary">打开</xButton>
      <div
        ref="target2"
        v-click-outside="onClickOutside2"
        v-show="visible2"
        class="absolute top-[40px] left-0 bg-[#cd4e2e] w-[200px] h-[200px] border"></div>
    </div>
    <p>原生js contains</p>
    <div class="relative h-[300px] mt-5">
      <xButton @click="visible3 = true" type="primary">打开</xButton>
      <div
        ref="target3"
        v-show="visible3"
        id="target"
        class="absolute top-[40px] left-0 bg-[#cd4e2e] w-[200px] h-[200px] border"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { ClickOutside as vClickOutside } from 'element-plus';

const visible = ref(false);

const visible2 = ref(false);

const visible3 = ref(false);

const target = ref(null);

const target2 = ref(null);

const target3 = ref(null);

onClickOutside(target, (event) => (visible.value = false));

const onClickOutside2 = () => {
  visible2.value = false;
};

// 原生
const onClickOutside3 = (e: MouseEvent) => {
  const ele = document.getElementById('target');
  if (ele && !ele.contains(e.target as Node)) {
    visible3.value = false;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', onClickOutside3);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onClickOutside3);
});
</script>

<style scoped></style>
