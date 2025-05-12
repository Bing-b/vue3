<template>
  <div class="flex items-center gap-5 pr-10">
    <!-- 全屏切换 -->
    <FullScreen />
    <!-- 暗黑切换 -->
    <button class="switch" @click="toggleDark($event)" :class="{ active: isDark }">
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
import FullScreen from './fullScreen.vue';

const globalConfigStore = useGlobalConfig();

// 是否暗夜模式
const isDark = ref(false);

// 切换主题
const toggleDark = (e: MouseEvent) => {
  isDark.value = !isDark.value;

  const transition = document.startViewTransition(() => {
    const html = document.querySelector('html')!;
    isDark.value ? html.classList.add('dark') : html.classList.remove('dark');
  });

  transition.ready.then(() => {
    const { clientX, clientY } = e;
    // 计算半径，以鼠标点击的位置为圆心，到四个角的距离中最大的那个作为半径
    const radius = Math.hypot(
      Math.max(clientX, innerWidth - clientX),
      Math.max(clientY, innerHeight - clientY),
    );

    // 根据暗黑模式状态选择动画方向
    const clipPath = [
      `circle(0% at ${clientX}px ${clientY}px)`,
      `circle(${radius}px at ${clientX}px ${clientY}px)`,
    ];

    document.documentElement.animate(
      { clipPath: isDark.value ? clipPath.reverse() : clipPath },
      {
        duration: 500,
        //切换到暗色主题，裁剪 view-transition-old(root) 的内容
        pseudoElement: isDark.value ? '::view-transition-old(root)' : '::view-transition-new(root)',
      },
    );
  });

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
  flex: none;
  width: 40px;
  height: 20px;
  border: 1px solid #dcdfe6;
  outline: none;
  border-radius: 10px;
  box-sizing: border-box;
  background: #f2f2f2;
  cursor: pointer;
  z-index: 111;

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
    transition:
      border-color 0.5s,
      background-color 0.5s,
      transform 0.5s;
    transition-timing-function: ease;
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
  border-color: #4c4d4f !important;
  background-color: #2c2c2c !important;

  .switch_action {
    transform: translate(20px) !important;
    background-color: #141414 !important;

    .el-icon {
      color: #fff;
    }
  }
}

.dark .switch {
  background: #141414;
  border-color: #414243;
}
</style>
<style lang="scss">
::view-transition-new(root),
::view-transition-old(root) {
  /* 关闭默认动画 */
  animation: none;
}
.dark::view-transition-old(root) {
  z-index: 100;
}
</style>
