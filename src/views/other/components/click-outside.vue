<template>
  <div>
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
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { ClickOutside as vClickOutside } from 'element-plus';

const visible = ref(false);

const visible2 = ref(false);

const target = ref(null);

const target2 = ref(null);

onClickOutside(target, (event) => (visible.value = false));

const onClickOutside2 = () => {
  visible2.value = false;
};
</script>

<style scoped></style>
