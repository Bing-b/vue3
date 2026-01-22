<template>
  <div class="info-container group relative flex h-full w-full flex-col overflow-hidden rounded-[24px] bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-[#1c1e23]">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">系统状态</h3>
        <div class="flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75" :class="statusColorClass"></span>
          <span class="relative inline-flex h-2 w-2 rounded-full" :class="statusColorClass"></span>
        </div>
      </div>
      <span class="text-xs font-medium text-gray-400 dark:text-gray-500">{{ lastUpdate }}</span>
    </div>

    <!-- Main Grid -->
    <div class="grid flex-1 grid-cols-2 gap-4">
      <!-- CPU -->
      <div class="rounded-2xl bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-[#2a2c31] dark:hover:bg-[#323439]">
        <div class="mb-3 flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <el-icon :size="20"><Cpu /></el-icon>
          </div>
          <div>
            <div class="text-xs font-medium text-gray-500 dark:text-gray-400">CPU 使用率</div>
            <div class="text-lg font-bold text-gray-900 dark:text-white">{{ cpuUsage }}%</div>
          </div>
        </div>
        <el-progress 
          :percentage="cpuUsage" 
          :stroke-width="6" 
          :show-text="false" 
          :color="getProgressColor(cpuUsage)"
          class="!m-0"
        />
      </div>

      <!-- Memory -->
      <div class="rounded-2xl bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-[#2a2c31] dark:hover:bg-[#323439]">
        <div class="mb-3 flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
            <el-icon :size="20"><memo /></el-icon>
          </div>
          <div>
            <div class="text-xs font-medium text-gray-500 dark:text-gray-400">内存使用</div>
            <div class="text-lg font-bold text-gray-900 dark:text-white">{{ memoryUsage }}%</div>
          </div>
        </div>
        <el-progress 
          :percentage="memoryUsage" 
          :stroke-width="6" 
          :show-text="false" 
          :color="getProgressColor(memoryUsage)"
          class="!m-0"
        />
      </div>

      <!-- Uptime -->
      <div class="rounded-2xl bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-[#2a2c31] dark:hover:bg-[#323439]">
        <div class="mb-2 flex items-center gap-3">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <el-icon :size="16"><Timer /></el-icon>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">运行时间</div>
        </div>
        <div class="pl-1 text-sm font-bold text-gray-900 dark:text-white">{{ uptime }}</div>
      </div>

      <!-- Online Users -->
      <div class="rounded-2xl bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-[#2a2c31] dark:hover:bg-[#323439]">
        <div class="mb-2 flex items-center gap-3">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
            <el-icon :size="16"><User /></el-icon>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">在线用户</div>
        </div>
        <div class="pl-1 text-sm font-bold text-gray-900 dark:text-white">{{ onlineUsers }}</div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue';
import {
  Cpu,
  User,
  View,
  Download,
  Memo,
  Timer
} from '@element-plus/icons-vue';

// 响应式数据
const cpuUsage = ref(45);
const memoryUsage = ref(62);
const onlineUsers = ref(128);
const todayVisits = ref(1234);
const totalDownloads = ref(5678);
const timer = ref<NodeJS.Timeout>();

// 计算属性
const uptime = computed(() => {
  const hours = Math.floor(Math.random() * 24) + 1;
  const minutes = Math.floor(Math.random() * 60);
  return `${hours}h ${minutes}m`;
});

const lastUpdate = computed(() => {
  const date = new Date();
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
});

const statusColorClass = computed(() => {
  if (cpuUsage.value > 80 || memoryUsage.value > 80) return 'bg-red-500';
  if (cpuUsage.value > 60 || memoryUsage.value > 60) return 'bg-yellow-500';
  return 'bg-green-500';
});

// 方法
const getProgressColor = (percentage: number) => {
  if (percentage > 80) return '#ef4444'; // red-500
  if (percentage > 60) return '#f59e0b'; // amber-500
  return '#3b82f6'; // blue-500 (changed from green for better aesthetic)
};

// 模拟数据更新
const updateStats = () => {
  cpuUsage.value = Math.min(100, Math.max(20, Math.floor(cpuUsage.value + (Math.random() - 0.5) * 10)));
  memoryUsage.value = Math.min(100, Math.max(30, Math.floor(memoryUsage.value + (Math.random() - 0.5) * 8)));
  onlineUsers.value = Math.max(50, onlineUsers.value + Math.floor((Math.random() - 0.5) * 5));
  todayVisits.value += Math.floor(Math.random() * 2);
};

onMounted(() => {
  timer.value = setInterval(updateStats, 3000);
});

onUnmounted(() => {
  clearInterval(timer.value);
});
</script>

<style scoped lang="scss">
:deep(.el-progress-bar__outer) {
  background-color: #e5e7eb; // bg-gray-200
}

:global(.dark) :deep(.el-progress-bar__outer) {
  background-color: #374151; // bg-gray-700
}
</style>
