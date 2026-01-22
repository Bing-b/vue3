<template>
  <div class="flex h-full w-[500px] flex-col rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-[#1c1e23]">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-sm font-bold text-gray-800 dark:text-white">Contribution Activity</h3>
      <div class="flex items-center gap-2">
         <span class="text-[10px] text-gray-400">Total:</span>
         <span class="text-xs font-bold text-emerald-500">1,284</span>
      </div>
    </div>

    <div class="relative flex flex-1 items-center justify-center overflow-hidden">
        <!-- 滚动容器 -->
      <div class="flex w-full overflow-x-auto pb-2 scrollbar-hide">
        <div class="flex gap-1 min-w-full">
          <div 
            v-for="(week, weekIndex) in heatmapData" 
            :key="weekIndex" 
            class="flex flex-col gap-1"
          >
            <div
              v-for="(day, dayIndex) in week"
              :key="dayIndex"
              class="h-2.5 w-2.5 rounded-[1px] transition-colors duration-300"
              :style="{ backgroundColor: getColor(day.level) }"
              :title="`${day.count} contributions on ${day.date}`"
            ></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Legend -->
    <div class="mt-2 flex items-center justify-end gap-1 text-[10px] text-gray-400">
        <span>Less</span>
        <div class="flex gap-0.5">
            <div class="h-2 w-2 rounded-[1px]" :style="{ background: getColor(0) }"></div>
            <div class="h-2 w-2 rounded-[1px]" :style="{ background: getColor(1) }"></div>
            <div class="h-2 w-2 rounded-[1px]" :style="{ background: getColor(2) }"></div>
            <div class="h-2 w-2 rounded-[1px]" :style="{ background: getColor(3) }"></div>
            <div class="h-2 w-2 rounded-[1px]" :style="{ background: getColor(4) }"></div>
        </div>
        <span>More</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getGithubEvents } from '@/api/common';
import useGlobalConfig from '@/store/modules/global';

const globalConfigStore = useGlobalConfig();

interface DayData {
  date: string;
  count: number;
  level: number;
}

const heatmapData = ref<DayData[][]>([]);
const totalContributions = ref(0);
const loading = ref(true);

const getColor = (level: number) => {
  const isDark = globalConfigStore.appDark;
  if (isDark) {
    return ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'][level];
  } else {
    return ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'][level];
  }
};

const initData = async () => {
  loading.value = true;
  const username = import.meta.env.VITE_GITHUB_USERNAME || 'Bing-b';
  
  // 1. 初始化空网格 (52周 x 7天)
  const data: DayData[][] = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setFullYear(today.getFullYear() - 1);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // 调整到周日

  // 创建日期映射以便快速查找 offset
  const dateMap = new Map<string, { w: number; d: number; count: number }>();

  for (let w = 0; w < 52; w++) {
    const week: DayData[] = [];
    for (let d = 0; d < 7; d++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + (w * 7 + d));
      const dateStr = currentDate.toDateString();
      
      week.push({
        date: dateStr,
        count: 0,
        level: 0
      });
      
      dateMap.set(dateStr, { w, d, count: 0 });
    }
    data.push(week);
  }

  try {
    // 2. 获取真实数据
    // 注意: Events API 只能获取最近 90 天或 300 条动态
    // 如果需要完整的年视图，实际上需要 scraping 或 GraphQL API，这里我们用 Events 做一个"即时"热力图
    const res = await getGithubEvents(username);
    const events = res.data || [];
    
    let total = 0;

    events.forEach((event: any) => {
      const date = new Date(event.created_at).toDateString();
      if (dateMap.has(date)) {
        const item = dateMap.get(date)!;
        // 根据事件类型加权重
        let weight = 1;
        if (event.type === 'PushEvent') weight = event.payload.commits ? event.payload.commits.length : 1;
        if (event.type === 'CreateEvent') weight = 2;
        if (event.type === 'PullRequestEvent') weight = 3;

        item.count += weight;
        total += weight;
        
        // 更新原数组
        data[item.w][item.d].count = item.count;
      }
    });

    totalContributions.value = total;

    // 3. 计算 Level
    data.forEach(week => {
      week.forEach(day => {
        if (day.count === 0) day.level = 0;
        else if (day.count <= 2) day.level = 1;
        else if (day.count <= 5) day.level = 2;
        else if (day.count <= 10) day.level = 3;
        else day.level = 4;
      });
    });

  } catch (error) {
    console.error('Failed to fetch github events', error);
  } finally {
    loading.value = false;
    heatmapData.value = data;
  }
};

onMounted(() => {
  initData();
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
</style>
