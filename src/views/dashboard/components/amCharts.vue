<template>
  <div
    class="stats-card border-base-border relative h-[200px] w-[480px] overflow-hidden rounded-[24px] border p-5 shadow-lg transition-all duration-500 hover:shadow-xl">
    <!-- 背景装饰 -->
    <div class="bg-decoration"></div>

    <!-- 头部信息 -->
    <div class="mb-6 flex items-end justify-between">
      <div>
        <h3 class="flex items-center gap-2 text-sm font-bold tracking-wider text-gray-700 dark:text-gray-200">
          <span class="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
          项目代码分析
        </h3>
        <p class="mt-1 text-[10px] uppercase text-gray-400">Project Language Composition</p>
      </div>
      <div class="text-right">
        <p class="text-[10px] font-medium text-gray-400">TOTAL CAPACITY</p>
        <p class="text-lg font-black italic tracking-tighter text-blue-600 dark:text-blue-400">
          {{ formatBytes(totalBytes) }}
        </p>
      </div>
    </div>

    <!-- 分段进度条 -->
    <div class="relative mb-8 h-3 w-full overflow-hidden rounded-full bg-gray-100/50 shadow-inner backdrop-blur-sm dark:bg-gray-800/50">
      <div class="flex h-full w-full">
        <div
          v-for="(item, index) in langStats"
          :key="item.lang"
          class="bar-segment transition-all duration-1000 ease-out"
          :style="{ 
            width: isMounted ? item.percent + '%' : '0%', 
            background: getGradient(item.lang),
            zIndex: 10 - index 
          }"
          :title="`${item.lang}: ${item.percent}%`"
        >
          <!-- 光影效果 -->
          <div class="h-full w-full bg-white/20 opacity-0 transition-opacity hover:opacity-100"></div>
        </div>
      </div>
    </div>

    <!-- 详细列表 (Legend) -->
    <div class="grid grid-cols-2 gap-x-8 gap-y-3">
      <div 
        v-for="item in langStats" 
        :key="item.lang" 
        class="group flex items-center justify-between transition-transform hover:translate-x-1"
      >
        <div class="flex items-center gap-3">
          <div 
            class="h-2 w-2 rounded-full shadow-sm shadow-black/10" 
            :style="{ background: getGradient(item.lang) }"
          ></div>
          <span class="text-xs font-semibold text-gray-600 dark:text-gray-300">{{ item.lang }}</span>
        </div>
        <div class="text-right">
          <span class="text-[11px] font-bold text-gray-900 dark:text-gray-100">{{ item.percent }}%</span>
          <span class="ml-2 hidden text-[9px] text-gray-400 group-hover:inline">{{ formatBytes(item.bytes) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue';

interface LangStat {
  lang: string;
  bytes: number;
  percent: string;
}

const langStats = ref<LangStat[]>([]);
const isMounted = ref(false);

const totalBytes = computed(() => {
  return langStats.value.reduce((acc, curr) => acc + curr.bytes, 0);
});

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getGradient = (lang: string) => {
  const gradients: Record<string, string> = {
    TypeScript: 'linear-gradient(135deg, #3178c6 0%, #4b91e2 100%)',
    JavaScript: 'linear-gradient(135deg, #f7df1e 0%, #e8c600 100%)',
    Vue: 'linear-gradient(135deg, #41b883 0%, #34495e 100%)',
    SCSS: 'linear-gradient(135deg, #c6538c 0%, #933d69 100%)',
    Default: 'linear-gradient(135deg, #9ca3af 0%, #4b5563 100%)'
  };
  return gradients[lang] || gradients.Default;
};

const fetchData = async () => {
  try {
    const url = import.meta.env.PROD ? '/vue3/lang-stats.json' : '/lang-stats.json';
    const res = await fetch(url);
    langStats.value = await res.json();
  } catch (error) {
    console.error('Fetch lang-stats error:', error);
  }
};

onMounted(async () => {
  await fetchData();
  // 延迟触发动画以获得丝滑感
  setTimeout(() => {
    isMounted.value = true;
  }, 100);
});
</script>

<style scoped lang="scss">
.stats-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  
  :global(.dark) & {
    background: rgba(18, 18, 18, 0.7);
    border-color: rgba(255, 255, 255, 0.1);
  }
}

.bg-decoration {
  position: absolute;
  top: -20%;
  right: -10%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
  z-index: 0;
  pointer-events: none;
}

.bar-segment {
  position: relative;
  &:not(:last-child) {
    border-right: 1px solid rgba(255, 255, 255, 0.3);
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .3; }
}

/* 隐藏滚动条 */
::-webkit-scrollbar {
  display: none;
}
</style>
