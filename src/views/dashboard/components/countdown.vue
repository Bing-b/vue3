<template>
  <!-- 时间倒计时 -->
  <div
    class="flex h-[200px] w-[300px] items-center justify-between gap-5 rounded-[25px] bg-[linear-gradient(135deg,_#f5f7fa_0%,_#c3cfe2_100%)] px-10 py-5 dark:bg-[linear-gradient(135deg,_#1c1e23_0%,_#555555_100%)]">
    <div class="font-hsans">
      <p class="text-xs font-medium">{{ date.year }} 年余额</p>
      <h4 class="text-[40px] font-bold"
        >{{ date.remainingDays }}<span class="ml-1 text-xs font-normal">天</span></h4
      >
      <p class="text-[#444] dark:text-[#767676]"
        >{{ date.hour }}<span class="mr-1 text-xs">h</span>{{ date.minute
        }}<span class="mr-1 text-xs">m</span>{{ date.second }}<span class="text-xs">s</span></p
      >
    </div>
    <el-progress
      type="circle"
      :percentage="date.process"
      color="#368eff"
      :width="90"
      :stroke-width="14"
      class="custom-circle" />
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
