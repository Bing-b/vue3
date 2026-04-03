<template>
  <div class="stats-widget flex h-full w-full flex-col p-1">
    <!-- 头部信息 -->
    <div class="mb-6 flex items-start justify-between">
      <div>
        <span
          class="text-[10px] font-bold tracking-wider text-[#86868b] uppercase dark:text-[#a1a1a6]"
          >项目代码分析</span
        >
        <h3 class="mt-1 text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">语言占比</h3>
      </div>
      <div class="text-right">
        <span class="text-[10px] font-bold text-[#86868b] uppercase">总容量</span>
        <p class="mt-0.5 text-xl font-bold tracking-tight text-[#007aff]">
          {{ formatBytes(totalBytes) }}
        </p>
      </div>
    </div>

    <!-- 分段进度条 -->
    <div
      class="relative mb-6 h-4 w-full overflow-hidden rounded-full bg-black/5 shadow-inner dark:bg-white/5">
      <div class="flex h-full w-full">
        <div
          v-for="(item, index) in processedStats"
          :key="item.lang"
          class="bar-segment transition-all duration-1000 ease-out first:rounded-l-full last:rounded-r-full"
          :style="{
            width: isMounted ? item.percent + '%' : '0%',
            background: item.gradient,
            zIndex: 10 - index,
          }">
          <div
            class="h-full w-full cursor-help bg-white/10 opacity-0 transition-opacity hover:opacity-100"
            :title="`${item.lang}: ${item.percent}%`"></div>
        </div>
      </div>
    </div>

    <!-- 详细列表 (Legend) -->
    <div class="grid flex-1 grid-cols-2 gap-x-6 gap-y-3 overflow-y-auto pr-1">
      <div
        v-for="item in processedStats"
        :key="item.lang"
        class="group flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="h-2 w-2 rounded-full" :style="{ background: item.gradient }"></div>
          <span class="text-xs font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">{{
            item.lang
          }}</span>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-xs font-bold text-[#1d1d1f] dark:text-[#f5f5f7]"
            >{{ item.percent }}%</span
          >
          <span
            class="text-[10px] text-[#86868b] opacity-0 transition-opacity group-hover:opacity-100"
            >{{ formatBytes(item.bytes) }}</span
          >
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
    Default: 'linear-gradient(135deg, #9ca3af 0%, #4b5563 100%)',
  };
  return gradients[lang] || gradients.Default;
};

const processedStats = computed(() => {
  return langStats.value.map((item) => ({
    ...item,
    gradient: getGradient(item.lang),
  }));
});

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
.stats-widget {
  user-select: none;
}

.bar-segment {
  position: relative;
  &:not(:last-child) {
    border-right: 1px solid rgba(255, 255, 255, 0.2);
  }
}

/* 隐藏滚动条 */
::-webkit-scrollbar {
  display: none;
}
</style>
