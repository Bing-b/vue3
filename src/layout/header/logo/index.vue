<template>
  <div class="logo-box">
    <div class="logo">
      <img class="w-[40px]" src="@/assets/images/logo_square.png" />
      <h2 class="font-bold ml-1 text-[#32353a]">Jurassic</h2>
    </div>
    <svgIcon name="menu" size="22" @click.stop="switchMenu" />
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ref } from 'vue';

const { proxy } = getCurrentInstance() as any;

// 菜单收展状态
const isExpansion = ref(false);

// 切换菜单收展状态
const switchMenu = () => {
  isExpansion.value = !isExpansion.value;
  proxy.mittBus.emit('onChangeAsideBar', isExpansion.value);
};
</script>
<style lang="scss" scoped>
.logo-box {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .logo {
    display: flex;
    align-items: center;
    margin-right: 70px;
  }
}
</style>
