<template>
  <div id="home" class="relative h-full overflow-auto bg-[#f0f2f5] dark:bg-black dark:text-white">
    <h2 class="title flex items-center justify-between" data-intro="这是第一步😃" data-step="1"
      >概览 <el-button @click="initIntor">引导</el-button></h2
    >
    <div class="flex gap-8 rounded bg-white p-5 dark:bg-black">
      <Motion data-intro="这是第二步🦝" data-step="2">
        <!-- 倒计时 -->
        <CountDown />
      </Motion>

      <Motion :delay="200">
        <!-- 日历 -->
        <calendar />
      </Motion>

      <Motion :delay="300">
        <!-- 天气 -->
        <weather />
      </Motion>

      <Motion :delay="400" data-intro="结束了你嘞" data-step="3">
        <!-- 代码统计 -->
        <am-charts />
      </Motion>

      <Motion :delay="400">
        <div class="lottie rounded-[25px]">
          <!-- 动画 -->
          <LottieWeb />
        </div>
      </Motion>
    </div>

    <!-- 板块二 -->
    <div></div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, onMounted, onUnmounted } from 'vue';
import intro from 'intro.js';
import 'intro.js/introjs.css';
import Calendar from './components/calendar.vue';
import CountDown from './components/countdown.vue';
import Weather from './components/weather.vue';
import AmCharts from './components/amcharts.vue';
import LottieWeb from '@/views/lottie-web/index.vue';
import Motion from '@/utils/motion';
import useCancelRequest from '@/hooks/useCancelRequest';
import { testCancelApi } from '@/api/common';
import { ElMessage, ElMessageBox } from 'element-plus';

const { loadCancelAlert, cancelPendingAlert, signal } = useCancelRequest();

// 启动引导页
const initIntor = () => {
  intro()
    .setOption('nextLabel', ' 下一步 ')
    .setOption('prevLabel', ' 上一步 ')
    .setOption('doneLabel', ' 完成 ')
    .start();
};

const testCancel = () => {
  loadCancelAlert();
  testCancelApi('', signal.value)
    .then(() => {
      cancelPendingAlert();
    })
    .finally(() => {
      cancelPendingAlert();
      ElMessageBox.close();
    });
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
