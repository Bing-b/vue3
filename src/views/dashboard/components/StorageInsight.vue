<template>
  <div class="storage-widget flex h-full w-full flex-col justify-between p-1">
    <div class="flex items-center justify-between">
      <div class="flex flex-col">
        <span
          class="text-[10px] font-bold tracking-wider text-[#86868b] uppercase dark:text-[#a1a1a6]"
          >云盘存储</span
        >
        <h3 class="mt-0.5 text-xs font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">空间概报</h3>
      </div>
      <div
        class="flex h-6 w-6 items-center justify-center rounded-full bg-[#34c759]/10 text-[#34c759]">
        <el-icon :size="14"><Cloudy /></el-icon>
      </div>
    </div>

    <div class="my-2 flex items-center gap-4">
      <div class="relative flex items-center justify-center">
        <svg class="h-16 w-16 -rotate-90">
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="transparent"
            stroke="currentColor"
            stroke-width="5"
            class="text-black/5 dark:text-white/10" />
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="transparent"
            stroke="#34c759"
            stroke-width="5"
            stroke-dasharray="175.9"
            :stroke-dashoffset="dashOffset"
            class="transition-all duration-1000 ease-out"
            stroke-linecap="round" />
        </svg>
        <span class="absolute text-[11px] font-bold text-[#1d1d1f] dark:text-[#f5f5f7]"
          >{{ usage }}%</span
        >
      </div>

      <div class="flex-1">
        <p class="text-xl font-bold tracking-tight text-[#1d1d1f] dark:text-white">
          128.5 <span class="text-xs font-medium text-[#86868b]">GB</span>
        </p>
        <p class="text-[9px] leading-tight font-medium text-[#86868b]">USED OF 512 GB TOTAL</p>
      </div>
    </div>

    <div class="flex items-end justify-between border-t border-black/5 pt-2 dark:border-white/5">
      <div class="flex items-center gap-1.5">
        <div class="h-1.5 w-1.5 animate-pulse rounded-full bg-[#34c759]"></div>
        <span class="text-[9px] font-bold text-[#86868b]">SYNC READY</span>
      </div>
      <button class="text-[9px] font-bold tracking-tight text-[#007aff] uppercase hover:underline">
        Manage →
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { Cloudy } from '@element-plus/icons-vue';

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
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.animate-pulse {
  animation: pulse 2s steps(24) infinite;
}
</style>
