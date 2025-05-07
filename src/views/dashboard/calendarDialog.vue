<template>
  <div
    v-if="visible"
    class="absolute inset-0 z-2 flex h-full w-full items-center justify-center bg-white/10 backdrop-blur-md">
    <div class="w-[1024px] overflow-hidden rounded-xl bg-white">
      <div class="flex items-center border-b border-[#0000000d] bg-[#f8f8f8] p-5">
        <!-- 关闭 -->
        <div
          @click="visible = false"
          class="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-[#ff7330] hover:bg-[#ff6565]">
          <icon-material-symbols:close-rounded color="#fff" width="12"
        /></div>
        <p class="ml-5 text-sm text-[#8e8e94]"
          >{{ lunarYear }} {{ lunarMonth }} 月 {{ lunarDay }}</p
        >
      </div>

      <div class="flex">
        <div class="w-[115px] py-3">
          <div
            @click="handleChangeMonth(i)"
            :class="{ currentMonth: activeMonth === i }"
            class="relative flex cursor-pointer items-center justify-center py-3 text-sm text-[#8e8e94]"
            v-for="i in 12"
            :key="i"
            >{{ i }}月
          </div>
        </div>
        <div class="flex-1 bg-[#f8f8f8] px-14">
          <div class="mt-10 flex">
            <div
              class="w-[calc(100%/7)] text-center text-sm text-[#8e8e94]"
              v-for="(i, idx) in weeks"
              :key="idx"
              >周{{ i }}</div
            >
          </div>

          <div class="calendar flex flex-wrap">
            <!-- 上个月剩余日子 -->
            <div @click="toPrevMonth" class="item text-[#c7c7cc]" v-for="d in preMonthDay" :key="d">
              <p> {{ d }}</p>
              <p class="text-[#8e8e94]">{{ prevSolarDays[d - 1].getLunar().getDayInChinese() }}</p>
            </div>
            <!-- 当月日子 -->
            <div
              :class="{
                today: nowDate.year === year && nowDate.month === month && nowDate.day === d,
              }"
              class="item text-[#333]"
              v-for="d in days"
              :key="d">
              <p> {{ d }}</p>
              <p class="text-[#8e8e94]">{{ solarDays[d - 1].getLunar().getDayInChinese() }}</p>
            </div>
            <!-- 下个月剩余日子 -->
            <div
              @click="toNextMonth"
              class="item text-[#c7c7cc]"
              v-for="d in nextMonthDay"
              :key="d">
              <p> {{ d }}</p>
              <p class="text-[#8e8e94]">{{ nextSolarDays[d - 1].getLunar().getDayInChinese() }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Lunar, SolarMonth } from 'lunar-javascript';
import { onMounted } from 'vue';
import { computed, ref } from 'vue';

const weeks = ['一', '二', '三', '四', '五', '六', '日']; // js 中一周开始时周日 index 0

const nowDate = {
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  day: new Date().getDate(),
};

const visible = defineModel('visible', { default: false });

const now = ref(new Date());

// 当前选中月份
const activeMonth = ref();

const year = computed(() => now.value.getFullYear());
const month = computed(() => now.value.getMonth() + 1);

// 当月阳历日子
const solarDays = computed(() => {
  const solarMonth = SolarMonth.fromYm(now.value.getFullYear(), now.value.getMonth() + 1);
  return solarMonth.getDays();
});

// 上月阳历日子
const prevSolarDays = computed(() => {
  const solarMonth = SolarMonth.fromYm(now.value.getFullYear(), now.value.getMonth());
  return solarMonth.getDays();
});

// 下月阳历日子
const nextSolarDays = computed(() => {
  const solarMonth = SolarMonth.fromYm(now.value.getFullYear(), now.value.getMonth() + 2);
  return solarMonth.getDays();
});

// 当前月的第一天是星期几（用来填补前导空格）
const firstDateDay = computed(() => {
  const week = new Date(now.value.getFullYear(), now.value.getMonth(), 1).getDay();
  return week === 0 ? 6 : week - 1;
});

// 上月日子
const preMonthDay = computed(() => {
  const preMonthDays = new Date(now.value.getFullYear(), now.value.getMonth(), 0).getDate();
  return firstDateDay.value
    ? Array.from({ length: preMonthDays }, (_, i) => i + 1).splice(
        preMonthDays - firstDateDay.value,
      )
    : [];
});

// 下月日子
const nextMonthDay = computed(() => {
  const nextMonthDays = new Date(now.value.getFullYear(), now.value.getMonth() + 1, 0).getDate();
  const predays = 35 - firstDateDay.value - days.value;
  return predays ? Array.from({ length: nextMonthDays }, (_, i) => i + 1).splice(0, predays) : [];
});

// 当前月有多少天
const days = computed(() =>
  new Date(now.value.getFullYear(), now.value.getMonth() + 1, 0).getDate(),
);

// 农历 年月日
const lunar = Lunar.fromDate(now.value);
const lunarYear = lunar.getYearInChinese();
const lunarMonth = lunar.getMonthInChinese();
const lunarDay = lunar.getDayInChinese();

// 切换月份
const handleChangeMonth = (m: number) => {
  now.value = new Date(now.value.getFullYear(), m - 1, 1);
  activeMonth.value = now.value.getMonth() + 1;
};

// 上个月
const toPrevMonth = () => {
  now.value = new Date(now.value.getFullYear(), now.value.getMonth() - 1, 1);
  activeMonth.value = activeMonth.value - 1;
};

// 下个月
const toNextMonth = () => {
  now.value = new Date(now.value.getFullYear(), now.value.getMonth() + 1, 1);
  activeMonth.value = activeMonth.value + 1;
};

onMounted(() => {
  activeMonth.value = month.value;
});
</script>

<style lang="scss" scoped>
.currentMonth {
  z-index: 1;
  color: #fff;
  &::before {
    position: absolute;
    content: '';
    width: 50%;
    height: 28px;
    background-color: #ff6565;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    border-radius: 4px;
  }
}

.calendar {
  margin-top: 20px;
  border: 1px solid;
  border-color: #e5e5ea transparent transparent #e5e5ea;
  .item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: calc(100% / 7);
    font-size: 14px;
    height: 77px;
    padding: 14px;
    border: 1px solid;
    border-color: transparent #e5e5ea #e5e5ea transparent;
    cursor: pointer;
  }
  .today {
    position: relative;
    z-index: 1;
    background-color: #fff6f1;
    border: 1px solid #ff4d4f;
  }
}
</style>
