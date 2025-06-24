<template>
  <div
    class="weather relative flex h-[204px] w-[204px] flex-col rounded-[25px] p-2 dark:!bg-[linear-gradient(35deg,_#1c1e23_0%,_#555555_100%)]">
    <h1 class="px-2 text-[48px] text-[#1c1c1e] dark:text-white">{{ weather.temperature }}°</h1>
    <p class="mt-1 px-2 text-sm text-[#3a3a3c] dark:text-[#666]"> {{ weather.city }}</p>
    <p class="mb-2 p-2 pt-0 text-sm text-[#3a3a3c] dark:text-[#767676]"
      >{{ weather.weather }} {{ weather.temperature }}° ~ {{ Number(weather.temperature) + 2 }}°</p
    >
    <div class="item bg-content-bg flex">
      <p>
        {{ weather.humidity }}%
        <span>湿度</span>
      </p>
      <p>
        {{ weather.windpower }}级
        <span>{{ weather.winddirection }}风</span>
      </p>
      <p>
        11km/h
        <span>风速</span>
      </p>
      <p>
        996
        <span>百帕</span>
      </p>
    </div>
    <img class="absolute top-3 right-5 w-[24px]" :src="$getImg(`weather/${weatherIcon}.png`)" />
  </div>
</template>

<script lang="ts" setup>
import { getWeather } from '@/api/common';
import { computed } from 'vue';
import { onMounted, ref } from 'vue';

type Weather = {
  city: string;
  humidity: string;
  temperature: string;
  weather: string;
  windpower: string;
  winddirection: string;
};

const iconMapping: Recordable = {
  阴: 104,
  晴: 100,
  多云: 101,
};

const weather = ref<Weather>({
  city: '',
  humidity: '',
  temperature: '',
  weather: '',
  windpower: '',
  winddirection: '',
});

const weatherIcon = ref(104);

// 卡片渐变背景
const cardTheme = computed(() => {
  switch (weatherIcon.value) {
    case 100: // 晴天
      return 'linear-gradient(225deg, #ffedd0, #dff3ff 48%, #bde1ff)';
    case 104: // 阴天
      return 'linear-gradient(225deg, #dce7f7, #cbd6e5 48%, #a5b3c5)';
    case 101: // 多云
      return 'linear-gradient(225deg, #dce7f7, #cbd6e5 48%, #a5b3c5);';
    default:
      return 'linear-gradient(225deg, #ffedd0, #dff3ff 48%, #bde1ff)';
  }
});

// 初始化
const initWeather = () => {
  getWeather().then((res) => {
    const data = res.data as any;
    if (data.info === 'OK' && data.lives.length) {
      weather.value = data.lives[0] as Weather;
      weatherIcon.value = iconMapping[weather.value.weather];
    }
  });
};

onMounted(() => {
  initWeather();
});
</script>

<style lang="scss" scoped>
.weather {
  background: v-bind(cardTheme);
}

.item {
  border-radius: 12px;
  height: 60px;
  align-items: center;
  justify-content: space-between;
  p {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60px;
    font-size: 12px;
    color: #3a3a3c;
    span {
      color: #8e8e94;
    }
  }
}
</style>
