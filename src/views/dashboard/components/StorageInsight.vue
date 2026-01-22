<template>
  <div
    class="storage-insight border-base-border relative h-[200px] w-[300px] overflow-hidden rounded-[25px] border p-5 shadow-lg transition-all duration-500 hover:shadow-xl">
    <!-- 背景渐变装饰 -->
    <div class="glow-effect"></div>

    <div class="relative z-10 flex h-full flex-col justify-between">
      <!-- 头部 -->
      <div class="flex items-center justify-between">
        <h3 class="text-xs font-bold tracking-widest text-gray-500 uppercase dark:text-gray-400">云盘存储空间</h3>
        <div class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 shadow-sm">
          <svgIcon name="menu" :size="10" />
        </div>
      </div>

      <!-- 中心内容: 进度环 & 数值 -->
      <div class="flex items-center gap-6">
        <div class="relative flex items-center justify-center">
          <svg class="h-16 w-16 -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="transparent"
              stroke="currentColor"
              stroke-width="6"
              class="text-gray-100 dark:text-gray-800"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="transparent"
              stroke="currentColor"
              stroke-width="6"
              stroke-dasharray="175.9"
              :stroke-dashoffset="dashOffset"
              class="text-emerald-500 transition-all duration-1000 ease-out"
              stroke-linecap="round"
            />
          </svg>
          <span class="absolute text-xs font-black text-gray-700 dark:text-gray-200">{{ usage }}%</span>
        </div>
        
        <div class="flex-1">
          <p class="text-2xl font-black italic tracking-tighter text-gray-800 dark:text-white">
            128.5 <span class="text-sm font-medium not-italic text-gray-400">GB</span>
          </p>
          <p class="text-[10px] text-gray-400 font-medium mt-1">USED OF 512 GB TOTAL</p>
        </div>
      </div>

      <!-- 底部状态 -->
      <div class="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
        <div class="flex items-center gap-2">
          <div class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span class="text-[10px] font-bold text-gray-600 dark:text-gray-400">SYNC READY</span>
        </div>
        <button class="text-[10px] font-black text-blue-500 hover:text-blue-600 transition-colors uppercase tracking-tight">
          Manage Assets →
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';

const usage = ref(0);
const targetUsage = 25.1;

const dashOffset = computed(() => {
  const circumference = 2 * Math.PI * 28;
  return circumference - (usage.value / 100) * circumference;
});

onMounted(() => {
  setTimeout(() => {
    usage.value = targetUsage;
  }, 300);
});
</script>

<style scoped lang="scss">
.storage-insight {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  
  :global(.dark) & {
    background: linear-gradient(135deg, #1c1e23 0%, #3e3e3e 100%);
    border-color: rgba(255, 255, 255, 0.05);
  }
}

.glow-effect {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
  z-index: 0;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.animate-pulse {
  animation: pulse 2s steps(24) infinite;
}
</style>
