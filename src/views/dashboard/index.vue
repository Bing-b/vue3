<template>
    <div id="home" class="relative h-full overflow-auto bg-[#f0f2f5] dark:bg-black dark:text-white">
      <h2 class="title flex items-center justify-between" data-intro="这是第一步😃" data-step="1"
        >组件 <el-button @click="initIntor">引导</el-button></h2
      >
      <div class="flex gap-8 rounded bg-white p-5 dark:bg-black">
        <!-- 倒计时 -->
        <CountDown data-intro="这是第二步🦝" data-step="2" />

        <!-- 日历 -->
        <calendar />

        <!-- 天气 -->
        <weather />

        <!-- 代码统计 -->
        <am-charts data-intro="结束了你嘞" data-step="3" />

        <!-- 存储空间 -->
        <StorageInsight />
      </div>

      <div class="mt-2 h-[calc(100%-300px)] bg-[#f0f2f5] dark:bg-black dark:text-white">
        <h2 class="title flex items-center justify-between">概览</h2>
        <!-- 概览面板 -->
        <div class="flex h-[calc(100%-50px)] gap-4">
           <InteractivePanel />

          <!-- 欢迎 -->
          <div
            class="flex h-full flex-1 flex-col gap-4 overflow-hidden p-3 pl-0 ">
            <Welcome />
            <div
              class="relative flex h-[calc(100%-120px)] w-full items-center justify-between overflow-hidden rounded-xl bg-white dark:bg-black">
              <info />
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script lang="ts" setup>
import { reactive, onMounted, useTemplateRef, ref } from 'vue';
import intro from 'intro.js';
import 'intro.js/introjs.css';
import useGlobalConfig from '@/store/modules/global';
import Calendar from './components/calendar.vue';
import CountDown from './components/countdown.vue';
import Weather from './components/weather.vue';
import AmCharts from './components/amCharts.vue';
import StorageInsight from './components/StorageInsight.vue';
import InteractivePanel from './components/InteractivePanel.vue';
import Welcome from './components/welcome.vue';
import Info from './components/info.vue';

// 获取全局配置
const globalConfigStore = useGlobalConfig();

// 启动引导页
const initIntor = () => {
  intro()
    .setOption('nextLabel', ' 下一步 ')
    .setOption('prevLabel', ' 上一步 ')
    .setOption('doneLabel', ' 完成 ')
    .start();
};

onMounted(() => {
});
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
