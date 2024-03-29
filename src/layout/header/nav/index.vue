<template>
  <div class="pr-10">
    <!-- 暗黑切换 -->
    <button class="switch" @click="toggleDark" :class="{ 'active': isDark }">
      <div class="switch_action">
        <div class="switch_icon">
          <el-icon v-if="!isDark" size="14">
            <Sunny />
          </el-icon>
          <el-icon v-else size="14">
            <Moon />
          </el-icon>
        </div>
      </div>
    </button>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import useGlobalConfig from '@/store/modules/global';

const globalConfigStore = useGlobalConfig();

// 是否暗夜模式
const isDark = ref(false);

// 切换主题
const toggleDark = () => {
  isDark.value = !isDark.value;
  if (isDark.value === true) {
    document.querySelector('html')!.classList.add('dark'); // 黑夜模式时添加类名
  } else {
    document.querySelector('html')!.classList.remove('dark'); // 白天删除类名
  }
  globalConfigStore.appDark = isDark.value;
};

onMounted(() => {
  // 初始化获取主题信息
  const cfg = window.localStorage.getItem('config') || '{}';
  isDark.value = JSON.parse(cfg)?.appDark || false;
});

</script>
<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #dedede;
}

.switch {
  position: relative;
  width: 40px;
  height: 20px;
  border: 1px solid #dcdfe6;
  outline: none;
  border-radius: 10px;
  box-sizing: border-box;
  background: #f2f2f2;
  cursor: pointer;

  .switch_action {
    width: 16px;
    height: 16px;
    position: absolute;
    top: 1px;
    left: 1px;
    border-radius: 50%;
    background-color: #fff;
    transform: translate(0);
    color: #303133;
    transition: border-color .3s, background-color .3s, transform .3s;

    .switch_icon {
      position: relative;
      width: 16px;
      height: 16px;

      .el-icon {
        position: absolute;
        left: 1px;
        bottom: 1px;
      }
    }
  }

}

.active {
  border-color: #4C4D4F;
  background-color: #2c2c2c;

  .switch_action {
    transform: translate(20px);
    background-color: #141414;

    .el-icon {
      color: #fff;
    }
  }

}

.dark .switch {
  background: #141414;
  border-color: #414243
}
</style>
