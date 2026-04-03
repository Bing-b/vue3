<template>
  <div class="calendar-widget flex h-full w-full gap-6 overflow-hidden">
    <!-- 今日 -->
    <div class="flex flex-col justify-between py-2">
      <div>
        <span class="text-[10px] font-bold tracking-wider text-[#ff3b30] uppercase">今天</span>
        <h3 class="mt-1 text-4xl font-bold text-[#ff3b30]">{{ now.getDate() }}</h3>
        <p class="mt-1 text-[10px] font-medium text-[#86868b]">{{ weekDay }}</p>
      </div>
      <div class="mt-4">
        <p class="text-[10px] font-medium text-[#86868b]">农历</p>
        <p class="text-xs font-semibold whitespace-nowrap text-[#1d1d1f] dark:text-[#f5f5f7]"
          >{{ lunarData.month }}月{{ lunarData.day }}</p
        >
        <p class="mt-1 max-w-[80px] truncate text-[10px] font-medium text-[#ff3b30]">{{
          lunarData.happyDay
        }}</p>
      </div>
    </div>

    <!-- 日历网格 -->
    <div class="flex flex-1 flex-col pt-1">
      <div class="mb-2 grid grid-cols-7 gap-1">
        <div
          v-for="(i, idx) in weeks"
          :key="idx"
          class="text-center text-[10px] font-bold text-[#86868b]"
          :class="{ '!text-[#ff3b30]': idx > 4 }">
          {{ i }}
        </div>
      </div>

      <div class="grid flex-1 grid-cols-7 gap-x-1 gap-y-1">
        <div v-for="d in firstDateDay" :key="'empty-' + d" class="h-6 w-6"></div>
        <div
          v-for="d in days"
          :key="'day-' + d"
          @click="onClick"
          class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-[11px] font-medium transition-all hover:bg-black/5 dark:hover:bg-white/10"
          :class="{
            'bg-[#ff3b30] !text-white shadow-sm': now.getDate() === d,
            'text-[#1d1d1f] dark:text-[#f5f5f7]': now.getDate() !== d,
          }">
          {{ d }}
        </div>
      </div>
    </div>

    <teleport defer to="#home">
      <calendar-dialog v-model:visible="visible" />
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { Lunar } from 'lunar-javascript';
import CalendarDialog from './calendarDialog.vue';

const weekdayMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

const weeks = ['一', '二', '三', '四', '五', '六', '日'];

// 今天
const now = new Date();

// 今天周几
const weekDay = weekdayMap[now.getDay()];

const visible = ref(false);

const lunarData = reactive({
  month: '',
  day: '',
  happyDay: '',
});

// 每月第一天对应的星期 (0: 日, 1: 一, ..., 6: 六)
const firstDateDay = computed(() => {
  const day = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  // 转换为以周一为起始的偏移 (周一: 0, ..., 周日: 6)
  return day === 0 ? 6 : day - 1;
});

// 每月有多少天
const days = computed(() => new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate());

// 农历获取节日列表（数组）

// const lunarMonth = lunar.getMonthInChinese();
// const lunarDay = lunar.getDayInChinese();
// const happyDay = computed(() => festivals.concat(jieQi).join(' '));

const onClick = () => {
  visible.value = true;
};

onMounted(() => {
  const lunar = Lunar.fromDate(now);
  lunarData.month = lunar.getMonthInChinese();
  lunarData.day = lunar.getDayInChinese();
  lunarData.happyDay = lunar.getFestivals().concat(lunar.getJieQi()).join(' ');
});
</script>

<style lang="scss" scoped>
.calendar-widget {
  user-select: none;
}
</style>
