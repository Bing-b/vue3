<template>
  <div class="switch relative w-9 h-9 flex items-center justify-center bg-[#ececec] rounded-sm" @click="handleSwitch">
    <svgIcon :name="isCardMode ? 'menu_card' : 'menu_list'" size="21" color="#666" />
  </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue';

const isCardMode = ref(true);

const handleSwitch = () => {
  isCardMode.value = !isCardMode.value;
};
</script>

<style lang="scss" scoped>
.switch {
  &::before {
    position: absolute;
    content: '';
    width: 100%;
    height: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    background-color: #dedede;
  }
}
</style>
