<template>
  <div class="logo-box ">
    <div class="logo" :class="{ 'w': isExpansion }">
      <img class="w-[50px]" :src="$getImg('logo/logo.gif')" />
      <!-- <svgIcon name="logo2" size="30" /> -->
      <h2 class="font-bold text-[#5898ff]" v-if="!isExpansion">OnePiece</h2>
    </div>
    <svgIcon name="menu" size="20" @click.stop="switchMenu" color="#e6e6e9" />
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
    margin-right: 10px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    transition: all .3s;
    overflow: hidden;
    height: 40px;
    width: 160px;

    h2 {
      transition: width .3s;
    }

  }

  .w {
    width: 64px;
    overflow: hidden;
  }

}
</style>
