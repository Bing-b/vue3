<template>
  <div
    class="border-base-border flex h-[200px] gap-10 overflow-hidden rounded-[24px] border shadow-md">
    <!-- 今日 -->
    <div class="flex flex-col justify-between py-4 pl-5">
      <div>
        <h3 class="text-[28px] font-bold text-[#ff4d4f]">{{ now.getDate() }}</h3>
        <p class="my-1 text-xs text-[#ff4d4f]">{{ weekDay }}</p>
        <p class="text-xs text-[#8e8e94]"
          >{{ now.getFullYear() }}年{{ now.getMonth() + 1 }}月 {{ lunarData.month }}月{{
            lunarData.day
          }}</p
        >
      </div>
      <div>
        <h4 class="text-[20px] font-bold">{{ lunarData.happyDay ?? '0' }}</h4>
        <p class="text-#3a3a3c my-1 text-xs">今日事件</p>
      </div>
    </div>

    <!-- 日历 -->
    <div class="calendar dark:bg-base-background flex w-[280px] flex-wrap bg-[#f8f8f8] px-7 py-4">
      <div
        :class="{ '!text-[#ff4d4f]': idx > 4 }"
        class="w-[calc(100%/7)] text-center text-sm text-[#1c1c1e]"
        v-for="(i, idx) in weeks"
        :key="idx"
        >{{ i }}</div
      >

      <div class="flex flex-wrap">
        <div class="item text-[#8e8e94]" v-for="(d, idx) in firstDateDay" :key="idx"> </div>
        <div
          @click="onClick"
          :class="{ today: now.getDate() === d }"
          class="item text-[#8e8e94]"
          v-for="(d, idx) in days"
          :key="idx"
          >{{ d }}
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

// 农历
const lunar = Lunar.fromDate(now);

// 今天周几
const weekDay = weekdayMap[now.getDay()];

const visible = ref(false);

const lunarData = reactive({
  month: '',
  day: '',
  happyDay: '',
});

// 每月第一天对应的号数
const firstDateDay = computed(() => new Date(now.getFullYear(), now.getMonth(), 1).getDate()); // now.getMonth() 返回月份是从 0 开始

// 每月有多少天
const days = computed(() => new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate());

// 农历获取节日列表（数组）
const festivals = lunar.getFestivals(); // 农历节日
const jieQi = lunar.getJieQi(); // 节气（如清明、立春）

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
.calendar {
  .item {
    display: flex;
    height: 24px;
    justify-content: center;
    align-items: center;
    width: calc(100% / 7);
    font-size: 12px;
    cursor: pointer;
    &:nth-child(7n + 6) {
      color: #ff4d4f;
    }
    &:nth-child(7n + 7) {
      color: #ff4d4f;
    }
  }
  .today {
    position: relative;
    z-index: 1;
    color: #fff !important;
    &::before {
      position: absolute;
      content: '';
      width: 20px;
      height: 20px;
      background-color: #ff4d4f;
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: -1;
    }
    color: red;
  }
}
</style>
