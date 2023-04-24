<template>
  <div class="logo-box">
    <div class="logo">
      <el-icon size="30" color="#000">
        <ElementPlus />
      </el-icon>
      <h2>Space</h2>
    </div>
    <el-icon size="25" @click.stop="switchMenu">
      <Fold />
    </el-icon>
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ref } from 'vue';


const { proxy } = getCurrentInstance() as any

// 菜单收展状态
const isExpansion = ref(false);

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
  width: 180px;
  justify-content: space-between;

  .logo {
    display: flex;
    align-items: center;
    margin-right: 20px;
  }
}
</style>