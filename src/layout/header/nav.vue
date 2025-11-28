<template>
  <div class="flex items-center gap-5 pr-10">
    <!-- 全屏切换 -->
    <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom" :show-after="0.5">
      <span @click="toggle" class="flex h-4 cursor-pointer items-center justify-center">
        <icon-material-symbols:fullscreen-rounded width="18" v-if="!isFullscreen" />
        <icon-mingcute:fullscreen-exit-line width="18" v-else />
      </span>
    </el-tooltip>

    <!-- 暗黑切换 -->
    <button class="switch" @click="toggleDark($event)" :class="{ active: isDark }">
      <div class="switch_action">
        <div class="switch_icon">
          <icon-lets-icons:sun-light v-if="!isDark" width="12" height="12" />
          <icon-system-uicons:moon v-else width="12" height="12" />
        </div>
      </div>
    </button>

    <el-popover
      trigger="click"
      :width="240"
      popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 0px;">
      <template #reference>
        <svgIcon name="奶牛猫" size="38" />
      </template>
      <template #default>
        <div>
          <div class="flex gap-2 border-b border-b-[#ececec] p-3">
            <el-avatar> <svgIcon name="奶牛猫" size="38" /> </el-avatar>
            <p class="font-blod flex flex-col gap-2 text-black"
              >Bing
              <span class="!text-[#767676]">catcoffe@123.com</span>
            </p>
          </div>
          <div class="li-item">
            <svgIcon name="center" size="18" />
            <p>个人中心</p>
          </div>
          <div class="li-item">
            <svgIcon name="github_2" size="18" />
            <p><a href="https://github.com/Bing-b/vue3" target="_blank">GitHub</a> </p>
          </div>
          <div class="li-item" @click="handleLogout">
            <svgIcon name="logout" size="18" />
            <p>退出登录</p>
          </div>
        </div>
      </template>
    </el-popover>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import useGlobalConfig from '@/store/modules/global';
import { useFullscreen } from '@vueuse/core';
import userStore from '@/store/modules/user';
import { useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';

const { toggle, isFullscreen } = useFullscreen();

const globalConfigStore = useGlobalConfig();

const useUserStore = userStore();

const router = useRouter();

// 是否暗夜模式
const isDark = ref(false);

const handleLogout = () => {
  ElMessageBox.confirm('确定退出登录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      useUserStore.clear();
      router.push('/login');
    })
    .catch(() => {});
};

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

// 重新检查全屏状态
isFullscreen.value = !!(
  document.fullscreenElement ||
  document.webkitFullscreenElement ||
  document.mozFullScreenElement ||
  document.msFullscreenElement
);

onMounted(() => {
  // 初始化获取主题信息
  const cfg = window.localStorage.getItem('config') || '{}';
  isDark.value = JSON.parse(cfg)?.appDark || false;
});
</script>
<style lang="scss" scoped>
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

      svg {
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

.li-item {
  margin: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  padding: 6px 10px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background-color: #fafafa;
    border-radius: 4px;
  }
}
</style>
<style lang="scss">
::view-transition-new(root),
::view-transition-old(root) {
  /* 关闭默认动画 */
  animation: none;
}
.dark::view-transition-old(root) {
  z-index: 1000;
}
</style>
