<template>
  <div id="home" class="relative min-h-full overflow-x-hidden bg-[#f5f5f7] p-6 dark:bg-[#000000]">
    <div class="mx-auto max-w-[1600px]">
      <header class="mb-8 flex items-center justify-between px-2">
        <div class="flex flex-col">
          <h1 class="text-3xl font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]"
            >概览</h1
          >
          <p class="mt-1 text-sm font-medium text-[#86868b]">欢迎回来，这是您今天的运行概报。</p>
        </div>
        <div class="flex gap-3">
          <el-button
            class="apple-glass !rounded-full !border-none !px-6 transition-all hover:!bg-white/40"
            @click="initIntor">
            <template #icon
              ><el-icon><Guide /></el-icon
            ></template>
            引导
          </el-button>
        </div>
      </header>

      <!-- Top Widgets Row -->
      <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
        <div class="apple-card flex min-h-[140px] items-center justify-center">
          <CountDown />
        </div>
        <div class="apple-card min-h-[140px]">
          <calendar />
        </div>
        <div class="apple-card min-h-[140px]">
          <weather />
        </div>
        <div class="apple-card col-span-2 min-h-[140px] overflow-hidden !p-0">
          <Welcome />
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <!-- Interactive Panel -->
        <div class="apple-card col-span-12 min-h-[340px] lg:col-span-5">
          <InteractivePanel />
        </div>

        <!-- Info Widget -->
        <div class="apple-card col-span-12 min-h-[340px] !p-0 lg:col-span-7">
          <info />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';
import intro from 'intro.js';
import 'intro.js/introjs.css';
import Calendar from './components/calendar.vue';
import CountDown from './components/countdown.vue';
import Weather from './components/weather.vue';

import InteractivePanel from './components/InteractivePanel.vue';
import Welcome from './components/welcome.vue';
import Info from './components/info.vue';
import { Guide } from '@element-plus/icons-vue';

// 启动引导页
const initIntor = () => {
  intro()
    .setOption('nextLabel', ' 下一步 ')
    .setOption('prevLabel', ' 上一步 ')
    .setOption('doneLabel', ' 完成 ')
    .start();
};

onMounted(() => {});
</script>
<style lang="scss" scoped>
:deep(.el-progress__text) {
  color: #555 !important;
  font-size: 15px !important;
  font-family: 'MapleMono' !important;
}

:deep(.el-progress-circle__track) {
  stroke: #e7f0fd !important;
}

.dark .lottie {
  background-image: linear-gradient(120deg, #3e3e3e 0%, #2c2c2c 100%);
}

.lottie {
  background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
}

.tec {
  > div {
    display: flex;
    align-items: center;
    width: 33.33%;
    padding: 20px;
    //box-shadow: 1px 0 #f0f0f0, 0 1px #f0f0f0, 1px 1px #f0f0f0, 1px 0 #f0f0f0 inset, 0 1px #f0f0f0 inset;
    // transition: all .3s;

    p {
      margin-left: 24px;
      font-size: 18px;
      color: #444;
      display: flex;
      flex-direction: column;

      span {
        font-size: 14px;
        color: #666;
      }
    }
  }
}

:deep(.el-progress__text) {
  color: #fff;
}

:deep(.el-progress-circle__track) {
  stroke: #8c746d;
}
</style>
