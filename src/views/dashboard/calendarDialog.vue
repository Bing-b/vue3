<template>
  <div
    class="fixed top-1/2 left-1/2 z-10 w-[1024px] -translate-x-1/2 -translate-y-1/2 transform overflow-hidden rounded-xl bg-white">
    <div class="flex items-center border-b border-[#0000000d] bg-[#f8f8f8] p-5">
      <!-- 关闭 -->
      <div class="flex h-4 w-4 items-center justify-center rounded-full bg-[#ff7330]">
        <icon-material-symbols:close-rounded color="#fff"
      /></div>
      <p class="ml-5 text-sm text-[#8e8e94]">{{ lunarYear }} {{ lunarMonth }} 月 {{ lunarDay }}</p>
    </div>

    <div class="flex">
      <div class="w-[115px] py-3">
        <div
          @click="handleChangeMonth(i)"
          class="flex items-center justify-center py-3 text-sm text-[#8e8e94]"
          v-for="i in 12"
          :key="i"
          >{{ i }}月
        </div>
      </div>
      <div class="flex-1 bg-[#f8f8f8] px-14">
        <div class="mt-8 flex">
          <div class="w-[calc(100%/7)] text-center" v-for="(i, idx) in weeks" :key="idx"
            >周{{ i }}</div
          >
        </div>

        <div class="calendar flex flex-wrap">
          <div class="item text-[#8e8e94]" v-for="(d, idx) in firstDateDay" :key="idx"> </div>
          <div
            :class="{ today: now.getDate() === d }"
            class="item text-[#333]"
            v-for="(d, idx) in days"
            :key="idx">
            <p> {{ d }}</p>
            <p class="text-[#8e8e94]">{{ solarDays[idx].getLunar().getDayInChinese() }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Lunar, SolarMonth } from 'lunar-javascript';
import { computed, ref } from 'vue';

const weeks = ['一', '二', '三', '四', '五', '六', '日'];

const now = ref(new Date());

const year = computed(() => now.value.getFullYear());
const month = computed(() => now.value.getMonth() + 1);

// 获取阳历月份
const solarMonth = SolarMonth.fromYm(new Date().getFullYear(), new Date().getMonth() + 1);

const solarDays = computed(() => {
  const solarMonth = SolarMonth.fromYm(now.value.getFullYear(), now.value.getMonth() + 1);
  return solarMonth.getDays();
});

// 当前月的第一天是星期几（用来填补前导空格）
const firstDateDay = computed(() =>
  new Date(now.value.getFullYear(), now.value.getMonth(), 1).getDay(),
);

// 当前月有多少天
const days = computed(() =>
  new Date(now.value.getFullYear(), now.value.getMonth() + 1, 0).getDate(),
);

// 农历 年月日
const lunar = Lunar.fromDate(now.value);
const lunarYear = lunar.getYearInChinese();
const lunarMonth = lunar.getMonthInChinese();
const lunarDay = lunar.getDayInChinese();

const handleChangeMonth = (m: number) => {
  now.value = new Date(now.value.getFullYear(), m - 1, 1); // 月份要减1
};
</script>

<style lang="scss" scoped>
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
