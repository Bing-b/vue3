<template>
  <div class="weather-widget flex h-full w-full flex-col justify-between p-1">
    <div class="flex items-start justify-between">
      <div class="flex flex-col">
        <span
          class="text-xs font-semibold tracking-wider text-[#86868b] uppercase dark:text-[#a1a1a6]"
          >{{ weather.city }}</span
        >
        <h1 class="mt-1 text-4xl font-bold text-[#1d1d1f] dark:text-white"
          >{{ weather.temperature }}°</h1
        >
      </div>
      <img class="h-10 w-10 drop-shadow-md" :src="$getImg(`weather/${weatherIcon}.png`)" />
    </div>

    <div class="flex flex-col gap-1">
      <span class="text-sm font-medium text-[#1d1d1f] dark:text-white">{{ weather.weather }}</span>
      <span class="text-xs text-[#86868b] dark:text-[#a1a1a6]"
        >最高 {{ Number(weather.temperature) + 2 }}° 最低
        {{ Number(weather.temperature) - 2 }}°</span
      >
    </div>

    <div class="mt-2 grid grid-cols-2 gap-2">
      <div class="flex flex-col items-center rounded-xl bg-white/40 p-2 dark:bg-black/20">
        <span class="text-[10px] text-[#86868b]">湿度</span>
        <span class="text-xs font-semibold">{{ weather.humidity }}%</span>
      </div>
      <div class="flex flex-col items-center rounded-xl bg-white/40 p-2 dark:bg-black/20">
        <span class="text-[10px] text-[#86868b]">{{ weather.winddirection }}风</span>
        <span class="text-xs font-semibold">{{ weather.windpower }}级</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getWeather } from '@/api/common';
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
  少云: 101,
  晴间多云: 101,
  小雨: 305,
  中雨: 305,
  大雨: 305,
  阵雨: 305,
  霾: 151,
  雾: 151,
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

// 初始化
const initWeather = () => {
  getWeather().then((res) => {
    const data = res.data as any;
    if (data.info === 'OK' && data.lives.length) {
      weather.value = data.lives[0] as Weather;
      weatherIcon.value = iconMapping[weather.value.weather] || 104;
    }
  });
};

onMounted(() => {
  initWeather();
});
</script>
