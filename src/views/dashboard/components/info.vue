<template>
  <div class="info-container group relative flex h-full w-full flex-col overflow-hidden rounded-[24px] bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-[#1c1e23]">
    <!-- Header -->
    <div class="mb-5 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500 dark:bg-indigo-900/20 dark:text-indigo-400">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        </div>
        <div>
          <h3 class="text-sm font-bold text-gray-900 dark:text-white">System Monitor</h3>
          <p class="text-[10px] text-gray-400">Live Resource Tracking</p>
        </div>
      </div>
      <div class="flex items-center gap-2 rounded-full bg-gray-50 px-2.5 py-1 dark:bg-gray-800">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" :class="statusColorClass"></span>
          <span class="relative inline-flex h-2 w-2 rounded-full" :class="statusColorClass"></span>
        </span>
        <span class="text-[10px] font-medium text-gray-500 dark:text-gray-400">{{ lastUpdate }}</span>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid flex-1 grid-cols-2 gap-3">
      <!-- CPU -->
      <div class="relative overflow-hidden rounded-xl bg-gray-50/50 p-3 transition-colors hover:bg-gray-50 dark:bg-[#25272c] dark:hover:bg-[#2a2c31]">
        <el-progress 
            type="dashboard" 
            :percentage="cpuUsage" 
            :width="60" 
            :stroke-width="6"
            :color="getProgressColor(cpuUsage)"
            class="absolute -right-2 -bottom-2 opacity-20"
        />
        <div class="relative z-10 flex flex-col justify-between h-full">
           <div class="mb-1 text-[10px] font-medium text-gray-400 uppercase tracking-wider">CPU Load</div>
           <div class="flex items-baseline gap-1">
             <span class="text-xl font-black text-gray-800 dark:text-white">{{ cpuUsage }}</span>
             <span class="text-xs text-gray-400">%</span>
           </div>
           <div class="h-1 w-full rounded-full bg-gray-200 dark:bg-gray-700 mt-2">
              <div class="h-1 rounded-full transition-all duration-500" :style="{ width: `${cpuUsage}%`, backgroundColor: getProgressColor(cpuUsage) }"></div>
           </div>
        </div>
      </div>

      <!-- Memory -->
      <div class="relative overflow-hidden rounded-xl bg-gray-50/50 p-3 transition-colors hover:bg-gray-50 dark:bg-[#25272c] dark:hover:bg-[#2a2c31]">
         <div class="absolute -right-4 -top-4 h-16 w-16 rounded-full border-[3px] border-purple-500/10"></div>
         <div class="relative z-10 flex flex-col justify-between h-full">
           <div class="mb-1 text-[10px] font-medium text-gray-400 uppercase tracking-wider">Memory</div>
           <div class="flex items-baseline gap-1">
             <span class="text-xl font-black text-gray-800 dark:text-white">{{ memoryUsage }}</span>
             <span class="text-xs text-gray-400">%</span>
           </div>
           <div class="h-1 w-full rounded-full bg-gray-200 dark:bg-gray-700 mt-2">
              <div class="h-1 rounded-full bg-purple-500 transition-all duration-500" :style="{ width: `${memoryUsage}%` }"></div>
           </div>
        </div>
      </div>

      <!-- Uptime -->
      <div class="flex flex-col justify-center rounded-xl bg-gray-50/50 p-3 transition-colors hover:bg-gray-50 dark:bg-[#25272c] dark:hover:bg-[#2a2c31]">
          <div class="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">Uptime</div>
          <div class="text-sm font-bold text-gray-800 dark:text-white">{{ uptime }}</div>
      </div>

      <!-- Users -->
      <div class="flex flex-col justify-center rounded-xl bg-gray-50/50 p-3 transition-colors hover:bg-gray-50 dark:bg-[#25272c] dark:hover:bg-[#2a2c31]">
          <div class="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">Active Users</div>
          <div class="flex items-center gap-2">
             <span class="text-sm font-bold text-gray-800 dark:text-white">{{ onlineUsers }}</span>
             <span class="flex h-1.5 w-1.5 rounded-full bg-green-500"></span>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue';

// 响应式数据
const cpuUsage = ref(45);
const memoryUsage = ref(62);
const onlineUsers = ref(128);
const timer = ref<NodeJS.Timeout>();

// 计算属性
const uptime = computed(() => {
  return `18d 4h 23m`; // Mock uptime for stability display
});

const lastUpdate = computed(() => {
  const date = new Date();
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
});

const statusColorClass = computed(() => {
  if (cpuUsage.value > 80 || memoryUsage.value > 80) return 'bg-red-500';
  if (cpuUsage.value > 60 || memoryUsage.value > 60) return 'bg-yellow-500';
  return 'bg-emerald-500';
});

// 方法
const getProgressColor = (percentage: number) => {
  if (percentage > 80) return '#ef4444'; // red-500
  if (percentage > 60) return '#f59e0b'; // amber-500
  return '#3b82f6'; // blue-500
};

// 模拟数据更新
const updateStats = () => {
  cpuUsage.value = Math.min(100, Math.max(10, Math.floor(cpuUsage.value + (Math.random() - 0.5) * 15)));
  memoryUsage.value = Math.min(100, Math.max(20, Math.floor(memoryUsage.value + (Math.random() - 0.5) * 5)));
  onlineUsers.value = Math.max(50, onlineUsers.value + Math.floor((Math.random() - 0.5) * 3));
};

onMounted(() => {
  timer.value = setInterval(updateStats, 2000);
});

onUnmounted(() => {
  clearInterval(timer.value);
});
</script>

<style scoped lang="scss">
/* Enhanced visuals handled by Tailwind classes */
</style>
