<template>
  <div class="logo-box">
    <div class="logo">
      <el-icon size="30" color="#000">
        <ElementPlus />
      </el-icon>
      <h2>Space</h2>
    </div>
    <el-icon size="25" @click="switchMenu">
      <Fold />
    </el-icon>
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ref } from 'vue';


const { proxy } = getCurrentInstance() as any;

// 菜单收展状态
const isExpansion = ref(true);

// 切换菜单收展状态
const switchMenu = () => {
  isExpansion.value = !isExpansion.value;
  proxy.mittBus.emit('onChangeAsideBar', isExpansion.value);
}
</script>
<style lang="scss" scoped>
.logo-box {
  display: flex;
  align-items: center;

  .logo {
    display: flex;
    align-items: center;
    margin-right: 20px;
  }
}
</style>