<template>
  <div class="countdown-widget flex h-full w-full items-center justify-between px-2 py-1">
    <div class="flex flex-col">
      <span
        class="text-[10px] font-bold tracking-wider text-[#86868b] uppercase dark:text-[#a1a1a6]"
        >{{ date.year }} 年余额</span
      >
      <h4 class="mt-1 text-4xl font-bold text-[#1d1d1f] dark:text-white">
        {{ date.remainingDays }}<span class="ml-1 text-sm font-medium text-[#86868b]">天</span>
      </h4>
      <p class="mt-2 flex items-baseline gap-1 text-xs font-medium text-[#86868b]">
        <span>{{ date.hour }}</span
        ><span class="text-[10px] opacity-60">h</span> <span>{{ date.minute }}</span
        ><span class="text-[10px] opacity-60">m</span> <span>{{ date.second }}</span
        ><span class="text-[10px] opacity-60">s</span>
      </p>
    </div>
    <div class="relative flex items-center justify-center">
      <el-progress
        type="circle"
        :percentage="date.process"
        :stroke-width="12"
        :width="80"
        color="#007aff"
        class="apple-progress" />
      <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
        <!-- <span class="text-[10px] font-bold text-[#007aff]">{{ date.process }}%</span> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, reactive } from 'vue';

// 定时器
let timer: any = null;

// 日期
const date = reactive<{ [key: string]: number }>({
  year: 2022,
  month: 1,
  remainingDays: 0,
  hour: 0,
  minute: 0,
  second: 0,
  process: 0,
});

// 刷新时间
const updateDate = () => {
  const currentDate = new Date();
  date.year = currentDate.getFullYear();
  date.month = currentDate.getMonth() + 1;
  const currentTime = currentDate.getTime();

  // 计算剩余天数
  const endOfYear = new Date(date.year + 1, 0, 1, 0, 0, 0, 0).getTime();
  date.remainingDays = Math.ceil((endOfYear - currentTime) / (1000 * 60 * 60 * 24));

  // 获取当前的小时、分钟、秒钟
  date.hour = currentDate.getHours();
  date.minute = currentDate.getMinutes();
  date.second = currentDate.getSeconds();
  date.process = Math.round((1 - date.remainingDays / 365) * 100);
};

onMounted(() => {
  timer = setInterval(() => updateDate(), 1000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped></style>
