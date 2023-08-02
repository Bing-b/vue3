<template>
  <div class="logo-box ">
    <div class="logo bg-[#1c53d9]" :class="{ 'w': isExpansion }">
      <svgIcon name="logo2" size="30" />
      <h2 class="font-bold ml-1 text-[#ecf0fb]" v-if="!isExpansion">Jurassic</h2>
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
      margin-left: 10px;
      transition: width .3s;
    }

  }

  .w {
    width: 64px;
    overflow: hidden;
  }

}
</style>
