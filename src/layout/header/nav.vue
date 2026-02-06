<template>
  <div class="flex items-center gap-5 pr-10">
    <!-- 全屏切换 -->
    <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom" :show-after="0.5">
      <span @click="toggle" class="flex h-4 cursor-pointer items-center justify-center">
        <el-icon :size="18"><FullScreen v-if="!isFullscreen" /><Close v-else /></el-icon>
      </span>
    </el-tooltip>

    <!-- 暗黑切换 -->
    <button class="switch" @click="toggleDark($event)" :class="{ active: isDark }">
      <div class="switch_action">
        <div class="switch_icon">
          <el-icon :size="12"><Sunny v-if="!isDark" /><Moon v-else /></el-icon>
        </div>
      </div>
    </button>

    <!-- 用户登录信息 -->
    <el-popover
      trigger="click"
      :width="260"
      :show-arrow="false"
      popper-class="!p-0 !border-0 !rounded-2xl !shadow-2xl !bg-white/80 dark:!bg-slate-900/90 !backdrop-blur-xl dark:!shadow-black/50 overflow-hidden ring-1 ring-black/5 dark:ring-white/10"
    >
      <template #reference>
        <div class="group flex cursor-pointer items-center gap-2 rounded-full p-1 pl-2 pr-3 transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
          <el-avatar :size="32" class="!bg-indigo-100 dark:!bg-indigo-900/50">
            <svgIcon name="奶牛猫" size="24" />
          </el-avatar>
          <span class="text-xs font-medium text-slate-600 transition-colors group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-200">Bing</span>
        </div>
      </template>
      
      <div class="flex flex-col">
        <!-- User Header with Gradient -->
        <div class="relative overflow-hidden bg-slate-50 p-5 dark:bg-slate-800/50">
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent"></div>
          <div class="relative z-10 flex items-center gap-3">
            <el-avatar :size="48" class="ring-2 ring-white dark:ring-slate-700">
               <svgIcon name="奶牛猫" size="48" />
            </el-avatar>
            <div class="flex flex-col">
              <span class="text-sm font-bold text-slate-800 dark:text-white">Bing User</span>
              <span class="text-[10px] font-medium text-slate-500 dark:text-slate-400">catcoffe@123.com</span>
              <span class="mt-1 inline-flex w-fit items-center rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold leading-none text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                PRO
              </span>
            </div>
          </div>
        </div>

        <!-- Menu Actions -->
        <div class="flex flex-col p-2">
          <div class="group flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-700/50">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors duration-200 group-hover:bg-indigo-500 group-hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-indigo-500">
              <svgIcon name="center" size="16" />
            </div>
            <div class="flex flex-1 flex-col">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-200">Account</span>
              <span class="text-[10px] text-slate-400">Manage your profile</span>
            </div>
            <svg-icon name="arrow-right" class="opacity-0 transition-opacity group-hover:opacity-100" size="12" />
          </div>

          <a href="https://github.com/Bing-b/vue3" target="_blank" class="group flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-slate-700/50">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors duration-200 group-hover:bg-slate-800 group-hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-white dark:group-hover:text-black">
              <svgIcon name="github_2" size="16" />
            </div>
            <div class="flex flex-1 flex-col">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-200">GitHub</span>
              <span class="text-[10px] text-slate-400">View source code</span>
            </div>
            <svg-icon name="arrow-right" class="opacity-0 transition-opacity group-hover:opacity-100" size="12" />
          </a>

          <div class="my-1 h-px bg-slate-100 dark:bg-slate-700/50"></div>

          <div class="group flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors duration-200 hover:bg-red-50 dark:hover:bg-red-900/20" @click="handleLogout">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-red-500 transition-colors duration-200 group-hover:bg-red-500 group-hover:text-white dark:bg-slate-800 dark:text-red-400">
              <svgIcon name="logout" size="16" />
            </div>
            <div class="flex flex-1 flex-col">
              <span class="text-sm font-medium text-red-600 dark:text-red-400">退出登录</span>
            </div>
          </div>
        </div>
      </div>
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
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    confirmButtonClass: 'el-button--danger',
  })
    .then(() => {
      useUserStore.clear();
      router.push('/login');
    })
    .catch(() => {});
};

const toggleDark = (e: MouseEvent) => {
  const isAppearanceTransition = typeof document.startViewTransition === 'function'
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!isAppearanceTransition) {
    isDark.value = !isDark.value;
    updateTheme();
    return;
  }

  const x = e.clientX;
  const y = e.clientY;
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  );

  const transition = document.startViewTransition(async () => {
    isDark.value = !isDark.value;
    updateTheme();
  });

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ];
    document.documentElement.animate(
      {
        clipPath: isDark.value
          ? [...clipPath].reverse()
          : clipPath,
      },
      {
        duration: 400,
        easing: 'ease-out',
        pseudoElement: isDark.value
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      },
    );
  });
};

const updateTheme = () => {
  const html = document.documentElement;
  isDark.value ? html.classList.add('dark') : html.classList.remove('dark');
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
      border-color 0.3s,
      background-color 0.3s,
      transform 0.3s;
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
